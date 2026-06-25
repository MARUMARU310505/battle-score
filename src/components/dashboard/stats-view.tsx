import {
  BarChart3,
  Compass,
  Heart,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Match } from "./dashboard-content";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";
import { MapModal, isGridCode, getNearestPOI } from "@/components/map";


interface StatsViewProps {
  currentUserId?: string | null;
  matches: Match[];
  // biome-ignore lint/suspicious/noExplicitAny: squad structure
  squad: any;
}

export function StatsView({ matches, squad, currentUserId }: StatsViewProps) {
  const [selectedPoiForMap, setSelectedPoiForMap] = useState<string>("");
  const [mapModalMode, setMapModalMode] = useState<"deploy" | "circle" | "death" | "second_deploy">("deploy");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  if (!matches || matches.length === 0) {

    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-16 text-center">
        <span className="mb-4 text-4xl">📈</span>
        <h4 className="font-semibold text-foreground text-sm">
          Aún no hay estadísticas acumuladas
        </h4>
        <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs leading-relaxed">
          Las estadísticas históricas y análisis tácticos del escuadrón se
          generarán automáticamente conforme jueguen y registren partidas en sus
          sesiones.
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
    const matchIndexStats: Record<
      number,
      {
        count: number;
        totalPlacement: number;
        totalMental: number;
        mentalCount: number;
      }
    > = {};

    for (const sessionMatchesList of Object.values(sessionsGroup)) {
      const sorted = [...sessionMatchesList].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      sorted.forEach((m, idx) => {
        const matchNum = idx + 1; // 1-based index
        const groupKey = matchNum >= 5 ? 5 : matchNum; // cap at 5+ for consolidation

        if (!matchIndexStats[groupKey]) {
          matchIndexStats[groupKey] = {
            count: 0,
            totalPlacement: 0,
            totalMental: 0,
            mentalCount: 0,
          };
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

    const result = Object.entries(matchIndexStats)
      .map(([key, stat]) => ({
        matchNum: Number(key) === 5 ? "Partida 5+" : `Partida ${key}`,
        avgPlacement: stat.totalPlacement / stat.count,
        avgMental:
          stat.mentalCount > 0 ? stat.totalMental / stat.mentalCount : 3,
        count: stat.count,
      }))
      .sort((a, b) => a.matchNum.localeCompare(b.matchNum));

    return result;
  }, [matches]);

  // 5. Class Efficiency Matrix
  const classStats = useMemo(() => {
    const classes: Record<
      string,
      {
        count: number;
        kills: number;
        downs: number;
        assists: number;
        wins: number;
      }
    > = {};

    for (const m of matches) {
      const isWin = m.placement === 1;
      if (m.player_match_stats) {
        for (const p of m.player_match_stats) {
          const cls = p.active_class || "Asalto";
          if (!classes[cls]) {
            classes[cls] = {
              count: 0,
              kills: 0,
              downs: 0,
              assists: 0,
              wins: 0,
            };
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
      kdr:
        stat.downs > 0
          ? (stat.kills / stat.downs).toFixed(2)
          : stat.kills.toFixed(2),
      winRate: ((stat.wins / stat.count) * 100).toFixed(0),
      avgKills: (stat.kills / stat.count).toFixed(1),
    }));
  }, [matches]);

  // 6. Operator Comparison (Altruism, KDR, Mental State)
  const operatorStats = useMemo(() => {
    const players: Record<
      string,
      {
        count: number;
        kills: number;
        downs: number;
        assists: number;
        revives: number;
        totalMental: number;
        avatarSeed: string | null;
        userId: string | null;
      }
    > = {};

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

    return Object.entries(players)
      .map(([gamertag, stat]) => ({
        gamertag,
        count: stat.count,
        kdr:
          stat.downs > 0
            ? (stat.kills / stat.downs).toFixed(2)
            : stat.kills.toFixed(2),
        kills: stat.kills,
        downs: stat.downs,
        assists: stat.assists,
        revives: stat.revives,
        avgMental: (stat.totalMental / stat.count).toFixed(1),
        avatarSeed: stat.avatarSeed,
        userId: stat.userId,
      }))
      .sort((a, b) => Number(b.kdr) - Number(a.kdr));
  }, [matches]);

  const mentalLabel = (val: number) => {
    if (val >= 4.5) {
      return "🔥 Concentrado";
    }
    if (val >= 3.5) {
      return "🟢 Estable";
    }
    if (val >= 2.5) {
      return "🟡 Cansado";
    }
    return "🔴 Tilt / Frustrado";
  };

  return (
    <div className="fade-in-50 animate-in space-y-6 duration-300">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="absolute top-3 right-3 opacity-15">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            KDR Global
          </p>
          <p className="mt-1 font-bold font-sans text-2xl text-primary">
            {summary.globalKdr}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Bajas totales: {summary.totalKills}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="absolute top-3 right-3 opacity-15">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Partidas
          </p>
          <p className="mt-1 font-bold font-sans text-2xl text-foreground">
            {summary.totalMatches}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Sesiones de juego
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="absolute top-3 right-3 opacity-15">
            <Compass className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Puesto Promedio
          </p>
          <p className="mt-1 font-bold font-sans text-2xl text-foreground">
            #{summary.avgPlacement}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Efectividad de zona
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="absolute top-3 right-3 opacity-15">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Tasa de Victorias
          </p>
          <p className="mt-1 font-bold font-sans text-2xl text-emerald-500">
            {summary.winRate}%
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Victorias totales: {summary.totalWins}
          </p>
        </div>
      </div>

      {/* Drop Zone: Winner vs Death Route */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {dropZones.dropGanador && (
          <div
            onClick={() => {
              setSelectedPoiForMap(dropZones.dropGanador.name);
              setMapModalMode("deploy");
              setIsMapModalOpen(true);
            }}
            className="relative overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-200 group"
          >
            <div className="absolute top-4 right-4 rounded-full bg-emerald-500/10 p-2 group-hover:bg-emerald-500/20 transition-colors">
              <Sparkles className="h-5 w-5 animate-pulse text-emerald-400" />
            </div>
            <h4 className="font-bold font-mono text-emerald-400 text-xs uppercase tracking-widest">
              🚀 El Drop Ganador
            </h4>
            <p className="mt-2 font-bold text-foreground text-lg group-hover:text-emerald-400 transition-colors">
              {isGridCode(dropZones.dropGanador.name)
                ? `${dropZones.dropGanador.name} - ${getNearestPOI(dropZones.dropGanador.name)}`
                : dropZones.dropGanador.name}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-muted-foreground">Puesto Prom.:</span>{" "}
                <span className="font-bold text-emerald-400">
                  #{dropZones.dropGanador.avgPlacement.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Despliegues:</span>{" "}
                <span className="font-bold text-foreground">
                  {dropZones.dropGanador.count}
                </span>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-emerald-500/70 font-mono flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
              <span>➔ Clic para ver en el mapa</span>
            </div>
          </div>
        )}

        {dropZones.rutaMuerte && (
          <div
            onClick={() => {
              setSelectedPoiForMap(dropZones.rutaMuerte.name);
              setMapModalMode("death");
              setIsMapModalOpen(true);
            }}
            className="relative overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 p-5 shadow-xs cursor-pointer hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-200 group"
          >
            <div className="absolute top-4 right-4 rounded-full bg-destructive/10 p-2 group-hover:bg-destructive/20 transition-colors">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <h4 className="font-bold font-mono text-destructive text-xs uppercase tracking-widest">
              💀 Ruta de la Muerte
            </h4>
            <p className="mt-2 font-bold text-foreground text-lg group-hover:text-destructive transition-colors">
              {isGridCode(dropZones.rutaMuerte.name)
                ? `${dropZones.rutaMuerte.name} - ${getNearestPOI(dropZones.rutaMuerte.name)}`
                : dropZones.rutaMuerte.name}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-muted-foreground">Puesto Prom.:</span>{" "}
                <span className="font-bold text-destructive">
                  #{dropZones.rutaMuerte.avgPlacement.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Despliegues:</span>{" "}
                <span className="font-bold text-foreground">
                  {dropZones.rutaMuerte.count}
                </span>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-destructive/70 font-mono flex items-center gap-1 group-hover:text-destructive transition-colors">
              <span>➔ Clic para ver en el mapa</span>
            </div>
          </div>
        )}
      </div>

      {/* middle block: Causes of Elimination and Fatigue Curve */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Anatomía de la Derrota */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 border-border/40 border-b pb-3 font-bold text-foreground text-xs uppercase tracking-wider">
            Anatomía de la Derrota (Causas)
          </h3>
          <div className="space-y-3.5">
            {defeatCauses.list.length === 0 ? (
              <p className="py-6 text-center font-light text-muted-foreground text-xs">
                No hay derrotas registradas todavía.
              </p>
            ) : (
              defeatCauses.list.map((cause) => (
                <div key={cause.name}>
                  <div className="mb-1.5 flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-foreground">
                      {cause.name}
                    </span>
                    <span className="text-muted-foreground">
                      {cause.count} ({cause.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-all duration-500"
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
          <h3 className="mb-4 border-border/40 border-b pb-3 font-bold text-foreground text-xs uppercase tracking-wider">
            Curva de Fatiga y Desempeño
          </h3>
          <div className="space-y-4">
            {fatigueData.map((data) => {
              const placementPct = Math.max(
                0,
                100 - (data.avgPlacement - 1) * 5
              ); // visual ranking scale
              return (
                <div key={data.matchNum}>
                  <div className="mb-1.5 flex flex-col gap-1.5 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-bold text-foreground">
                      {data.matchNum}
                    </span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span>
                        Puesto Prom.:{" "}
                        <span className="font-bold text-primary">
                          #{data.avgPlacement.toFixed(1)}
                        </span>
                      </span>
                      <span>
                        Estado Mental:{" "}
                        <span className="font-bold text-emerald-400">
                          {mentalLabel(data.avgMental)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
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
          <h3 className="mb-4 border-border/40 border-b pb-3 font-bold text-foreground text-xs uppercase tracking-wider">
            Matriz de Especialidades
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-border/20 border-b pb-2 text-muted-foreground">
                  <th className="pb-2 font-medium">Clase</th>
                  <th className="pb-2 text-center font-medium">KDR</th>
                  <th className="pb-2 text-center font-medium">Win %</th>
                </tr>
              </thead>
              <tbody>
                {classStats.map((cls) => (
                  <tr
                    className="border-border/10 border-b hover:bg-muted/5"
                    key={cls.name}
                  >
                    <td className="py-2.5 font-bold text-foreground">
                      {cls.name}
                    </td>
                    <td className="py-2.5 text-center font-bold text-primary">
                      {cls.kdr}
                    </td>
                    <td className="py-2.5 text-center font-bold">
                      {cls.winRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* operator compare */}
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 border-border/40 border-b pb-3 font-bold text-foreground text-xs uppercase tracking-wider">
            Comparador de Operadores
          </h3>
          {/* Vista Mobile: Tarjetas apiladas para evitar amontonamiento */}
          <div className="block space-y-3 sm:hidden">
            {operatorStats.map((op) => {
              const isMe = op.userId === currentUserId;
              return (
                <div
                  className={`relative overflow-hidden rounded-lg border bg-muted/10 p-4 transition-all hover:bg-muted/15 ${
                    isMe
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-border"
                  }`}
                  key={op.gamertag}
                >
                  {/* Fila superior: Avatar, Nombre y KDR destacado */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <OperatorAvatar
                        avatarSeed={op.avatarSeed}
                        className="h-6 w-6"
                        gamertag={op.gamertag}
                      />
                      <span
                        className={`font-bold text-sm ${isMe ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                      >
                        {cleanGamertag(op.gamertag)}
                        {isMe && (
                          <span className="ml-1.5 rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                            Tú
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                        KDR
                      </span>
                      <span className="font-extrabold font-mono text-primary text-sm">
                        {op.kdr}
                      </span>
                    </div>
                  </div>

                  {/* Cuadrícula de estadísticas clave */}
                  <div className="grid grid-cols-3 gap-2 border-border/30 border-t pt-3 text-center">
                    <div>
                      <p className="font-mono text-[9px] text-muted-foreground uppercase">
                        Partidas
                      </p>
                      <p className="mt-0.5 font-bold font-mono text-foreground text-xs">
                        {op.count}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-muted-foreground uppercase">
                        K/D/A
                      </p>
                      <p className="mt-0.5 font-bold font-mono text-foreground text-xs">
                        {op.kills}/{op.downs}/{op.assists}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center justify-center gap-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                        <Heart className="h-2 w-2 fill-red-500 text-red-500" />{" "}
                        Reanim.
                      </p>
                      <p className="mt-0.5 font-bold font-mono text-emerald-400 text-xs">
                        {op.revives}
                      </p>
                    </div>
                  </div>

                  {/* Fila inferior: Estado Mental */}
                  <div className="mt-3 flex items-center justify-between border-border/30 border-t pt-3 font-mono text-[10px]">
                    <span className="text-muted-foreground">
                      Estado Mental Prom.:
                    </span>
                    <span className="font-semibold text-foreground">
                      {mentalLabel(Number(op.avgMental))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista Desktop: Tabla tradicional completa */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-border/20 border-b pb-2 font-mono text-[10px] text-muted-foreground uppercase">
                  <th className="pb-2 font-medium">Operador</th>
                  <th className="pb-2 text-center font-medium">Partidas</th>
                  <th className="pb-2 text-center font-medium">K/D/A</th>
                  <th className="pb-2 text-center font-medium">KDR</th>
                  <th className="flex items-center justify-center gap-1 pb-2 text-center font-medium">
                    <Heart className="h-3 w-3 text-red-500" /> Reanim.
                  </th>
                  <th className="pb-2 text-center font-medium">Estado Prom.</th>
                </tr>
              </thead>
              <tbody>
                {operatorStats.map((op) => {
                  const isMe = op.userId === currentUserId;
                  return (
                    <tr
                      className="border-border/10 border-b font-sans hover:bg-muted/5"
                      key={op.gamertag}
                    >
                      <td className="py-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <OperatorAvatar
                            avatarSeed={op.avatarSeed}
                            className="h-5 w-5"
                            gamertag={op.gamertag}
                          />
                          <span
                            className={
                              isMe
                                ? "font-extrabold text-emerald-500 dark:text-emerald-400"
                                : "text-foreground"
                            }
                          >
                            {cleanGamertag(op.gamertag)} {isMe && "(Tú)"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center font-mono">{op.count}</td>
                      <td className="py-3 text-center font-mono text-[10px]">
                        {op.kills}/{op.downs}/{op.assists}
                      </td>
                      <td className="py-3 text-center font-bold font-mono text-primary">
                        {op.kdr}
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-emerald-400">
                        {op.revives}
                      </td>
                      <td className="py-3 text-center font-mono text-[10px]">
                        {mentalLabel(Number(op.avgMental))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedGrid={selectedPoiForMap}
        mode={mapModalMode}
        readOnly={true}
      />

    </div>
  );
}

