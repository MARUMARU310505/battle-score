import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { Match } from "./dashboard-content";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";

interface KdrLineChartProps {
  currentUserId?: string | null;
  matches: Match[];
  sessionMatches: Match[];
  // biome-ignore lint/suspicious/noExplicitAny: squad info
  squad: any;
}

interface ChartPoint {
  assists: number;
  downs: number;
  kdr: number;
  kills: number;
  xLabel: string; // Session name or Match number
}

interface OperatorData {
  avatarSeed: string | null;
  color: string;
  gamertag: string;
  points: (ChartPoint | null)[];
  userId: string | null;
}

// Color palette for lines
const colors = [
  "#10b981", // Emerald/Green (User default)
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#f97316", // Orange
  "#ec4899", // Pink
  "#eab308", // Yellow
];

// Helper function to match gamertags case-insensitively, accent-insensitively, and clean up suffixes/IDs
export function matchGamertags(gt1: string, gt2: string): boolean {
  if (!(gt1 && gt2)) {
    return false;
  }
  const clean1 = gt1
    .split("||")[0]
    .split("#")[0]
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const clean2 = gt2
    .split("||")[0]
    .split("#")[0]
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return clean1 === clean2;
}

// Helper function to match operators by user_id or case/accent-insensitive gamertag
export function matchOperator(
  p: { user_id?: string | null; gamertag: string },
  member: { user_id?: string | null; gamertag: string }
): boolean {
  if (p.user_id && member.user_id && p.user_id === member.user_id) {
    return true;
  }
  return matchGamertags(p.gamertag, member.gamertag);
}

interface CustomTooltipContentProps {
  active?: boolean;
  chartData: OperatorData[];
  chartMode: "general" | "session";
  label?: string;
  // biome-ignore lint/suspicious/noExplicitAny: recharts payload
  payload?: any[];
  xLabels: string[];
}

