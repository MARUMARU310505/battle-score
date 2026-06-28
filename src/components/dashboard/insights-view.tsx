import {
  AlertTriangle,
  Award,
  Bot,
  Brain,
  Check,
  Coffee,
  Copy,
  FileDown,
  Info,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Terminal,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getNearestPOI, isGridCode, MapModal } from "@/components/map";
import { cleanGamertag } from "./squad-sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface PlayerMatchStats {
  active_class: string;
  assists: number;
  deaths: number;
  downs: number;
  kills: number;
  mental_state: number;
  points: number;
}

interface Match {
  created_at: string;
  elimination_cause: string;
  hostility: string;
  id: string;
  loot: string;
  placement: number;
  player_match_stats: PlayerMatchStats[];
  poi: string;
  session_id: string;
}

interface Session {
  created_at: string;
  id: string;
  label: string;
}

interface SquadMember {
  favorite_class: string;
  gamertag: string;
  id: string;
  level: number;
  slot_number: number;
}

interface Squad {
  id: string;
  members: SquadMember[];
  name: string;
}

interface InsightsViewProps {
  activeSession: Session | null;
  matches: Match[];
  sessionMatches: Match[];
  squad: Squad | null;
  isOwner: boolean;
  liveAnalysisMatch: Match | null;
  globalAnalysisMatch: Match | null;
}

const parseJson = (text: string | null) => {
  if (!text) {
    return null;
  }
  try {
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Error parsing AI response:", e);
    return null;
  }
};

