import type { Match, PlayerMatchStats } from "./dashboard-content";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";
import { BarChart3, Compass, Heart, ShieldAlert, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { useMemo } from "react";

interface StatsViewProps {
  matches: Match[];
  // biome-ignore lint/suspicious/noExplicitAny: squad structure
  squad: any;
  currentUserId?: string | null;
}

export function StatsView({ matches, squad, currentUserId }: StatsViewProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-16 text-center">
        <span className="mb-4 text-4xl">📈</span>
        <h4 className="font-semibold text-foreground text-sm">
          Aún no hay estadísticas acumuladas
        </h4>
        <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs leading-relaxed">
          Las estadísticas históricas y análisis tácticos del escuadrón se generarán automáticamente conforme jueguen y registren partidas en sus sesiones.
        </p>
      </div>
    );
  }

  // 1. Calculate General Metrics
  const summary = useMemo(() => {
    let totalKills = 0;
    let totalDowns = 0;
    let totalAssists = 0;
    let totalRevives = 0;
    const totalMatches = matches.length;
    let totalWins = 0;
    let sumPlacement = 0;

    for (const m of matches) {
      sumPlacement += m.placement || 0;
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

    const globalKdr = totalDowns > 0 ? totalKills / totalDowns : totalKills;
    const avgPlacement = sumPlacement / totalMatches;
    const winRate = (totalWins / totalMatches) * 100;

    return {
      totalKills,
      totalDowns,
      totalAssists,
      totalRevives,
      totalMatches,
      totalWins,
      globalKdr: globalKdr.toFixed(2),
      avgPlacement: avgPlacement.toFixed(1),
      winRate: winRate.toFixed(0),
    };
  }, [matches]);

  // 2. Drop Zone (POI) Analysis
  const dropZones = useMemo(() => {
    const pois: Record<string, { count: number; totalPlacement: number; wins: number }> = {};
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

    const sortedByPlacement = [...calculated].sort((a, b) => a.avgPlacement - b.avgPlacement);
    const dropGanador = sortedByPlacement[0] || null;
    const rutaMuerte = sortedByPlacement[sortedByPlacement.length - 1] || null;

    return {
      all: sortedByPlacement,
      dropGanador,
      rutaMuerte,
    };
  }, [matches]);

  // 3. Anatomía de la Derrota (Causas de aniquilación)
  const defeatCauses = useMemo(() => {
    const causes: Record<string, number> = {};
    let totalDefeats = 0;

    for (const m of matches) {
      if (m.placement !== 1) {
        const cause = m.elimination_cause || "Desconocida";
        causes[cause] = (causes[cause] || 0) + 1;
        totalDefeats++;
      }
    }

    const sorted = Object.entries(causes)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalDefeats > 0 ? (count / totalDefeats) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      list: sorted,
      totalDefeats,
    };
  }, [matches]);

  // 4. Fatigue Curve (placement and mental state by match sequence number in sessions)
  const fatigueData = useMemo(() => {
    // Group matches by session_id
    const sessionsGroup: Record<string, Match[]> = {};
    for (const m of matches) {
      const sId = m.session_id;
      if (!sessionsGroup[sId]) {
        sessionsGroup[sId] = [];
      }
      sessionsGroup[sId].push(m);
    }

    // Sort matches in each session by created_at ascending to get sequential index
    const matchIndexStats: Record<number, { count: number; totalPlacement: number; totalMental: number; mentalCount: number }> = {};

    for (const sessionMatchesList of Object.values(sessionsGroup)) {
      const sorted = [...sessionMatchesList].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      sorted.forEach((m, idx) => {
        const matchNum = idx + 1; // 1-based index
        const groupKey = matchNum >= 5 ? 5 : matchNum; // cap at 5+ for consolidation

        if (!matchIndexStats[groupKey]) {
          matchIndexStats[groupKey] = { count: 0, totalPlacement: 0, totalMental: 0, mentalCount: 0 };
        }

        matchIndexStats[groupKey].count++;
        matchIndexStats[groupKey].totalPlacement += m.placement || 0;

        if (m.player_match_stats) {
          for (const p of m.player_match_stats) {
            if (p.mental_state) {
              matchIndexStats[groupKey].totalMental += p.mental_state;
              matchIndexStats[groupKey].mentalCount++;
            }
          }
        }
      });
    }

    const result = Object.entries(matchIndexStats).map(([key, stat]) => ({
      matchNum: Number(key) === 5 ? "Partida 5+" : `Partida ${key}`,
      avgPlacement: stat.totalPlacement / stat.count,
      avgMental: stat.mentalCount > 0 ? stat.totalMental / stat.mentalCount : 3,
      count: stat.count,
    })).sort((a, b) => a.matchNum.localeCompare(b.matchNum));

    return result;
  }, [matches]);

  // 5. Class Efficiency Matrix
  const classStats = useMemo(() => {
    const classes: Record<string, { count: number; kills: number; downs: number; assists: number; wins: number }> = {};

    for (const m of matches) {
      const isWin = m.placement === 1;
      if (m.player_match_stats) {
        for (const p of m.player_match_stats) {
          const cls = p.active_class || "Asalto";
          if (!classes[cls]) {
            classes[cls] = { count: 0, kills: 0, downs: 0, assists: 0, wins: 0 };
          }
          classes[cls].count++;
          classes[cls].kills += p.kills || 0;
          classes[cls].downs += p.downs || 0;
          classes[cls].assists += p.assists || 0;
          if (isWin) {
            classes[cls].wins++;
          }
        }
      }
    }

    return Object.entries(classes).map(([name, stat]) => ({
      name,
      count: stat.count,
      kdr: stat.downs > 0 ? (stat.kills / stat.downs).toFixed(2) : stat.kills.toFixed(2),
      winRate: ((stat.wins / stat.count) * 100).toFixed(0),
      avgKills: (stat.kills / stat.count).toFixed(1),
    }));
  }, [matches]);

  // 6. Operator Comparison (Altruism, KDR, Mental State)
  const operatorStats = useMemo(() => {
    const players: Record<string, {
      count: number;
      kills: number;
      downs: number;
      assists: number;
      revives: number;
      totalMental: number;
      avatarSeed: string | null;
      userId: string | null;
    }> = {};

    for (const m of matches) {
      if (m.player_match_stats) {
        for (const p of m.player_match_stats) {
          const tag = p.gamertag;
          if (!players[tag]) {
            players[tag] = {
              count: 0,
              kills: 0,
              downs: 0,
              assists: 0,
              revives: 0,
              totalMental: 0,
              avatarSeed: p.avatar_seed || null,
              userId: p.user_id || null,
            };
          }
          players[tag].count++;
          players[tag].kills += p.kills || 0;
          players[tag].downs += p.downs || 0;
          players[tag].assists += p.assists || 0;
          players[tag].revives += p.revives || 0;
          players[tag].totalMental += p.mental_state || 3;
          // Keep updating avatar seed if we find it
          if (p.avatar_seed && !players[tag].avatarSeed) {
            players[tag].avatarSeed = p.avatar_seed;
          }
          if (p.user_id && !players[tag].userId) {
            players[tag].userId = p.user_id;
          }
        }
      }
    }

    return Object.entries(players).map(([gamertag, stat]) => ({
      gamertag,
      count: stat.count,
      kdr: stat.downs > 0 ? (stat.kills / stat.downs).toFixed(2) : stat.kills.toFixed(2),
      kills: stat.kills,
      downs: stat.downs,
      assists: stat.assists,
      revives: stat.revives,
      avgMental: (stat.totalMental / stat.count).toFixed(1),
      avatarSeed: stat.avatarSeed,
      userId: stat.userId,
    })).sort((a, b) => Number(b.kdr) - Number(a.kdr));
  }, [matches]);

  const mentalLabel = (val: number) => {
    if (val >= 4.5) return "🔥 Concentrado";
    if (val >= 3.5) return "🟢 Estable";
    if (val >= 2.5) return "🟡 Cansado";
    return "🔴 Tilt / Frustrado";
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">KDR Global</p>
          <p className="mt-1 font-bold text-2xl text-primary font-sans">{summary.globalKdr}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Bajas totales: {summary.totalKills}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Partidas</p>
          <p className="mt-1 font-bold text-2xl text-foreground font-sans">{summary.totalMatches}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Sesiones de juego</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15">
            <Compass className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Puesto Promedio</p>
          <p className="mt-1 font-bold text-2xl text-foreground font-sans">#{summary.avgPlacement}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Efectividad de zona</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Tasa de Victorias</p>
          <p className="mt-1 font-bold text-2xl text-emerald-500 font-sans">{summary.winRate}%</p>
          <p className="text-[10px] text-muted-foreground mt-1">Victorias totales: {summary.totalWins}</p>
        </div>
      </div>

      {/* Drop Zone: Winner vs Death Route */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {dropZones.dropGanador && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs relative overflow-hidden">
            <div className="absolute right-4 top-4 bg-emerald-500/10 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
            </div>
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-widest font-mono">
              🚀 El Drop Ganador
            </h4>
            <p className="mt-2 font-bold text-lg text-foreground">{dropZones.dropGanador.name}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">Puesto Prom.:</span>{" "}
                <span className="font-bold text-emerald-400">#{dropZones.dropGanador.avgPlacement.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Despliegues:</span>{" "}
                <span className="font-bold text-foreground">{dropZones.dropGanador.count}</span>
              </div>
            </div>
          </div>
        )}

        {dropZones.rutaMuerte && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5 shadow-xs relative overflow-hidden">
            <div className="absolute right-4 top-4 bg-destructive/10 rounded-full p-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <h4 className="font-bold text-destructive text-xs uppercase tracking-widest font-mono">
              💀 Ruta de la Muerte
            </h4>
            <p className="mt-2 font-bold text-lg text-foreground">{dropZones.rutaMuerte.name}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">Puesto Prom.:</span>{" "}
                <span className="font-bold text-destructive">#{dropZones.rutaMuerte.avgPlacement.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Despliegues:</span>{" "}
                <span className="font-bold text-foreground">{dropZones.rutaMuerte.count}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* middle block: Causes of Elimination and Fatigue Curve */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Anatomía de la Derrota */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4">
            Anatomía de la Derrota (Causas)
          </h3>
          <div className="space-y-3.5">
            {defeatCauses.list.length === 0 ? (
              <p className="text-xs text-muted-foreground font-light py-6 text-center">No hay derrotas registradas todavía.</p>
            ) : (
              defeatCauses.list.map((cause) => (
                <div key={cause.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="font-semibold text-foreground">{cause.name}</span>
                    <span className="text-muted-foreground">{cause.count} ({cause.percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full transition-all duration-500"
                      style={{ width: `${cause.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fatigue Curve */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4">
            Curva de Fatiga y Desempeño
          </h3>
          <div className="space-y-4">
            {fatigueData.map((data) => {
              const placementPct = Math.max(0, 100 - (data.avgPlacement - 1) * 5); // visual ranking scale
              return (
                <div key={data.matchNum}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs mb-1.5 font-mono">
                    <span className="font-bold text-foreground">{data.matchNum}</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span>Puesto Prom.: <span className="text-primary font-bold">#{data.avgPlacement.toFixed(1)}</span></span>
                      <span>Estado Mental: <span className="text-emerald-400 font-bold">{mentalLabel(data.avgMental)}</span></span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${placementPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* class stats and operator stats tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Class stats */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-1">
          <h3 className="font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4">
            Matriz de Especialidades
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-muted-foreground border-border/20 border-b pb-2">
                  <th className="font-medium pb-2">Clase</th>
                  <th className="font-medium text-center pb-2">KDR</th>
                  <th className="font-medium text-center pb-2">Win %</th>
                </tr>
              </thead>
              <tbody>
                {classStats.map((cls) => (
                  <tr className="border-border/10 border-b hover:bg-muted/5" key={cls.name}>
                    <td className="py-2.5 font-bold text-foreground">{cls.name}</td>
                    <td className="py-2.5 text-center text-primary font-bold">{cls.kdr}</td>
                    <td className="py-2.5 text-center font-bold">{cls.winRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* operator compare */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <h3 className="font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4">
            Comparador de Operadores
          </h3>
          {/* Vista Mobile: Tarjetas apiladas para evitar amontonamiento */}
          <div className="block sm:hidden space-y-3">
            {operatorStats.map((op) => {
              const isMe = op.userId === currentUserId;
              return (
                <div 
                  key={op.gamertag} 
                  className={`rounded-lg border p-4 bg-muted/10 relative overflow-hidden transition-all hover:bg-muted/15 ${
                    isMe ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-border"
                  }`}
                >
                  {/* Fila superior: Avatar, Nombre y KDR destacado */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <OperatorAvatar
                        className="h-6 w-6"
                        gamertag={op.gamertag}
                        avatarSeed={op.avatarSeed}
                      />
                      <span className={`text-sm font-bold ${isMe ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}>
                        {cleanGamertag(op.gamertag)} 
                        {isMe && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono ml-1.5">
                            Tú
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider">KDR</span>
                      <span className="text-sm font-extrabold text-primary font-mono">{op.kdr}</span>
                    </div>
                  </div>

                  {/* Cuadrícula de estadísticas clave */}
                  <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3 text-center">
                    <div>
                      <p className="text-[9px] text-muted-foreground font-mono uppercase">Partidas</p>
                      <p className="text-xs font-bold text-foreground font-mono mt-0.5">{op.count}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-mono uppercase">K/D/A</p>
                      <p className="text-xs font-bold text-foreground font-mono mt-0.5">
                        {op.kills}/{op.downs}/{op.assists}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground font-mono uppercase flex items-center justify-center gap-0.5">
                        <Heart className="h-2 w-2 text-red-500 fill-red-500" /> Reanim.
                      </p>
                      <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{op.revives}</p>
                    </div>
                  </div>

                  {/* Fila inferior: Estado Mental */}
                  <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3 text-[10px] font-mono">
                    <span className="text-muted-foreground">Estado Mental Prom.:</span>
                    <span className="font-semibold text-foreground">{mentalLabel(Number(op.avgMental))}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista Desktop: Tabla tradicional completa */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-muted-foreground font-mono border-border/20 border-b pb-2 text-[10px] uppercase">
                  <th className="font-medium pb-2">Operador</th>
                  <th className="font-medium text-center pb-2">Partidas</th>
                  <th className="font-medium text-center pb-2">K/D/A</th>
                  <th className="font-medium text-center pb-2">KDR</th>
                  <th className="font-medium text-center pb-2 flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" /> Reanim.
                  </th>
                  <th className="font-medium text-center pb-2">Estado Prom.</th>
                </tr>
              </thead>
              <tbody>
                {operatorStats.map((op) => {
                  const isMe = op.userId === currentUserId;
                  return (
                    <tr className="border-border/10 border-b hover:bg-muted/5 font-sans" key={op.gamertag}>
                      <td className="py-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <OperatorAvatar
                            className="h-5 w-5"
                            gamertag={op.gamertag}
                            avatarSeed={op.avatarSeed}
                          />
                          <span className={isMe ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}>
                            {cleanGamertag(op.gamertag)} {isMe && "(Tú)"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center font-mono">{op.count}</td>
                      <td className="py-3 text-center font-mono text-[10px]">{op.kills}/{op.downs}/{op.assists}</td>
                      <td className="py-3 text-center font-mono font-bold text-primary">{op.kdr}</td>
                      <td className="py-3 text-center font-mono text-emerald-400 font-semibold">{op.revives}</td>
                      <td className="py-3 text-center font-mono text-[10px]">{mentalLabel(Number(op.avgMental))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