function CustomTooltipContent({
  active,
  payload,
  label,
  chartData,
  xLabels,
  chartMode,
}: CustomTooltipContentProps) {
  if (!(active && payload?.length && label)) {
    return null;
  }

  const pointIdx = xLabels.indexOf(label);
  if (pointIdx === -1) {
    return null;
  }

  const fullLabel =
    chartMode === "session"
      ? `Partida ${pointIdx + 1}`
      : `Partida ${pointIdx + 1} (Promedio)`;

  const formatStat = (val: number) =>
    Number.isInteger(val) ? val.toString() : val.toFixed(1);

  return (
    <div className="min-w-[12rem] space-y-1.5 rounded-lg border border-border bg-background/95 p-3 font-mono text-[10px] shadow-xl backdrop-blur-md">
      <div className="border-border/40 border-b pb-1.5 font-bold text-foreground">
        {fullLabel}
      </div>
      <div className="space-y-1">
        {payload.map((entry) => {
          const opName = entry.name;
          const kdrVal = entry.value;
          if (typeof opName !== "string" || typeof kdrVal !== "number") {
            return null;
          }
          const op = chartData.find((o) => o.gamertag === opName);
          const pt = op?.points[pointIdx];

          return (
            <div
              className="flex items-center justify-between gap-4"
              key={opName}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs" style={{ color: entry.stroke }}>
                  ■
                </span>
                <span className="max-w-[80px] truncate text-muted-foreground">
                  {cleanGamertag(opName)}
                </span>
              </div>
              <div className="text-right font-semibold text-foreground">
                KDR:{" "}
                <span className="font-extrabold text-primary">
                  {kdrVal.toFixed(2)}
                </span>
                {pt &&
                  ` (${formatStat(pt.kills)}/${formatStat(pt.downs)}/${formatStat(pt.assists)})`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function KdrLineChart({
  currentUserId,
  matches,
  sessionMatches,
  squad,
}: KdrLineChartProps) {
  const [chartMode, setChartMode] = useState<"general" | "session">("session");
  const [showDebug, setShowDebug] = useState(false);

  const squadMembers = useMemo(() => squad?.members || [], [squad]);

  const [selectedOperators, setSelectedOperators] = useState<
    Record<string, boolean>
  >({});

  // Map squad members to color index
  const operatorMeta = useMemo(() => {
    const meta: Record<
      string,
      {
        color: string;
        isMe: boolean;
        avatarSeed: string | null;
        userId: string | null;
      }
    > = {};

    const sortedMembers = [...squadMembers].sort((a, b) => {
      const isAMe = a.user_id === currentUserId;
      const isBMe = b.user_id === currentUserId;
      if (isAMe && !isBMe) {
        return -1;
      }
      if (!isAMe && isBMe) {
        return 1;
      }
      return 0;
    });

    sortedMembers.forEach((member, idx) => {
      const isMe = member.user_id === currentUserId;
      meta[member.gamertag] = {
        color: isMe ? colors[0] : colors[(idx + 1) % colors.length],
        isMe,
        avatarSeed: member.avatar_seed || null,
        userId: member.user_id || null,
      };
    });

    return meta;
  }, [squadMembers, currentUserId]);

  const activeOperators = useMemo(() => {
    const active: Record<string, boolean> = {};
    for (const member of squadMembers) {
      const isSelected = selectedOperators[member.gamertag] !== false;
      active[member.gamertag] = isSelected;
    }
    return active;
  }, [squadMembers, selectedOperators]);

  const toggleOperator = (gamertag: string) => {
    setSelectedOperators((prev) => ({
      ...prev,
      [gamertag]: prev[gamertag] === false,
    }));
  };

  // Compile data points based on mode
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: data calculation logic
  const { chartData, xLabels, maxKdr } = useMemo(() => {
    let listXLabels: string[] = [];
    const opData: Record<string, (ChartPoint | null)[]> = {};

    for (const m of squadMembers) {
      opData[m.gamertag] = [];
    }

    if (chartMode === "session") {
      const sortedMatches = [...sessionMatches].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      listXLabels = sortedMatches.map((_, idx) => `P${idx + 1}`);

      for (let idx = 0; idx < sortedMatches.length; idx++) {
        const match = sortedMatches[idx];
        const xLabel = `Partida ${idx + 1}`;
        for (const member of squadMembers) {
          const stats = match.player_match_stats?.find((p) =>
            matchOperator(p, member)
          );

          if (stats) {
            const kills = stats.kills || 0;
            const downs = stats.downs || 0;
            const assists = stats.assists || 0;
            const kdr = downs > 0 ? kills / downs : kills;
            opData[member.gamertag].push({
              xLabel,
              kdr,
              kills,
              downs,
              assists,
            });
          } else {
            opData[member.gamertag].push(null);
          }
        }
      }
    } else {
      const sessionsGroup: Record<string, Match[]> = {};
      for (const m of matches) {
        const sId = m.session_id;
        if (!sessionsGroup[sId]) {
          sessionsGroup[sId] = [];
        }
        sessionsGroup[sId].push(m);
      }

      let maxSessionMatches = 0;
      for (const sessionMatchesList of Object.values(sessionsGroup)) {
        if (sessionMatchesList.length > maxSessionMatches) {
          maxSessionMatches = sessionMatchesList.length;
        }
      }

      const totalSteps = Math.min(10, maxSessionMatches);
      listXLabels = Array.from({ length: totalSteps }, (_, i) => `P${i + 1}`);

      const sortedSessionGroups: Record<string, Match[]> = {};
      for (const [sId, sessionMatchesList] of Object.entries(sessionsGroup)) {
        sortedSessionGroups[sId] = [...sessionMatchesList].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      for (let idx = 0; idx < totalSteps; idx++) {
        const xLabel = `Partida ${idx + 1} (Promedio)`;

        for (const member of squadMembers) {
          const kdrValues: number[] = [];
          let totalKills = 0;
          let totalDowns = 0;
          let totalAssists = 0;
          let count = 0;

          for (const sessionMatchesList of Object.values(sortedSessionGroups)) {
            if (sessionMatchesList.length > idx) {
              const match = sessionMatchesList[idx];
              const stats = match.player_match_stats?.find((p) =>
                matchOperator(p, member)
              );
              if (stats) {
                const kills = stats.kills || 0;
                const downs = stats.downs || 0;
                const assists = stats.assists || 0;
                const kdr = downs > 0 ? kills / downs : kills;
                kdrValues.push(kdr);
                totalKills += kills;
                totalDowns += downs;
                totalAssists += assists;
                count++;
              }
            }
          }

          if (kdrValues.length > 0) {
            const avgKdr =
              kdrValues.reduce((sum, val) => sum + val, 0) / kdrValues.length;
            opData[member.gamertag].push({
              xLabel,
              kdr: avgKdr,
              kills: totalKills / count,
              downs: totalDowns / count,
              assists: totalAssists / count,
            });
          } else {
            opData[member.gamertag].push(null);
          }
        }
      }
    }

    let maxVal = 2.0;
    for (const points of Object.values(opData)) {
      for (const p of points) {
        if (p && p.kdr > maxVal) {
          maxVal = p.kdr;
        }
      }
    }

    const finalOperators: OperatorData[] = squadMembers.map((member) => ({
      gamertag: member.gamertag,
      avatarSeed: operatorMeta[member.gamertag]?.avatarSeed || null,
      userId: operatorMeta[member.gamertag]?.userId || null,
      color: operatorMeta[member.gamertag]?.color || colors[0],
      points: opData[member.gamertag],
    }));

    return {
      chartData: finalOperators,
      xLabels: listXLabels,
      maxKdr: Math.ceil(maxVal * 1.15 * 10) / 10,
    };
  }, [chartMode, sessionMatches, matches, squadMembers, operatorMeta]);

  const dbGamertags = useMemo(() => {
    const list: { gamertag: string; userId: string | null }[] = [];
    const seen = new Set<string>();
    const sourceMatches = chartMode === "session" ? sessionMatches : matches;

    for (const match of sourceMatches) {
      if (match.player_match_stats) {
        for (const stats of match.player_match_stats) {
          const key = `${stats.gamertag}-${stats.user_id}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              gamertag: stats.gamertag,
              userId: stats.user_id || null,
            });
          }
        }
      }
    }
    return list;
  }, [chartMode, sessionMatches, matches]);

  // Construct chart data compatible with Recharts
  const rechartsData = useMemo(() => {
    const dataList: Record<string, string | number | null | undefined>[] = [];
    for (let i = 0; i < xLabels.length; i++) {
      const row: Record<string, string | number | null | undefined> = {
        name: xLabels[i],
        fullLabel:
          chartMode === "session"
            ? `Partida ${i + 1}`
            : `Partida ${i + 1} (Promedio)`,
      };
      for (const op of chartData) {
        const pt = op.points[i];
        if (pt) {
          row[op.gamertag] = pt.kdr;
        }
      }
      dataList.push(row);
    }
    return dataList;
  }, [xLabels, chartData, chartMode]);

  // Construct ChartConfig for shadcn-style ChartContainer
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const op of chartData) {
      config[op.gamertag] = {
        label: cleanGamertag(op.gamertag),
        color: op.color,
      };
    }
    return config;
  }, [chartData]);

  const hasData = xLabels.length > 0;

  return (
    <Card className="p-5">
      <CardHeader className="flex flex-col gap-4 space-y-0 border-border/40 border-b p-0 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-primary" /> Curva de KDR
            Histórica
          </CardTitle>
          <CardDescription className="mt-0.5 text-[11px] text-muted-foreground">
            Visualiza el progreso de KDR por operador en la sesión o a nivel
            general.
          </CardDescription>
        </div>

        {/* View Toggle */}
        <div className="flex items-center self-start rounded-lg border border-border/60 bg-background p-0.5">
          <button
            className={`flex items-center gap-1 rounded-md px-3 py-1 font-medium text-xs transition-all ${
              chartMode === "session"
                ? "bg-card font-semibold text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setChartMode("session")}
            type="button"
          >
            <BarChart3 className="h-3 w-3" /> Sesión Actual
          </button>
          <button
            className={`flex items-center gap-1 rounded-md px-3 py-1 font-medium text-xs transition-all ${
              chartMode === "general"
                ? "bg-card font-semibold text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setChartMode("general")}
            type="button"
          >
            <Calendar className="h-3 w-3" /> Historial General
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4">
        {/* Operator Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase">
            <Users className="h-3 w-3" /> Filtro:
          </span>
          {squadMembers.map((member) => {
            const isSelected = activeOperators[member.gamertag];
            const meta = operatorMeta[member.gamertag];
            const color = meta?.color || colors[0];
            const isMe = meta?.isMe;

            return (
              <button
                className={`flex select-none items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs transition-all ${
                  isSelected
                    ? "border-border bg-muted/20 text-foreground"
                    : "border-transparent bg-transparent text-muted-foreground/60 line-through"
                }`}
                key={member.gamertag}
                onClick={() => toggleOperator(member.gamertag)}
                style={{
                  borderLeftColor: isSelected ? color : "transparent",
                  borderLeftWidth: isSelected ? "3px" : "1px",
                }}
                type="button"
              >
                <OperatorAvatar
                  avatarSeed={member.avatar_seed}
                  className="h-3.5 w-3.5"
                  gamertag={member.gamertag}
                />
                <span className={isMe ? "font-bold text-emerald-400" : ""}>
                  {cleanGamertag(member.gamertag)}
                </span>
                {isMe && <span className="text-[8px] opacity-75">(Tú)</span>}
              </button>
            );
          })}
        </div>

        {/* Line Chart Area */}
        <div className="relative mt-6 h-64 w-full">
          {hasData ? (
            <ChartContainer className="h-full w-full" config={chartConfig}>
              <LineChart
                data={rechartsData}
                margin={{
                  top: 15,
                  left: -20,
                  right: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  className="stroke-border/20"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  axisLine={false}
                  className="fill-muted-foreground font-mono text-[9px]"
                  dataKey="name"
                  tickLine={false}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  className="fill-muted-foreground font-mono text-[9px]"
                  domain={[0, maxKdr]}
                  tickFormatter={(val) => val.toFixed(1)}
                  tickLine={false}
                  tickMargin={8}
                />
                <Tooltip
                  content={
                    <CustomTooltipContent
                      chartData={chartData}
                      chartMode={chartMode}
                      xLabels={xLabels}
                    />
                  }
                />
                {chartData.map((op) => {
                  const isSelected = activeOperators[op.gamertag];
                  if (!isSelected) {
                    return null;
                  }

                  const isMe = operatorMeta[op.gamertag]?.isMe;

                  return (
                    <Line
                      activeDot={{
                        r: isMe ? 6 : 4.5,
                        strokeWidth: 0,
                        fill: "#fff",
                      }}
                      dataKey={op.gamertag}
                      dot={{
                        r: isMe ? 4 : 2,
                        strokeWidth: 0,
                        fill: op.color,
                      }}
                      key={op.gamertag}
                      stroke={op.color}
                      strokeWidth={isMe ? 3 : 1.5}
                      type="linear" // PUNTEAGUDO (linear)
                    />
                  );
                })}
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-border/40 border-dashed bg-background/30 text-center">
              <span className="mb-2 text-2xl">📉</span>
              <p className="font-medium text-muted-foreground text-xs">
                {chartMode === "session"
                  ? "Registra partidas en tu sesión actual para generar la gráfica."
                  : "No se encontraron sesiones previas para este escuadrón."}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Collapsible Debug Panel */}
      <div className="mt-4 flex justify-end">
        <button
          className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider transition-colors hover:text-foreground"
          onClick={() => setShowDebug(!showDebug)}
          type="button"
        >
          {showDebug ? "Ocultar Depuración" : "Mostrar Depuración"}
        </button>
      </div>

      {showDebug && (
        <div className="mt-4 space-y-3 rounded-lg border border-destructive/10 bg-destructive/5 p-4 font-mono text-[10px] text-muted-foreground/90">
          <div className="border-border/40 border-b pb-1 font-bold text-foreground">
            DATOS DE DEPURACIÓN DE LA GRÁFICA:
          </div>
          <div>
            <strong>Miembros del Escuadrón (Configuración):</strong>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {/* biome-ignore lint/suspicious/noExplicitAny: debug members */}
              {squadMembers.map((m: any) => (
                <li key={m.gamertag}>
                  Gamertag:{" "}
                  <span className="font-semibold text-foreground">
                    "{m.gamertag}"
                  </span>{" "}
                  (Limpio: "
                  {m.gamertag
                    .split("||")[0]
                    .split("#")[0]
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}
                  ") {m.user_id ? `| User ID: ${m.user_id}` : "| Sin User ID"}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Gamertags / User IDs registrados en base de datos:</strong>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {dbGamertags.map((dbGt) => (
                <li key={`${dbGt.gamertag}-${dbGt.userId}`}>
                  Gamertag:{" "}
                  <span className="font-semibold text-foreground">
                    "{dbGt.gamertag}"
                  </span>{" "}
                  (Limpio: "
                  {dbGt.gamertag
                    .split("||")[0]
                    .split("#")[0]
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}
                  "){" "}
                  {dbGt.userId ? `| User ID: ${dbGt.userId}` : "| Sin User ID"}
                </li>
              ))}
              {dbGamertags.length === 0 && (
                <li className="text-amber-400">
                  No se encontraron estadísticas registradas.
                </li>
              )}
            </ul>
          </div>
          <div>
            <strong>
              Puntos calculados en Modo "
              {chartMode === "session" ? "Sesión" : "General"}":
            </strong>
            <div className="mt-1 max-h-36 space-y-2 overflow-x-auto">
              {chartData.map((op) => (
                <div
                  className="border-border/20 border-t pt-1"
                  key={op.gamertag}
                >
                  <span style={{ color: op.color }}>■</span> {op.gamertag}:{" "}
                  {op.points.map((pt, i) => {
                    const ptKey = `${op.gamertag}-dbg-pt-${xLabels[i] || i}`;
                    return (
                      <span className="mr-2" key={ptKey}>
                        [{xLabels[i] || `P${i + 1}`}:{" "}
                        {pt
                          ? `KDR ${pt.kdr.toFixed(2)} (${pt.kills.toFixed(1)}/${pt.downs.toFixed(1)}/${pt.assists.toFixed(1)})`
                          : "Sin datos"}
                        ]
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