export function InsightsView({
  matches,
  activeSession,
  sessionMatches,
  squad,
  isOwner,
  liveAnalysisMatch,
  globalAnalysisMatch,
}: InsightsViewProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [selectedPoiForMap, setSelectedPoiForMap] = useState<string>("");
  const [mapModalMode, setMapModalMode] = useState<
    "deploy" | "circle" | "death" | "second_deploy"
  >("deploy");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [tookBreak, setTookBreakState] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);

  const setTookBreak = (val: boolean) => {
    setTookBreakState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("battle-score-took-break", String(val));
    }
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyBriefing = () => {
    let text = `=== INFORME DE INTELIGENCIA TÁCTICA: ${squad?.name || "Escuadrón"} ===\n\n`;
    text += `📡 BRIEFING OPERATIVO:\n- ${briefing.title}\n  ${briefing.text}\n\n`;
    if (fatigueAlert) {
      text += `🔋 ESTADO FÍSICO Y FATIGA:\n- ${tookBreak ? "Recuperado (Descanso Reciente)" : fatigueAlert.title}\n  ${tookBreak ? "Se ha tomado una pausa para resetear reflejos y concentración." : fatigueAlert.text}\n\n`;
    }
    if (dropAnalysis.dropGanador) {
      const dropPoiName = isGridCode(dropAnalysis.dropGanador.name)
        ? `${dropAnalysis.dropGanador.name} - ${getNearestPOI(dropAnalysis.dropGanador.name)}`
        : dropAnalysis.dropGanador.name;
      text += `🟢 DROP RECOMENDADO: ${dropPoiName} (Puesto prom: #${dropAnalysis.dropGanador.avgPlacement.toFixed(1)})\n`;
    }
    if (dropAnalysis.rutaMuerte) {
      const deathPoiName = isGridCode(dropAnalysis.rutaMuerte.name)
        ? `${dropAnalysis.rutaMuerte.name} - ${getNearestPOI(dropAnalysis.rutaMuerte.name)}`
        : dropAnalysis.rutaMuerte.name;
      text += `🔴 EVITAR ZONA: ${deathPoiName} (Puesto prom: #${dropAnalysis.rutaMuerte.avgPlacement.toFixed(1)})\n`;
    }
    navigator.clipboard.writeText(text);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // AI states
  const [liveAnalysis, setLiveAnalysis] = useState<string | null>(null);
  const [globalAnalysis, setGlobalAnalysis] = useState<string | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedLive, setCopiedLive] = useState(false);
  const [copiedGlobal, setCopiedGlobal] = useState(false);

  // Load saved analysis and sync with live/global analysis from database props
  useEffect(() => {
    if (liveAnalysisMatch) {
      setLiveAnalysis(liveAnalysisMatch.elimination_cause);
    } else if (typeof window !== "undefined") {
      setLiveAnalysis(localStorage.getItem("battle-score-last-live-analysis"));
    }
  }, [liveAnalysisMatch]);

  useEffect(() => {
    if (globalAnalysisMatch) {
      setGlobalAnalysis(globalAnalysisMatch.elimination_cause);
    } else if (typeof window !== "undefined") {
      setGlobalAnalysis(localStorage.getItem("battle-score-last-global-analysis"));
    }
  }, [globalAnalysisMatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTookBreakState(
        localStorage.getItem("battle-score-took-break") === "true"
      );
    }
  }, []);

  const handleClearLive = async () => {
    setLiveAnalysis(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("battle-score-last-live-analysis");
    }
    if (activeSession) {
      await supabase
        .from("matches")
        .delete()
        .eq("session_id", activeSession.id)
        .eq("poi", "__ai_live_analysis__");
    }
  };

  const handleClearGlobal = async () => {
    setGlobalAnalysis(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("battle-score-last-global-analysis");
    }
    const sessionId = activeSession?.id || (matches.length > 0 ? matches[0].session_id : null);
    if (sessionId) {
      await supabase
        .from("matches")
        .delete()
        .eq("session_id", sessionId)
        .eq("poi", "__ai_global_analysis__");
    }
  };

  const handleLiveAnalysis = async () => {
    setAiError(null);
    const apiKey =
      typeof window === "undefined"
        ? ""
        : localStorage.getItem("battle-score-gemini-api-key") || "";
    if (!apiKey) {
      setAiError(
        "Por favor, configura tu API Key de Gemini en tu perfil para usar el análisis de IA."
      );
      return;
    }

    setLoadingLive(true);
    try {
      const liveSessionSummary = {
        squad_name: squad?.name || "Escuadrón",
        session_matches: sessionMatches.map((m, idx) => ({
          round: idx + 1,
          placement: m.placement,
          poi: m.poi || "Desconocido",
          loot: m.loot || "Normal",
          hostility: m.hostility || "Media",
          elimination_cause: m.elimination_cause || "Desconocida",
          stats:
            m.player_match_stats?.map((ps) => ({
              gamertag: ps.gamertag,
              class: ps.active_class,
              kills: ps.kills,
              downs: ps.downs,
              assists: ps.assists,
              mental_state: ps.mental_state,
            })) || [],
        })),
      };

      const promptText = `Eres un Coach Táctico de Élite de Battlefield Battle Royale.
Analiza la sesión activa de la escuadra y genera una evaluación en formato JSON plano y limpio (sin bloques de código markdown, sin \`\`\`json ni palabras introductorias).
No debes usar emociones, sentimientos, ni rodeos de felicitación. Tampoco debes mencionar el nombre del escuadrón. Debe ser frío, analítico y directo.

Datos de la sesión activa en JSON:
${JSON.stringify(liveSessionSummary, null, 2)}

Devuelve estrictamente un objeto JSON con este formato de llaves y valores:
{
  "estado_operativo": "EFICIENTE" | "ESTABLE" | "ALERTA_FATIGA" | "ALERTA_TILT",
  "diagnostico_corto": "Diagnóstico directo en una sola frase de máximo 15 palabras sin emociones.",
  "ajustes_tacticos": [
    "Ajuste específico 1 de máximo 15 palabras.",
    "Ajuste específico 2 de máximo 15 palabras."
  ],
  "objetivo_inmediato": "Objetivo numérico o métrica específica para la siguiente ronda en máximo 12 palabras."
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error de la API de Gemini: ${response.statusText}`);
      }

      const resJson = await response.json();
      const outputText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!outputText) {
        throw new Error("No se pudo obtener una respuesta válida de la IA.");
      }

      setLiveAnalysis(outputText);
      if (typeof window !== "undefined") {
        localStorage.setItem("battle-score-last-live-analysis", outputText);
      }

      if (activeSession) {
        // Delete previous live analysis if any
        await supabase
          .from("matches")
          .delete()
          .eq("session_id", activeSession.id)
          .eq("poi", "__ai_live_analysis__");

        // Insert new live analysis match
        const { error: insertError } = await supabase
          .from("matches")
          .insert({
            session_id: activeSession.id,
            poi: "__ai_live_analysis__",
            placement: 1,
            hostility: "Media",
            loot: "Normal",
            elimination_cause: outputText,
          });

        if (insertError) {
          throw new Error(`Error al guardar en Supabase: ${insertError.message}`);
        }
      }
    } catch (err) {
      console.error(err);
      setAiError(
        err instanceof Error
          ? err.message
          : "Error al conectar con la IA de Gemini."
      );
    } finally {
      setLoadingLive(false);
    }
  };

  const handleGlobalAnalysis = async () => {
    setAiError(null);
    const apiKey =
      typeof window === "undefined"
        ? ""
        : localStorage.getItem("battle-score-gemini-api-key") || "";
    if (!apiKey) {
      setAiError(
        "Por favor, configura tu API Key de Gemini en tu perfil para usar el análisis de IA."
      );
      return;
    }

    setLoadingGlobal(true);
    try {
      const poiStats: Record<string, { count: number; avgPlacement: number }> =
        {};
      matches.forEach((m) => {
        const poi = m.poi || "Desconocido";
        if (!poiStats[poi]) {
          poiStats[poi] = { count: 0, avgPlacement: 0 };
        }
        poiStats[poi].count++;
        poiStats[poi].avgPlacement += m.placement || 0;
      });
      const formattedPois = Object.entries(poiStats).map(([name, stat]) => ({
        name,
        rounds_played: stat.count,
        avg_placement: Number((stat.avgPlacement / stat.count).toFixed(1)),
      }));

      const formattedComps = squadCompositions.slice(0, 3).map((c) => ({
        classes: c.composition,
        rounds_played: c.count,
        avg_placement: Number(c.avgPlacement.toFixed(1)),
        win_rate: Number(c.winRate.toFixed(0)),
      }));

      const playerPerformance: Record<string, any> = {};
      matches.forEach((m) => {
        m.player_match_stats?.forEach((p) => {
          const tag = p.gamertag;
          const cls = p.active_class || "Asalto";
          if (!playerPerformance[tag]) {
            playerPerformance[tag] = {};
          }
          if (!playerPerformance[tag][cls]) {
            playerPerformance[tag][cls] = {
              kills: 0,
              downs: 0,
              assists: 0,
              rounds: 0,
            };
          }

          playerPerformance[tag][cls].kills += p.kills || 0;
          playerPerformance[tag][cls].downs += p.downs || 0;
          playerPerformance[tag][cls].assists += p.assists || 0;
          playerPerformance[tag][cls].rounds++;
        });
      });

      const formattedPlayers =
        squad?.members.map((m) => {
          const perf = playerPerformance[m.gamertag] || {};
          const classBreakdown = Object.entries(perf).map(
            ([cls, stats]: [string, any]) => ({
              class: cls,
              rounds: stats.rounds,
              kdr: Number(
                (
                  (stats.kills + stats.downs) /
                  Math.max(1, stats.rounds)
                ).toFixed(2)
              ),
            })
          );
          return {
            gamertag: m.gamertag,
            favorite_class: m.favorite_class,
            level: m.level,
            classes_efficiency: classBreakdown,
          };
        }) || [];

      const globalSummary = {
        squad_name: squad?.name || "Escuadrón",
        total_rounds: matches.length,
        avg_placement: Number(
          (
            matches.reduce((sum, m) => sum + (m.placement || 0), 0) /
            Math.max(1, matches.length)
          ).toFixed(1)
        ),
        death_causes: Array.from(
          new Set(matches.map((m) => m.elimination_cause))
        ).slice(0, 5),
        best_class_compositions: formattedComps,
        drop_zones_performance: formattedPois.slice(0, 5),
        players_tactical_breakdown: formattedPlayers,
      };

      const promptText = `Eres el Director Táctico y Analista de Datos del Comando de Operaciones de Battle Score.
Analiza el historial completo de la escuadra y genera un Dossier Táctico Estratégico formal en formato JSON plano y limpio (sin bloques de código markdown, sin \`\`\`json ni palabras introductorias).
No debes usar emociones, sentimientos, ni rodeos de felicitación. Tampoco debes mencionar el nombre del escuadrón. Debe ser frío, analítico y directo.

Datos históricos en JSON:
${JSON.stringify(globalSummary, null, 2)}

Devuelve estrictamente un objeto JSON con este formato de llaves y valores:
{
  "diagnostico_global": "Evaluación macro fría y directa de la efectividad general en un solo párrafo de máximo 25 palabras.",
  "fortalezas": [
    "Fortaleza identificada con métrica (máximo 12 palabras).",
    "Fortaleza identificada con métrica (máximo 12 palabras)."
  ],
  "vulnerabilidades": [
    "Vulnerabilidad crítica encontrada (máximo 12 palabras).",
    "Vulnerabilidad crítica encontrada (máximo 12 palabras)."
  ],
  "recomendacion_caida": {
    "optimo": "Zonas de caída recomendadas y por qué (máximo 15 palabras).",
    "excluir": "Zonas de caída a evitar y por qué (máximo 15 palabras)."
  },
  "perfiles_operadores": [
    {
      "gamertag": "Nombre del operador",
      "rol_optimo": "Clase sugerida",
      "metricas_clave": "KDR o eficiencia calculada",
      "directriz": "Acción requerida (máximo 12 palabras)"
    }
  ],
  "protocolo": [
    "Regla táctica 1 (máximo 12 palabras)",
    "Regla táctica 2 (máximo 12 palabras)"
  ]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error de la API de Gemini: ${response.statusText}`);
      }

      const resJson = await response.json();
      const outputText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!outputText) {
        throw new Error("No se pudo obtener una respuesta válida de la IA.");
      }

      setGlobalAnalysis(outputText);
      if (typeof window !== "undefined") {
        localStorage.setItem("battle-score-last-global-analysis", outputText);
      }

      const sessionId = activeSession?.id || (matches.length > 0 ? matches[0].session_id : null);
      if (sessionId) {
        // Delete previous global analysis if any
        await supabase
          .from("matches")
          .delete()
          .eq("session_id", sessionId)
          .eq("poi", "__ai_global_analysis__");

        // Insert new global analysis match
        const { error: insertError } = await supabase
          .from("matches")
          .insert({
            session_id: sessionId,
            poi: "__ai_global_analysis__",
            placement: 1,
            hostility: "Media",
            loot: "Normal",
            elimination_cause: outputText,
          });

        if (insertError) {
          throw new Error(`Error al guardar en Supabase: ${insertError.message}`);
        }
      }
    } catch (err) {
      console.error(err);
      setAiError(
        err instanceof Error
          ? err.message
          : "Error al conectar con la IA de Gemini."
      );
    } finally {
      setLoadingGlobal(false);
    }
  };

  // Core hooks are defined first. Empty state is checked before rendering.

  // 1. Briefing Pre-Partida Activo (Últimas 3 partidas)
  const briefing = useMemo(() => {
    const sorted = [...matches].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const last3 = sorted.slice(0, 3);

    if (last3.length < 3) {
      return {
        type: "info",
        title: "Briefing Táctico: Recolectando Datos",
        text: "Sigan registrando partidas para calibrar el analizador de rachas del Coach. De momento, mantengan comunicación limpia y aseguren el control de recursos iniciales.",
      };
    }

    const avgPlacement =
      last3.reduce((sum, m) => sum + (m.placement || 0), 0) / 3;

    if (avgPlacement <= 5.0) {
      return {
        type: "success",
        title: "Briefing Táctico: ¡Racha de Éxito! 🏆",
        text:
          "El escuadrón está dominando el mapa. Tienen un puesto promedio de #" +
          avgPlacement.toFixed(1) +
          " en las últimas 3 rondas. Sigan con el juego coordinado, presionen en combate de mediano alcance y mantengan la composición de clases activa.",
      };
    }
    if (avgPlacement >= 15.0) {
      return {
        type: "warning",
        title: "Briefing Táctico: Ajuste de Emergencia ⚠️",
        text:
          "Caídas rápidas consecutivas detectadas (puesto promedio #" +
          avgPlacement.toFixed(1) +
          "). Sugerencia del Coach: Evitar caídas calientes en POIs céntricos. Despliéguense en la periferia profunda del mapa (ej. Golf Course o Boutique District) y tómense los primeros 5 minutos estrictamente para saquear y asegurar recursos clave antes de confrontar.",
      };
    }
    return {
      type: "info",
      title: "Briefing Táctico: Consistencia Operativa 📡",
      text: "Rendimiento promedio estable. Para la siguiente ronda, el analizador sugiere priorizar el control de un vehículo táctico y coordinar la rotación antes del cierre del primer círculo para evitar emboscadas en zonas estrechas.",
    };
  }, [matches]);

  // 2. Coach de Fatiga y Protocolo de Descanso (Sesión Activa)
  const fatigueAlert = useMemo(() => {
    if (!activeSession) {
      return null;
    }

    const gameCount = sessionMatches.length;
    const isFatigued = gameCount >= 3;

    // Check mental state (tilt) of last match
    let isTilted = false;
    let avgMental = 5;
    if (gameCount > 0) {
      const lastMatch = [...sessionMatches].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      if (
        lastMatch &&
        lastMatch.player_match_stats &&
        lastMatch.player_match_stats.length > 0
      ) {
        const sumMental = lastMatch.player_match_stats.reduce(
          (sum, p) => sum + (p.mental_state || 5),
          0
        );
        avgMental = sumMental / lastMatch.player_match_stats.length;
        if (avgMental <= 2.5) {
          isTilted = true;
        }
      }
    }

    if (isFatigued || isTilted) {
      return {
        isFatigued,
        isTilted,
        avgMental,
        gameCount,
        title: isTilted
          ? "🚨 PROTOCOLO DE DESCANSO ACTIVADO (TILT)"
          : "⚠️ ADVERTENCIA DE FATIGA MENTAL",
        text: isTilted
          ? `El estado mental promedio del equipo descendió a ${avgMental.toFixed(1)}/5 tras la última ronda. La frustración y pérdida de paciencia incrementan los errores de posicionamiento. Se sugiere pausa obligatoria de 10-15 minutos.`
          : `Llevan ${gameCount} partidas consecutivas en esta sesión. Los reflejos motores y la coordinación decaen drásticamente a partir de la 3ª ronda. Tomen 10 minutos para resetear la concentración.`,
      };
    }

    return {
      isFatigued: false,
      isTilted: false,
      avgMental,
      gameCount,
      title: "🔋 Estado Físico del Escuadrón: Óptimo",
      text: "El equipo mantiene niveles de concentración estables. Continúen jugando manteniendo la rotación fluida y el control de mapas.",
    };
  }, [activeSession, sessionMatches]);

  // 3. Análisis de Composiciones de Escuadrón Óptimas
  const squadCompositions = useMemo(() => {
    const comps: Record<
      string,
      { count: number; sumPlacement: number; wins: number }
    > = {};

    for (const m of matches) {
      if (m.player_match_stats && m.player_match_stats.length > 0) {
        const classes = m.player_match_stats
          .map((p) => p.active_class || "Asalto")
          .sort();
        const key = classes.join(" + ");
        if (!comps[key]) {
          comps[key] = { count: 0, sumPlacement: 0, wins: 0 };
        }
        comps[key].count++;
        comps[key].sumPlacement += m.placement || 0;
        if (m.placement === 1) {
          comps[key].wins++;
        }
      }
    }

    const calculated = Object.entries(comps).map(([composition, stat]) => ({
      composition,
      count: stat.count,
      avgPlacement: stat.sumPlacement / stat.count,
      winRate: (stat.wins / stat.count) * 100,
    }));

    // Sort by win rate desc, then avg placement asc
    return calculated.sort(
      (a, b) => b.winRate - a.winRate || a.avgPlacement - b.avgPlacement
    );
  }, [matches]);

  // 4. Síndrome de Rol Equivocado
  const roleRecommendations = useMemo(() => {
    if (!(squad && squad.members)) {
      return [];
    }

    const playerStats: Record<
      string,
      Record<
        string,
        { kills: number; deaths: number; count: number; wins: number }
      >
    > = {};

    // Group player performance by gamertag and class
    for (const m of matches) {
      if (m.player_match_stats) {
        const isWin = m.placement === 1;
        for (const p of m.player_match_stats) {
          const tag = p.gamertag;
          const cls = p.active_class || "Asalto";

          if (!playerStats[tag]) {
            playerStats[tag] = {};
          }
          if (!playerStats[tag][cls]) {
            playerStats[tag][cls] = { kills: 0, deaths: 0, count: 0, wins: 0 };
          }

          playerStats[tag][cls].count++;
          playerStats[tag][cls].kills += p.kills || 0;
          playerStats[tag][cls].deaths += p.deaths || 0;
          if (isWin) {
            playerStats[tag][cls].wins++;
          }
        }
      }
    }

    const recs: Array<{
      gamertag: string;
      preferredClass: string;
      recClass: string;
      prefKDR: number;
      recKDR: number;
      prefCount: number;
      recCount: number;
      reason: string;
    }> = [];

    // Analyze performance vs favorite class
    for (const member of squad.members) {
      const tag = member.gamertag;
      const prefClass = member.favorite_class || "Asalto";
      const stats = playerStats[tag];

      if (!stats) {
        continue;
      }

      const prefStats = stats[prefClass] || {
        kills: 0,
        deaths: 0,
        count: 0,
        wins: 0,
      };
      const prefKDR =
        prefStats.deaths > 0
          ? prefStats.kills / prefStats.deaths
          : prefStats.kills;

      let bestAltClass = prefClass;
      let bestAltKDR = prefKDR;
      let bestAltStats = prefStats;

      for (const [cls, cStat] of Object.entries(stats)) {
        if (cls === prefClass) {
          continue;
        }
        if (cStat.count < 2) {
          continue; // Minimum 2 matches played to recommend
        }

        const altKDR =
          cStat.deaths > 0 ? cStat.kills / cStat.deaths : cStat.kills;
        if (altKDR > bestAltKDR) {
          bestAltKDR = altKDR;
          bestAltClass = cls;
          bestAltStats = cStat;
        }
      }

      // If alt KDR is at least 25% better than preferred KDR, recommend switch
      if (bestAltClass !== prefClass && bestAltKDR >= prefKDR * 1.25) {
        recs.push({
          gamertag: tag,
          preferredClass: prefClass,
          recClass: bestAltClass,
          prefKDR,
          recKDR: bestAltKDR,
          prefCount: prefStats.count,
          recCount: bestAltStats.count,
          reason: `Registra un KDR de ${bestAltKDR.toFixed(2)} como ${bestAltClass} (${bestAltStats.count} rondas) en comparación con un ${prefKDR.toFixed(2)} como ${prefClass} (su favorito, ${prefStats.count} rondas).`,
        });
      }
    }

    return recs;
  }, [matches, squad]);

  // 5. Análisis Táctico de Zonas (Drop zones)
  const dropAnalysis = useMemo(() => {
    const pois: Record<
      string,
      { count: number; totalPlacement: number; wins: number }
    > = {};
    for (const m of matches) {
      const poi = m.poi || "Desconocido";
      if (!pois[poi]) {
        pois[poi] = { count: 0, totalPlacement: 0, wins: 0 };
      }
      pois[poi].count++;
      pois[poi].totalPlacement += m.placement || 0;
      if (m.placement === 1) {
        pois[poi].wins++;
      }
    }

    const calculated = Object.entries(pois).map(([name, stat]) => ({
      name,
      count: stat.count,
      avgPlacement: stat.totalPlacement / stat.count,
      winRate: (stat.wins / stat.count) * 100,
    }));

    const sortedByPlacement = [...calculated].sort(
      (a, b) => a.avgPlacement - b.avgPlacement
    );
    const dropGanador = sortedByPlacement[0] || null;
    const rutaMuerte = sortedByPlacement[sortedByPlacement.length - 1] || null;

    return {
      dropGanador,
      rutaMuerte,
    };
  }, [matches]);

  // If no matches registered, return empty state
  if (!matches || matches.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-16 text-center">
        <span className="mb-4 text-4xl">💡</span>
        <h4 className="font-semibold text-foreground text-sm">
          Analizador Táctico Desactivado
        </h4>
        <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs leading-relaxed">
          Registra al menos una partida para que el Coach Táctico analice
          vuestro historial y genere briefing operativo, alertas de fatiga y
          recomendaciones de roles.
        </p>
      </div>
    );
  }

  if (isRefreshing) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-card/30 p-12 text-center text-muted-foreground backdrop-blur-md">
        <RefreshCw className="mb-4 h-8 w-8 animate-spin text-primary" />
        <h4 className="animate-pulse font-mono font-semibold text-foreground text-sm uppercase tracking-wider">
          Sincronizando Tácticas e Intel...
        </h4>
        <p className="mt-1.5 max-w-xs font-light text-muted-foreground text-xs leading-relaxed">
          Procesando el historial del escuadrón y recalculando indicadores
          operativos en tiempo real.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-50 animate-in space-y-6 duration-300">
      {/* Tactical Intel Header Toolbar */}
      <div className="flex flex-col justify-between gap-4 border-border/40 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 font-bold font-mono text-foreground text-sm uppercase tracking-widest">
            <Brain className="h-4 w-4 text-primary" />
            Centro de Inteligencia Operativa (CIO)
          </h2>
          <p className="font-light text-muted-foreground text-xs">
            Análisis heurístico en tiempo real del desempeño de la escuadra y
            recomendaciones operativas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground text-xs shadow-xs transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
            disabled={isRefreshing}
            onClick={handleRefresh}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`}
            />
            <span>{isRefreshing ? "Calibrando..." : "Sincronizar"}</span>
          </button>

          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground text-xs shadow-xs transition-all hover:bg-muted active:scale-95"
            onClick={handleCopyBriefing}
          >
            {copiedBriefing ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copiar Informe</span>
              </>
            )}
          </button>

          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground text-xs shadow-xs transition-all hover:bg-muted active:scale-95"
            onClick={() => window.print()}
          >
            <FileDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Imprimir Intel</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Command Center */}
      <div className="rounded-xl border border-border bg-card/30 p-5 backdrop-blur-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Bot className={`h-5 w-5 ${isOwner ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <h3 className="font-mono font-bold text-foreground text-xs uppercase tracking-wider">
                Analizador Táctico con Inteligencia Artificial
              </h3>
              <p className="font-light text-[10px] text-muted-foreground">
                {isOwner 
                  ? "Usa tu Gemini API Key configurada para diagnosticar la sesión o tu historial global."
                  : "El análisis de IA es generado y sincronizado en tiempo real por el líder de la escuadra."}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap gap-2.5">
              {activeSession && sessionMatches.length > 0 && (
                <button
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-semibold text-emerald-400 text-xs transition-all hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50"
                  disabled={loadingLive || loadingGlobal}
                  onClick={handleLiveAnalysis}
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${loadingLive ? "animate-spin" : ""}`}
                  />
                  <span>
                    {loadingLive ? "Analizando..." : "Analizar Sesión en Vivo"}
                  </span>
                </button>
              )}

              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3.5 py-2 font-semibold text-blue-400 text-xs transition-all hover:bg-blue-500/20 active:scale-95 disabled:opacity-50"
                disabled={loadingLive || loadingGlobal || matches.length === 0}
                onClick={handleGlobalAnalysis}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${loadingGlobal ? "animate-spin" : ""}`}
                />
                <span>
                  {loadingGlobal
                    ? "Generando Dossier..."
                    : "Generar Dossier Global"}
                </span>
              </button>
            </div>
          )}
        </div>

        {isOwner && aiError && (
          <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive text-xs">
            {aiError}
          </div>
        )}
      </div>

      {/* Empty State for Non-Owners */}
      {!isOwner && !liveAnalysis && !globalAnalysis && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-16 text-center">
          <span className="mb-4 text-4xl">📡</span>
          <h4 className="font-semibold text-foreground text-sm uppercase font-mono tracking-wider">
            Enlace de Inteligencia Táctica Desconectado
          </h4>
          <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs leading-relaxed">
            El líder de la escuadra aún no ha generado informes tácticos por IA para esta sesión. Una vez generados, aparecerán aquí automáticamente en tiempo real.
          </p>
        </div>
      )}

      {/* AI Analysis Terminal Outputs */}
      {(loadingLive || liveAnalysis) && (
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-card/40 p-6 font-mono shadow-md backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between border-emerald-500/10 border-b pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Terminal className="h-4 w-4" />
              <span className="font-bold text-[11px] uppercase tracking-wider">
                📡 TERMINAL DE INTELIGENCIA: ANÁLISIS EN VIVO
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!loadingLive && (
                <>
                  <button
                    className="cursor-pointer rounded-sm border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 text-[10px] text-emerald-400 transition-all hover:bg-emerald-500/10"
                    onClick={() => {
                      navigator.clipboard.writeText(liveAnalysis || "");
                      setCopiedLive(true);
                      setTimeout(() => setCopiedLive(false), 2000);
                    }}
                  >
                    {copiedLive ? "¡Copiado!" : "Copiar"}
                  </button>
                  {isOwner && (
                    <button
                      className="cursor-pointer rounded-sm border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground transition-all hover:bg-muted"
                      onClick={handleClearLive}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {loadingLive ? (
            <div className="flex flex-col items-center justify-center py-10 text-emerald-400/70 text-xs">
              <RefreshCw className="mb-3 h-6 w-6 animate-spin text-emerald-400" />
              <div className="space-y-1 text-center">
                <p className="animate-pulse font-bold text-[10px] uppercase tracking-widest">
                  [ CONEXIÓN EN COMPILACIÓN DE DATOS ]
                </p>
                <p className="text-[10px] text-emerald-500/50">
                  &gt; Procesando KDR, desvíos mentales y despliegues...
                </p>
              </div>
            </div>
          ) : (
            (() => {
              const data = parseJson(liveAnalysis);
              if (!data) {
                return (
                  <div className="py-4 text-red-400 text-xs">
                    [ ERROR: No se pudo parsear el informe táctico. Intenta de
                    nuevo. ]
                  </div>
                );
              }

              const stateColors = {
                EFICIENTE: "border-green-500/30 bg-green-500/10 text-green-400",
                ESTABLE: "border-blue-500/30 bg-blue-500/10 text-blue-400",
                ALERTA_FATIGA:
                  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
                ALERTA_TILT: "border-red-500/30 bg-red-500/10 text-red-400",
              };

              const stateColor =
                stateColors[
                  data.estado_operativo as keyof typeof stateColors
                ] || stateColors.ESTABLE;

              return (
                <div className="space-y-5 text-emerald-400/90 text-xs leading-relaxed">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] text-emerald-500/50 uppercase tracking-widest">
                      Estado Operativo:
                    </span>
                    <span
                      className={`rounded-sm border px-2 py-0.5 font-bold text-[10px] ${stateColor}`}
                    >
                      {data.estado_operativo}
                    </span>
                  </div>

                  <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">
                    <div className="mb-1 font-bold text-[10px] text-emerald-500/60 uppercase">
                      Diagnóstico Táctico:
                    </div>
                    <p className="font-light">{data.diagnostico_corto}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="font-bold text-[10px] text-emerald-500/60 uppercase">
                        Ajustes Requeridos:
                      </div>
                      <ul className="list-inside list-disc space-y-1.5 font-light">
                        {Array.isArray(data.ajustes_tacticos) &&
                          data.ajustes_tacticos.map(
                            (item: string, i: number) => <li key={i}>{item}</li>
                          )}
                      </ul>
                    </div>

                    <div className="flex flex-col justify-center space-y-1.5 rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3.5">
                      <div className="font-bold text-[10px] text-emerald-500/60 uppercase">
                        Objetivo de Ronda:
                      </div>
                      <p className="font-bold font-mono text-emerald-300 text-sm tracking-wide">
                        ⚡ {data.objetivo_inmediato}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {(loadingGlobal || globalAnalysis) && (
        <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-card/40 p-6 font-mono shadow-md backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between border-blue-500/10 border-b pb-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Terminal className="h-4 w-4" />
              <span className="font-bold text-[11px] uppercase tracking-wider">
                🔵 DOSSIER OPERATIVO ESTRATÉGICO GLOBAL
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!loadingGlobal && (
                <>
                  <button
                    className="cursor-pointer rounded-sm border border-blue-500/30 bg-blue-500/5 px-2 py-0.5 text-[10px] text-blue-400 transition-all hover:bg-blue-500/10"
                    onClick={() => {
                      navigator.clipboard.writeText(globalAnalysis || "");
                      setCopiedGlobal(true);
                      setTimeout(() => setCopiedGlobal(false), 2000);
                    }}
                  >
                    {copiedGlobal ? "¡Copiado!" : "Copiar"}
                  </button>
                  {isOwner && (
                    <button
                      className="cursor-pointer rounded-sm border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground transition-all hover:bg-muted"
                      onClick={handleClearGlobal}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {loadingGlobal ? (
            <div className="flex flex-col items-center justify-center py-10 text-blue-400/70 text-xs">
              <RefreshCw className="mb-3 h-6 w-6 animate-spin text-blue-400" />
              <div className="space-y-1 text-center">
                <p className="animate-pulse font-bold text-[10px] uppercase tracking-widest">
                  [ GENERANDO INFORME ESTRATÉGICO GLOBAL ]
                </p>
                <p className="text-[10px] text-blue-500/50">
                  &gt; Compilando partidas globales y eficiencias de
                  operadores...
                </p>
              </div>
            </div>
          ) : (
            (() => {
              const data = parseJson(globalAnalysis);
              if (!data) {
                return (
                  <div className="py-4 text-red-400 text-xs">
                    [ ERROR: No se pudo parsear el dossier táctico. Intenta de
                    nuevo. ]
                  </div>
                );
              }

              return (
                <div className="space-y-5 text-blue-400/90 text-xs leading-relaxed">
                  <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-4">
                    <div className="mb-1 font-bold text-[10px] text-blue-500/60 uppercase">
                      Evaluación Estratégica Global:
                    </div>
                    <p className="font-light">{data.diagnostico_global}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2 rounded-lg border border-blue-500/10 bg-blue-500/5 p-3.5">
                      <div className="font-bold text-[10px] text-green-400/80 uppercase">
                        ✚ Fortalezas Operativas:
                      </div>
                      <ul className="list-inside list-disc space-y-1 font-light text-green-400/90">
                        {Array.isArray(data.fortalezas) &&
                          data.fortalezas.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                      </ul>
                    </div>

                    <div className="space-y-2 rounded-lg border border-blue-500/10 bg-blue-500/5 p-3.5">
                      <div className="font-bold text-[10px] text-red-400/80 uppercase">
                        🗙 Vulnerabilidades Críticas:
                      </div>
                      <ul className="list-inside list-disc space-y-1 font-light text-red-400/90">
                        {Array.isArray(data.vulnerabilidades) &&
                          data.vulnerabilidades.map(
                            (item: string, i: number) => <li key={i}>{item}</li>
                          )}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="font-bold text-[10px] text-blue-500/60 uppercase">
                        🗺️ Zonas de Despliegue:
                      </div>
                      <div className="space-y-2 font-light">
                        <div className="rounded border border-emerald-500/10 bg-emerald-500/5 p-2.5">
                          <span className="font-bold text-[10px] text-emerald-400 uppercase">
                            Lanzamiento Óptimo:
                          </span>
                          <p className="mt-1 text-emerald-400/90">
                            {data.recomendacion_caida?.optimo}
                          </p>
                        </div>
                        <div className="rounded border border-red-500/10 bg-red-500/5 p-2.5">
                          <span className="font-bold text-[10px] text-red-400 uppercase">
                            Zona de Exclusión:
                          </span>
                          <p className="mt-1 text-red-400/90">
                            {data.recomendacion_caida?.excluir}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-[10px] text-blue-500/60 uppercase">
                        📋 Protocolo Directivo:
                      </div>
                      <ol className="list-inside list-decimal space-y-1.5 font-light">
                        {Array.isArray(data.protocolo) &&
                          data.protocolo.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                      </ol>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold text-[10px] text-blue-500/60 uppercase">
                      👥 Diagnóstico de Operadores:
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.isArray(data.perfiles_operadores) &&
                        data.perfiles_operadores.map(
                          (player: any, i: number) => (
                            <div
                              className="space-y-1 rounded-lg border border-blue-500/15 bg-blue-500/5 p-3"
                              key={i}
                            >
                              <div className="font-bold text-blue-300 text-xs">
                                {player.gamertag}
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-blue-500/70">
                                  Rol Ideal:
                                </span>
                                <span className="font-semibold text-blue-400">
                                  {player.rol_optimo}
                                </span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-blue-500/70">
                                  Rendimiento:
                                </span>
                                <span className="font-semibold text-blue-400">
                                  {player.metricas_clave}
                                </span>
                              </div>
                              <p className="mt-1 border-blue-500/10 border-t pt-1 font-light text-[10px] text-blue-400/70">
                                ➔ {player.directriz}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* Grid: Briefing Pre-partida y Coach de Fatiga */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Briefing panel */}
        <div
          className={`relative overflow-hidden rounded-lg border p-5 lg:col-span-2 ${
            briefing.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/5"
              : briefing.type === "warning"
                ? "border-destructive/20 bg-destructive/5"
                : "border-border bg-card"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`rounded-full p-2.5 ${
                briefing.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : briefing.type === "warning"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {briefing.type === "success" ? (
                <Award className="h-6 w-6" />
              ) : briefing.type === "warning" ? (
                <ShieldAlert className="h-6 w-6" />
              ) : (
                <Info className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-bold font-mono text-foreground text-xs uppercase tracking-wider">
                {briefing.title}
              </h4>
              <p className="font-light text-muted-foreground text-xs leading-relaxed">
                {briefing.text}
              </p>
            </div>
          </div>
        </div>

        {/* Fatigue Coach panel */}
        {fatigueAlert && (
          <div
            className={`relative overflow-hidden rounded-lg border p-5 transition-all duration-300 ${
              tookBreak
                ? "border-emerald-500/20 bg-emerald-500/5"
                : fatigueAlert.isFatigued || fatigueAlert.isTilted
                  ? "border-amber-500/20 bg-amber-500/5 shadow-xs"
                  : "border-border bg-card"
            }`}
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="flex items-start gap-3.5">
                <div
                  className={`rounded-full p-2.5 transition-colors ${
                    tookBreak
                      ? "bg-emerald-500/10 text-emerald-400"
                      : fatigueAlert.isFatigued || fatigueAlert.isTilted
                        ? "animate-pulse bg-amber-500/10 text-amber-400"
                        : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {tookBreak ? (
                    <Coffee className="h-5 w-5" />
                  ) : fatigueAlert.isFatigued || fatigueAlert.isTilted ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <Brain className="h-5 w-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold font-mono text-foreground text-xs uppercase tracking-wider">
                    {tookBreak
                      ? "🔋 Estado Físico del Escuadrón: Recuperado"
                      : fatigueAlert.title}
                  </h4>
                  <p className="font-light text-muted-foreground text-xs leading-relaxed">
                    {tookBreak
                      ? "Se ha registrado un descanso reciente en esta sesión. Los niveles de estrés táctico y fatiga visual se han restablecido correctamente. ¡Buen trabajo!"
                      : fatigueAlert.text}
                  </p>
                </div>
              </div>

              {/* Action buttons inside the card */}
              {isOwner && (fatigueAlert.gameCount > 0 || tookBreak) && (
                <div className="self-end sm:self-start">
                  {tookBreak ? (
                    <button
                      className="cursor-pointer rounded border border-border bg-card px-2.5 py-1 text-[10px] text-muted-foreground transition-all hover:bg-muted active:scale-95"
                      onClick={() => setTookBreak(false)}
                    >
                      Restaurar Alerta
                    </button>
                  ) : (
                    <button
                      className="inline-flex cursor-pointer items-center gap-1 rounded bg-amber-500 px-3 py-1 font-semibold text-[11px] text-background shadow-sm transition-all hover:bg-amber-400 active:scale-95"
                      onClick={() => setTookBreak(true)}
                    >
                      <Coffee className="h-3 w-3 animate-bounce" />
                      <span>Registrar Descanso</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Insights Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Composición Óptima */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-1.5 border-border/40 border-b pb-3 font-bold font-mono text-foreground text-xs uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Composiciones Óptimas de Clases
          </h3>
          {squadCompositions.length === 0 ? (
            <p className="py-6 text-center font-light text-muted-foreground text-xs">
              Registra composiciones de escuadrón en tus partidas.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="font-light text-[11px] text-muted-foreground leading-relaxed">
                Análisis histórico de las combinaciones de clase que resultan en
                mejor posicionamiento y porcentaje de victorias:
              </p>
              <div className="divide-y divide-border/40">
                {squadCompositions.slice(0, 3).map((comp, idx) => (
                  <div
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    key={comp.composition}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] ${
                            idx === 0
                              ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <span className="font-mono font-semibold text-foreground text-xs">
                          {comp.composition}
                        </span>
                      </div>
                      <p className="font-light text-[10px] text-muted-foreground">
                        Jugada en {comp.count}{" "}
                        {comp.count === 1 ? "ronda" : "rondas"}
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="font-bold text-foreground">
                        Puesto: #{comp.avgPlacement.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        WR: {comp.winRate.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Síndrome del Rol Equivocado */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-1.5 border-border/40 border-b pb-3 font-bold font-mono text-foreground text-xs uppercase tracking-wider">
            <User className="h-4 w-4 text-primary" />
            Síndrome del Rol Equivocado
          </h3>
          <div className="space-y-4">
            {roleRecommendations.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-light text-muted-foreground text-xs">
                  ✅ Todos los operadores juegan en coherencia con su
                  rendimiento estadístico óptimo.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-light text-[11px] text-muted-foreground leading-relaxed">
                  Operadores que registran una efectividad de combate (KDR)
                  significativamente mayor en un rol diferente a su clase
                  favorita preestablecida:
                </p>
                <div className="space-y-3.5">
                  {roleRecommendations.map((rec) => (
                    <div
                      className="space-y-2 rounded-md border border-border bg-background p-3.5"
                      key={rec.gamertag}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs">
                          {cleanGamertag(rec.gamertag)}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span className="text-muted-foreground">
                            {rec.preferredClass}
                          </span>
                          <span className="text-muted-foreground/40">➔</span>
                          <span className="font-bold text-emerald-400">
                            {rec.recClass}
                          </span>
                        </div>
                      </div>
                      <p className="font-light text-[10px] text-muted-foreground leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Drop Zones recomendadas/evitar */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {dropAnalysis.dropGanador && (
          <div
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/10"
            onClick={() => {
              setSelectedPoiForMap(dropAnalysis.dropGanador.name);
              setMapModalMode("deploy");
              setIsMapModalOpen(true);
            }}
          >
            <div className="absolute top-4 right-4 rounded-full bg-emerald-500/10 p-2 transition-colors group-hover:bg-emerald-500/20">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <h4 className="font-bold font-mono text-emerald-400 text-xs uppercase tracking-widest">
              🟢 Drop Zone Recomendada
            </h4>
            <p className="mt-2 font-bold text-foreground text-lg transition-colors group-hover:text-emerald-400">
              {isGridCode(dropAnalysis.dropGanador.name)
                ? `${dropAnalysis.dropGanador.name} - ${getNearestPOI(dropAnalysis.dropGanador.name)}`
                : dropAnalysis.dropGanador.name}
            </p>
            <p className="mt-1 max-w-sm font-light text-muted-foreground text-xs leading-relaxed">
              Esta zona de despliegue inicial provee la tasa de supervivencia
              promedio más alta y la mayor estabilidad estratégica al inicio de
              la ronda.
            </p>
            <div className="mt-4 flex items-center justify-between font-mono text-muted-foreground text-xs">
              <span>
                Puesto Promedio:{" "}
                <span className="font-bold text-emerald-400">
                  #{dropAnalysis.dropGanador.avgPlacement.toFixed(1)}
                </span>
              </span>
              <span>
                Despliegues:{" "}
                <span className="font-bold text-foreground">
                  {dropAnalysis.dropGanador.count}
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 font-mono text-[10px] text-emerald-500/70 transition-colors group-hover:text-emerald-400">
              <span>➔ Clic para ver en el mapa</span>
            </div>
          </div>
        )}

        {dropAnalysis.rutaMuerte && (
          <div
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 p-5 shadow-xs transition-all duration-200 hover:border-destructive/40 hover:bg-destructive/10"
            onClick={() => {
              setSelectedPoiForMap(dropAnalysis.rutaMuerte.name);
              setMapModalMode("death");
              setIsMapModalOpen(true);
            }}
          >
            <div className="absolute top-4 right-4 rounded-full bg-destructive/10 p-2 transition-colors group-hover:bg-destructive/20">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <h4 className="font-bold font-mono text-destructive text-xs uppercase tracking-widest">
              🔴 Ruta de la Muerte a Evitar
            </h4>
            <p className="mt-2 font-bold text-foreground text-lg transition-colors group-hover:text-destructive">
              {isGridCode(dropAnalysis.rutaMuerte.name)
                ? `${dropAnalysis.rutaMuerte.name} - ${getNearestPOI(dropAnalysis.rutaMuerte.name)}`
                : dropAnalysis.rutaMuerte.name}
            </p>
            <p className="mt-1 max-w-sm font-light text-muted-foreground text-xs leading-relaxed">
              Zonas con alta incidencia de wipes de escuadrón tempranos o bajo
              posicionamiento final. Se aconseja evitar en el briefing de
              despliegue.
            </p>
            <div className="mt-4 flex items-center justify-between font-mono text-muted-foreground text-xs">
              <span>
                Puesto Promedio:{" "}
                <span className="font-bold text-destructive">
                  #{dropAnalysis.rutaMuerte.avgPlacement.toFixed(1)}
                </span>
              </span>
              <span>
                Despliegues:{" "}
                <span className="font-bold text-foreground">
                  {dropAnalysis.rutaMuerte.count}
                </span>
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 font-mono text-[10px] text-destructive/70 transition-colors group-hover:text-destructive">
              <span>➔ Clic para ver en el mapa</span>
            </div>
          </div>
        )}
      </div>

      {/* Map modal for dropdown/routing triggers */}
      <MapModal
        isOpen={isMapModalOpen}
        mode={mapModalMode}
        onClose={() => setIsMapModalOpen(false)}
        readOnly={true}
        selectedGrid={selectedPoiForMap}
      />
    </div>
  );
}
