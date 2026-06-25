import type { Match, PlayerMatchStats } from "./dashboard-content";
import { cleanGamertag } from "./squad-sidebar";
import { Compass, ShieldAlert, Zap } from "lucide-react";

interface SessionLiveStatsProps {
  sessionMatches: Match[];
  // biome-ignore lint/suspicious/noExplicitAny: active players array
  activePlayers: any[];
  currentUserId?: string | null;
}

export function SessionLiveStats({
  sessionMatches,
  activePlayers,
  currentUserId,
}: SessionLiveStatsProps) {
  if (sessionMatches.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
        <span className="mb-4 text-3xl">📊</span>
        <h4 className="font-semibold text-foreground text-sm">
          Aún no hay datos para esta sesión
        </h4>
        <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
          Registra al menos una partida para visualizar el rendimiento en vivo del escuadrón.
        </p>
      </div>
    );
  }

  // 1. Calculate General Session Stats
  let totalKills = 0;
  let totalDowns = 0;
  let totalAssists = 0;
  let totalRevives = 0;
  let totalMatches = sessionMatches.length;
  let totalPlacements = 0;
  let totalWins = 0;

  for (const m of sessionMatches) {
    totalPlacements += m.placement || 0;
    if (m.placement === 1) {
      totalWins++;
    }
    if (m.player_match_stats) {
      for (const p of m.player_match_stats) {
        totalKills += p.kills || 0;
        totalDowns += p.downs || 0;
        totalAssists += p.assists || 0;
        totalRevives += p.revives || 0;
      }
    }
  }

  const sessionKdr = totalDowns > 0 ? (totalKills / totalDowns).toFixed(2) : totalKills.toFixed(2);
  const avgPlacement = (totalPlacements / totalMatches).toFixed(1);
  const winRate = ((totalWins / totalMatches) * 100).toFixed(0);

  // 2. Class distribution in this session
  const classCounts: Record<string, number> = {};
  let totalStatsCount = 0;
  for (const m of sessionMatches) {
    if (m.player_match_stats) {
      for (const p of m.player_match_stats) {
        const cls = p.active_class || "Asalto";
        classCounts[cls] = (classCounts[cls] || 0) + 1;
        totalStatsCount++;
      }
    }
  }

  // 3. Drop Zone (POI) performance in this session
  const poiStats: Record<string, { count: number; totalPlacement: number; wins: number }> = {};
  for (const m of sessionMatches) {
    const poi = m.poi || "Desconocido";
    if (!poiStats[poi]) {
      poiStats[poi] = { count: 0, totalPlacement: 0, wins: 0 };
    }
    poiStats[poi].count++;
    poiStats[poi].totalPlacement += m.placement || 0;
    if (m.placement === 1) {
      poiStats[poi].wins++;
    }
  }

  const sortedPois = Object.entries(poiStats)
    .map(([name, stat]) => ({
      name,
      count: stat.count,
      avgPlacement: stat.totalPlacement / stat.count,
      winRate: (stat.wins / stat.count) * 100,
    }))
    .sort((a, b) => a.avgPlacement - b.avgPlacement);

  // 4. Fatigue Coach & Tilt logic
  const alerts: string[] = [];
  const suggestions: string[] = [];

  // Match count fatigue
  if (totalMatches >= 5) {
    alerts.push(`🔋 Sesión Prolongada: Han completado ${totalMatches} partidas.`);
    suggestions.push("Recomendación: Estiren las piernas, hidratación rápida y un descanso de 5 minutos antes del próximo despliegue.");
  }

  // Mental state / Tilt check (last match)
  const lastMatch = sessionMatches[sessionMatches.length - 1];
  if (lastMatch && lastMatch.player_match_stats && lastMatch.player_match_stats.length > 0) {
    const mentalStates = lastMatch.player_match_stats.map((p) => p.mental_state || 3);
    const avgMental = mentalStates.reduce((a, b) => a + b, 0) / mentalStates.length;

    if (avgMental < 3.0) {
      alerts.push("⚠️ Alerta de Tilt / Frustración: El estado de ánimo promedio del equipo bajó de la media tras la última partida.");
      suggestions.push("Estrategia Táctica: Cambiar a estilo defensivo. Evitar drop zones congestionadas (Hot Drops) y enfocarse en control periférico.");
    }
  }

  // Performance based insights
  const worstPlacements = sessionMatches.filter((m) => m.placement >= 10).length;
  if (worstPlacements >= 3) {
    alerts.push("📉 Mala Racha: Tienen 3 o más partidas con rendimiento en Top 10+.");
    suggestions.push("Ajuste de Composición: Revisen los roles. Aseguren al menos un Soporte (Médico) e Ingeniero para control de vehículos.");
  }

  return (
    <div className="mt-4 space-y-5 animate-in fade-in-50 duration-200">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
          <p className="font-mono text-[9px] text-muted-foreground uppercase">KDR </p>
          <p className="mt-1 font-bold text-xl text-primary font-sans">{sessionKdr}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
          <p className="font-mono text-[9px] text-muted-foreground uppercase">Partidas</p>
          <p className="mt-1 font-bold text-xl text-foreground font-sans">{totalMatches}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
          <p className="font-mono text-[9px] text-muted-foreground uppercase">Prom. Puesto</p>
          <p className="mt-1 font-bold text-xl text-foreground font-sans">#{avgPlacement}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
          <p className="font-mono text-[9px] text-muted-foreground uppercase">Win Rate</p>
          <p className="mt-1 font-bold text-xl text-emerald-500 font-sans">{winRate}%</p>
        </div>
      </div>

      {/* Roster Live Combat Stats */}
      <div className="rounded-lg border border-border bg-card/40 p-4">
        <h4 className="flex items-center gap-1.5 font-bold text-foreground text-xs uppercase tracking-wider mb-3">
          <Zap className="h-3.5 w-3.5 text-primary" /> Combate en la Sesión
        </h4>
        <div className="space-y-2.5">
          {activePlayers.map((player) => {
            const isMe = player.user_id === currentUserId;
            // Recalculate stats for this player specifically in this session
            let kills = 0;
            let downs = 0;
            let assists = 0;
            let revives = 0;
            
            for (const m of sessionMatches) {
              const stat = m.player_match_stats?.find((p) => p.gamertag === player.gamertag);
              if (stat) {
                kills += stat.kills || 0;
                downs += stat.downs || 0;
                assists += stat.assists || 0;
                revives += stat.revives || 0;
              }
            }

            const kdr = downs > 0 ? (kills / downs).toFixed(2) : kills.toFixed(2);

            return (
              <div className={`flex items-center justify-between rounded-md p-2 text-xs border ${isMe ? 'bg-primary/5 border-primary/20' : 'bg-background/20 border-border/40'}`} key={player.slot_number}>
                <div className="min-w-0 flex-1">
                  <span className={`font-bold ${isMe ? 'text-emerald-400' : 'text-foreground'}`}>
                    {cleanGamertag(player.gamertag)} {isMe && "(Tú)"}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Clase activa: <span className="font-mono text-foreground">{player.active_class}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right font-mono shrink-0">
                  <div className="text-[10px]">
                    <span className="text-muted-foreground">K/D/A:</span> {kills}/{downs}/{assists}
                  </div>
                  <div className="text-[10px] border-l border-border/30 pl-3">
                    <span className="text-muted-foreground">KDR:</span> <span className="font-bold text-primary">{kdr}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Coach Recommendations (Protocolo de fatiga) */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h4 className="flex items-center gap-1.5 font-bold text-primary text-xs uppercase tracking-wider mb-2.5">
          <ShieldAlert className="h-4 w-4" /> Coach Táctico (Fatiga & Tilt)
        </h4>
        {alerts.length === 0 ? (
          <p className="font-light text-muted-foreground text-xs">
            🟢 Escuadrón estable. Concentración óptima. Sigan comunicando y rotando de forma limpia.
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div className="space-y-1" key={idx}>
                <p className="font-semibold text-primary text-xs">{alert}</p>
                {suggestions[idx] && (
                  <p className="font-light text-foreground text-xs leading-relaxed pl-4 border-l-2 border-border/60">
                    {suggestions[idx]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POI Placement Leaderboard */}
      <div className="rounded-lg border border-border bg-card/40 p-4">
        <h4 className="flex items-center gap-1.5 font-bold text-foreground text-xs uppercase tracking-wider mb-3">
          <Compass className="h-3.5 w-3.5 text-muted-foreground" /> Drop Zones Hoy
        </h4>
        <div className="space-y-2">
          {sortedPois.slice(0, 3).map((poi) => (
            <div className="flex items-center justify-between text-xs border-border/20 border-b pb-2 last:border-0 last:pb-0" key={poi.name}>
              <div>
                <span className="font-semibold text-foreground">{poi.name}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Sembrado {poi.count} {poi.count === 1 ? 'vez' : 'veces'}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-muted-foreground">Puesto Promedio:</span> <span className="font-bold text-primary">#{poi.avgPlacement.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
