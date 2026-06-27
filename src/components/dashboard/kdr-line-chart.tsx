import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
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

// Color palette for lines (declared globally to keep reference constant)
const colors = [
  "#10b981", // Emerald/Green (User default)
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#f97316", // Orange
  "#ec4899", // Pink
  "#eab308", // Yellow
];

export function KdrLineChart({
  currentUserId,
  matches,
  sessionMatches,
  squad,
}: KdrLineChartProps) {
  const [chartMode, setChartMode] = useState<"general" | "session">("session");
  const [hoveredPoint, setHoveredPoint] = useState<{
    gamertag: string;
    avatarSeed: string | null;
    xLabel: string;
    kdr: number;
    kills: number;
    downs: number;
    assists: number;
    x: number;
    y: number;
  } | null>(null);

  // Initialize selected operators state (all active by default)
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

    // Find current user's profile/member to put at index 0/highlight
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

  // Handle lazy initialization of selected operators
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
      // 1. Session Mode (Active session, Match by Match)
      // Sort matches chronologically
      const sortedMatches = [...sessionMatches].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      listXLabels = sortedMatches.map((_, idx) => `P${idx + 1}`);

      for (let idx = 0; idx < sortedMatches.length; idx++) {
        const match = sortedMatches[idx];
        const xLabel = `Partida ${idx + 1}`;
        for (const member of squadMembers) {
          const stats = match.player_match_stats?.find(
            (p) => p.gamertag === member.gamertag
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
      // 2. General Mode (Historical average per Match sequence across all sessions)
      // Group historical matches by session_id
      const sessionsGroup: Record<string, Match[]> = {};
      for (const m of matches) {
        const sId = m.session_id;
        if (!sessionsGroup[sId]) {
          sessionsGroup[sId] = [];
        }
        sessionsGroup[sId].push(m);
      }

      // Find max matches in any session
      let maxSessionMatches = 0;
      for (const sessionMatchesList of Object.values(sessionsGroup)) {
        if (sessionMatchesList.length > maxSessionMatches) {
          maxSessionMatches = sessionMatchesList.length;
        }
      }

      // Cap at 10 matches
      const totalSteps = Math.min(10, maxSessionMatches);
      listXLabels = Array.from({ length: totalSteps }, (_, i) => `P${i + 1}`);

      // Sort matches in each session group chronologically
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
              const stats = match.player_match_stats?.find(
                (p) => p.gamertag === member.gamertag
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

    // Determine max KDR value to scale Y axis (min height of 2.0 KDR)
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
      maxKdr: Math.ceil(maxVal * 1.15 * 10) / 10, // round up nicely with margin
    };
  }, [chartMode, sessionMatches, matches, squadMembers, operatorMeta]);

  // SVG Coordinates layout properties
  const svgWidth = 600;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines: { label: string; y: number }[] = [];
    let step = 2.0;
    if (maxKdr <= 2.5) {
      step = 0.5;
    } else if (maxKdr <= 5) {
      step = 1.0;
    }
    for (let val = 0; val <= maxKdr; val += step) {
      const y = paddingTop + (1 - val / maxKdr) * chartHeight;
      lines.push({ label: val.toFixed(1), y });
    }
    return lines;
  }, [maxKdr, chartHeight]);

  // Compute actual coordinates of SVG points
  const pointsWithCoords = useMemo(() => {
    const totalPointsCount = xLabels.length;
    if (totalPointsCount === 0) {
      return [];
    }

    return chartData.map((op) => {
      const coords = op.points.map((pt, idx) => {
        if (pt === null) {
          return null;
        }
        const x =
          totalPointsCount > 1
            ? paddingLeft + (idx / (totalPointsCount - 1)) * chartWidth
            : paddingLeft + chartWidth / 2;
        const y = paddingTop + (1 - pt.kdr / maxKdr) * chartHeight;
        return { ...pt, x, y };
      });
      return { ...op, coords };
    });
  }, [chartData, xLabels, chartWidth, chartHeight, maxKdr]);

  const formatStat = (val: number) =>
    Number.isInteger(val) ? val.toString() : val.toFixed(1);

  const hasData = xLabels.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-4 border-border/40 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
            <TrendingUp className="h-4 w-4 text-primary" /> Curva de KDR
            Histórica
          </h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Visualiza el progreso de KDR por operador en la sesión o a nivel
            general.
          </p>
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
      </div>

      {/* Operator Filter Badges */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
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
      <div className="relative mt-6">
        {hasData ? (
          <div className="w-full overflow-hidden">
            <svg
              aria-label="Gráfica de evolución de KDR"
              className="h-auto w-full"
              role="img"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Gráfica de evolución de KDR</title>
              {/* Grid Background Lines */}
              {gridLines.map((line) => (
                <g key={line.label}>
                  <line
                    className="stroke-border/20"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    x1={paddingLeft}
                    x2={svgWidth - paddingRight}
                    y1={line.y}
                    y2={line.y}
                  />
                  <text
                    alignmentBaseline="middle"
                    className="fill-muted-foreground/80 font-mono text-[9px]"
                    textAnchor="end"
                    x={paddingLeft - 8}
                    y={line.y}
                  >
                    {line.label}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {xLabels.map((lbl, idx) => {
                const totalPointsCount = xLabels.length;
                const x =
                  totalPointsCount > 1
                    ? paddingLeft + (idx / (totalPointsCount - 1)) * chartWidth
                    : paddingLeft + chartWidth / 2;
                return (
                  <text
                    className="fill-muted-foreground/80 font-mono text-[9px]"
                    key={lbl}
                    textAnchor="middle"
                    x={x}
                    y={svgHeight - paddingBottom + 16}
                  >
                    {lbl}
                  </text>
                );
              })}

              {/* Draw Data Lines */}
              {pointsWithCoords.map((op) => {
                const isSelected = activeOperators[op.gamertag];
                if (!isSelected) {
                  return null;
                }

                const isMe = operatorMeta[op.gamertag]?.isMe;

                // Build line path definition d
                let pathD = "";
                let isFirstPoint = true;

                for (const coord of op.coords) {
                  if (coord === null) {
                    continue;
                  }
                  if (isFirstPoint) {
                    pathD += `M ${coord.x} ${coord.y}`;
                    isFirstPoint = false;
                  } else {
                    pathD += ` L ${coord.x} ${coord.y}`;
                  }
                }

                if (pathD === "") {
                  return null;
                }

                return (
                  <g key={op.gamertag}>
                    {/* Glow effect line for 'Tú' */}
                    {isMe && (
                      <path
                        className="opacity-15 blur-[3px]"
                        d={pathD}
                        fill="none"
                        stroke={op.color}
                        strokeWidth="5"
                      />
                    )}
                    <path
                      className="transition-all duration-300"
                      d={pathD}
                      fill="none"
                      stroke={op.color}
                      strokeWidth={isMe ? "2.5" : "1.5"}
                    />
                  </g>
                );
              })}

              {/* Draw Interactive Dots on top */}
              {pointsWithCoords.map((op) => {
                const isSelected = activeOperators[op.gamertag];
                if (!isSelected) {
                  return null;
                }

                const isMe = operatorMeta[op.gamertag]?.isMe;

                return (
                  <g key={`dots-${op.gamertag}`}>
                    {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: SVG dots map */}
                    {op.coords.map((coord) => {
                      if (coord === null) {
                        return null;
                      }
                      const isHovered =
                        hoveredPoint &&
                        hoveredPoint.gamertag === op.gamertag &&
                        hoveredPoint.xLabel === coord.xLabel;

                      let rVal = isMe ? "3.5" : "2.5";
                      if (isHovered) {
                        rVal = isMe ? "5.5" : "4.5";
                      }

                      return (
                        <g key={`dot-${op.gamertag}-${coord.xLabel}`}>
                          {/* Bigger trigger target area */}
                          {/* biome-ignore lint/a11y/noStaticElementInteractions: hover trigger */}
                          <circle
                            className="cursor-pointer fill-transparent"
                            cx={coord.x}
                            cy={coord.y}
                            onMouseEnter={() =>
                              setHoveredPoint({
                                gamertag: op.gamertag,
                                avatarSeed: op.avatarSeed,
                                xLabel: coord.xLabel,
                                kdr: coord.kdr,
                                kills: coord.kills,
                                downs: coord.downs,
                                assists: coord.assists,
                                x: coord.x,
                                y: coord.y,
                              })
                            }
                            onMouseLeave={() => setHoveredPoint(null)}
                            r="12"
                          />
                          {/* Inner visible dot */}
                          <circle
                            className="transition-all duration-200"
                            cx={coord.x}
                            cy={coord.y}
                            fill={isHovered ? "#fff" : op.color}
                            r={rVal}
                            stroke={op.color}
                            strokeWidth={isHovered ? "2.5" : "0"}
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay (styled premium dark glassmorphism) */}
            {hoveredPoint && (
              <div
                className="pointer-events-none absolute z-20 flex w-48 flex-col rounded-lg border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-md transition-all duration-150 ease-out"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100 - 32}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                {/* Operator Header */}
                <div className="flex items-center gap-1.5 border-border/40 border-b pb-1.5">
                  <OperatorAvatar
                    avatarSeed={hoveredPoint.avatarSeed}
                    className="h-4 w-4"
                    gamertag={hoveredPoint.gamertag}
                  />
                  <span className="truncate font-bold text-[10px] text-foreground tracking-tight">
                    {cleanGamertag(hoveredPoint.gamertag)}
                  </span>
                </div>
                {/* Stats list */}
                <div className="mt-1.5 space-y-1 font-mono text-[9px]">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>
                      {chartMode === "session" ? "Partida:" : "Sesión:"}
                    </span>
                    <span className="font-bold text-foreground">
                      {hoveredPoint.xLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-border/10 border-t pt-1 text-muted-foreground">
                    <span>KDR obtenido:</span>
                    <span className="font-extrabold text-primary text-xs">
                      {hoveredPoint.kdr.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>K/D/A:</span>
                    <span className="font-semibold text-foreground">
                      {formatStat(hoveredPoint.kills)}/
                      {formatStat(hoveredPoint.downs)}/
                      {formatStat(hoveredPoint.assists)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center rounded-lg border border-border/40 border-dashed bg-background/30 text-center">
            <span className="mb-2 text-2xl">📉</span>
            <p className="font-medium text-muted-foreground text-xs">
              {chartMode === "session"
                ? "Registra partidas en tu sesión actual para generar la gráfica."
                : "No se encontraron sesiones previas para este escuadrón."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
