import { BarChart3, Calendar, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Match } from "./dashboard-content";
import { cleanGamertag } from "./squad-sidebar";

interface PointsContributionChartProps {
  currentUserId?: string | null;
  matches: Match[];
  sessionMatches: Match[];
  // biome-ignore lint/suspicious/noExplicitAny: squad info
  squad: any;
}

// Color palette matching KdrLineChart
const colors = [
  "#10b981", // Emerald/Green (User default)
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#f97316", // Orange
  "#ec4899", // Pink
  "#eab308", // Yellow
];

export function PointsContributionChart({
  currentUserId,
  matches,
  sessionMatches,
  squad,
}: PointsContributionChartProps) {
  const [chartMode, setChartMode] = useState<"general" | "session">("session");

  const squadMembers = useMemo(() => squad?.members || [], [squad]);

  // Sort squad members to match exact color assignment of line chart
  const operatorMeta = useMemo(() => {
    const meta: Record<string, { color: string; isMe: boolean }> = {};

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
      };
    });

    return meta;
  }, [squadMembers, currentUserId]);

  // Calculate points contribution per operator
  const chartData = useMemo(() => {
    const sourceMatches = chartMode === "session" ? sessionMatches : matches;
    const totals: Record<string, number> = {};

    for (const member of squadMembers) {
      totals[member.gamertag] = 0;
    }

    for (const match of sourceMatches) {
      if (match.player_match_stats) {
        for (const stats of match.player_match_stats) {
          // Find matching squad member
          const member = squadMembers.find(
            (m) =>
              (stats.user_id && m.user_id && stats.user_id === m.user_id) ||
              cleanGamertag(stats.gamertag).toLowerCase() ===
                cleanGamertag(m.gamertag).toLowerCase()
          );

          if (member) {
            totals[member.gamertag] += stats.points || 0;
          }
        }
      }
    }

    // Convert to recharts format
    const dataList = squadMembers
      .map((member) => {
        const meta = operatorMeta[member.gamertag];
        return {
          operator: member.gamertag,
          points: totals[member.gamertag] || 0,
          color: meta?.color || colors[0],
          isMe: meta?.isMe,
        };
      })
      .filter((d) => d.points > 0); // Only display operators with points > 0

    return dataList;
  }, [chartMode, sessionMatches, matches, squadMembers, operatorMeta]);

  // Total points in chosen scope
  const totalPointsSum = useMemo(
    () => chartData.reduce((sum, item) => sum + item.points, 0),
    [chartData]
  );

  // Construct dynamic ChartConfig
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      points: {
        label: "Puntos (XP)",
      },
    };
    for (const op of chartData) {
      config[op.operator] = {
        label: cleanGamertag(op.operator),
        color: op.color,
      };
    }
    return config;
  }, [chartData]);

  const hasData = chartData.length > 0 && totalPointsSum > 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-col gap-4 space-y-0 border-border/40 border-b p-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-500" /> Contribución de
            Puntos (XP)
          </CardTitle>
          <CardDescription className="mt-0.5 text-[11px] text-muted-foreground">
            Aporte porcentual de cada operador según el puntaje de la partida.
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
            <BarChart3 className="h-3 w-3" /> Sesión
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
            <Calendar className="h-3 w-3" /> General
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-[250px] flex-1 flex-col justify-center p-5 pb-0">
        {hasData ? (
          <div className="relative mx-auto aspect-square w-full max-w-[240px]">
            <ChartContainer
              className="mx-auto aspect-square max-h-[240px] pb-0 [&_.recharts-pie-label-text]:fill-foreground [&_.recharts-pie-label-text]:font-mono [&_.recharts-pie-label-text]:text-[9px]"
              config={chartConfig}
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="points"
                  label={({ name, percent }) =>
                    `${cleanGamertag(name)} (${(percent * 100).toFixed(0)}%)`
                  }
                  nameKey="operator"
                  outerRadius={75}
                >
                  {chartData.map((entry) => (
                    <Cell fill={entry.color} key={`cell-${entry.operator}`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-border/40 border-dashed bg-background/30 text-center">
            <span className="mb-2 text-2xl">📊</span>
            <p className="px-4 font-medium text-muted-foreground text-xs">
              {chartMode === "session"
                ? "Registra partidas con puntaje en tu sesión actual para generar la gráfica."
                : "No se encontraron estadísticas de puntaje registradas."}
            </p>
          </div>
        )}
      </CardContent>

      {hasData && (
        <div className="mt-auto border-border/20 border-t px-5 pt-4 pb-5">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Detalle de Puntos Acumulados:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {chartData.map((op) => (
                <div
                  className="flex items-center justify-between border-border/10 border-b pb-1"
                  key={op.operator}
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: op.color }}
                    />
                    <span className="truncate font-medium text-foreground">
                      {cleanGamertag(op.operator)}
                    </span>
                  </div>
                  <span className="shrink-0 pl-1 font-bold font-mono text-foreground">
                    {op.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-border/30 border-t pt-2 font-bold text-xs">
              <span className="text-foreground">Total del Escuadrón</span>
              <span className="font-mono text-primary text-sm">
                {totalPointsSum.toLocaleString()} pts
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
