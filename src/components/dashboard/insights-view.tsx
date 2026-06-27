import {
  AlertTriangle,
  Award,
  Brain,
  Info,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getNearestPOI, isGridCode, MapModal } from "@/components/map";
import { cleanGamertag } from "./squad-sidebar";

interface PlayerMatchStats {
  active_class: string;
  assists: number;
  deaths: number;
  downs: number;
  kills: number;
  mental_state: number;
  revives: number;
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
}

export function InsightsView({
  matches,
  activeSession,
  sessionMatches,
  squad,
}: InsightsViewProps) {
  const [selectedPoiForMap, setSelectedPoiForMap] = useState<string>("");
  const [mapModalMode, setMapModalMode] = useState<
    "deploy" | "circle" | "death" | "second_deploy"
  >("deploy");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
    const isFatigued = gameCount >= 5;

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
          : `Llevan ${gameCount} partidas consecutivas en esta sesión. Los reflejos motores y la coordinación decaen drásticamente a partir de la 5ª ronda. Tomen 10 minutos para resetear la concentración.`,
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

  return (
    <div className="fade-in-50 animate-in space-y-6 duration-300">
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
            className={`relative overflow-hidden rounded-lg border p-5 ${
              fatigueAlert.isFatigued || fatigueAlert.isTilted
                ? "border-amber-500/20 bg-amber-500/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`rounded-full p-2.5 ${
                  fatigueAlert.isFatigued || fatigueAlert.isTilted
                    ? "animate-pulse bg-amber-500/10 text-amber-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {fatigueAlert.isFatigued || fatigueAlert.isTilted ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <Brain className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold font-mono text-foreground text-xs uppercase tracking-wider">
                  {fatigueAlert.title}
                </h4>
                <p className="font-light text-muted-foreground text-xs leading-relaxed">
                  {fatigueAlert.text}
                </p>
              </div>
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
