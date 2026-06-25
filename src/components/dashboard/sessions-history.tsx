import { actions } from "astro:actions";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Loader2,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Match, PlayerMatchStats } from "./dashboard-content";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";

interface HistorySession {
  avg_placement: number;
  closed_at: string | null;
  created_at: string;
  id: string;
  match_count: number;
  name: string;
  squad_id: string;
  status: string;
  win_rate: number;
}

interface SessionsHistoryProps {
  currentUserId?: string | null;
  squadId: string;
}

export function SessionsHistory({
  squadId,
  currentUserId = null,
}: SessionsHistoryProps) {
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [sessionMatches, setSessionMatches] = useState<Record<string, Match[]>>(
    {}
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error: actionError } = await actions.session.getHistory({
          squadId,
        });

        if (actionError) {
          throw actionError;
        }

        setSessions((data as HistorySession[]) || []);
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Error al cargar el historial de sesiones.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [squadId]);

  const handleToggle = async (sessionId: string) => {
    if (expandedId === sessionId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(sessionId);

    // Only fetch if we haven't loaded this session's matches yet
    if (!sessionMatches[sessionId]) {
      setDetailLoading(sessionId);
      try {
        const { data, error: actionError } = await actions.session.getDetail({
          sessionId,
        });

        if (actionError) {
          throw actionError;
        }

        setSessionMatches((prev) => ({
          ...prev,
          [sessionId]: (data as Match[]) || [],
        }));
      } catch (err) {
        console.error("Error loading session detail:", err);
      } finally {
        setDetailLoading(null);
      }
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (start: string, end: string | null) => {
    if (!end) {
      return "—";
    }
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card p-12">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 font-light text-muted-foreground text-sm">
          Cargando historial...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-light text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 font-bold text-foreground text-sm tracking-tight">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          Sesiones Anteriores
        </h3>
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
          <span className="mb-4 text-3xl">📅</span>
          <h4 className="font-semibold text-foreground text-sm">
            Sin Historial
          </h4>
          <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
            Aún no hay sesiones finalizadas. Una vez que cierres tu primera
            sesión de juego, aparecerá aquí con todas las métricas acumuladas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-foreground text-sm tracking-tight">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          Sesiones Anteriores
        </h3>
        <span className="font-mono text-muted-foreground text-xs">
          {sessions.length} sesión{sessions.length === 1 ? "" : "es"}
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const isExpanded = expandedId === session.id;
          const matches = sessionMatches[session.id];
          const isLoadingDetail = detailLoading === session.id;

          return (
            <div
              className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-200"
              key={session.id}
            >
              {/* Session Summary Row */}
              <button
                className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-muted/10"
                onClick={() => handleToggle(session.id)}
                type="button"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">
                      {session.name}
                    </h4>
                    <p className="mt-0.5 font-light text-muted-foreground text-xs">
                      {formatDate(session.created_at)} •{" "}
                      {formatTime(session.created_at)}
                      {session.closed_at &&
                        ` → ${formatTime(session.closed_at)}`}{" "}
                      ({formatDuration(session.created_at, session.closed_at)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quick Stats */}
                  <div className="hidden items-center gap-3 xl:flex">
                    <div className="flex items-center gap-1 text-center">
                      <Crosshair className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-foreground text-xs">
                        {session.match_count}
                      </span>
                      <span className="font-light text-[10px] text-muted-foreground">
                        partidas
                      </span>
                    </div>

                    <div className="h-4 w-px bg-border" />

                    <div className="flex items-center gap-1 text-center">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-foreground text-xs">
                        #{session.avg_placement}
                      </span>
                      <span className="font-light text-[10px] text-muted-foreground">
                        prom.
                      </span>
                    </div>

                    <div className="h-4 w-px bg-border" />

                    <div className="flex items-center gap-1 text-center">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      <span
                        className={`font-mono text-xs ${session.win_rate > 0 ? "text-amber-500" : "text-muted-foreground"}`}
                      >
                        {session.win_rate}%
                      </span>
                      <span className="font-light text-[10px] text-muted-foreground">
                        WR
                      </span>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Mobile Stats (visible below summary on small screens) */}
              {!isExpanded && (
                <div className="flex gap-4 border-border/40 border-t px-4 py-2 xl:hidden">
                  <span className="font-mono text-muted-foreground text-xs">
                    {session.match_count} partidas
                  </span>
                  <span className="font-mono text-muted-foreground text-xs">
                    Pos. #{session.avg_placement}
                  </span>
                  <span
                    className={`font-mono text-xs ${session.win_rate > 0 ? "text-amber-500" : "text-muted-foreground"}`}
                  >
                    WR {session.win_rate}%
                  </span>
                </div>
              )}

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-border/40 border-t bg-background/30 p-4">
                  {isLoadingDetail ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="ml-2 font-light text-muted-foreground text-xs">
                        Cargando partidas...
                      </span>
                    </div>
                  ) : !matches || matches.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="font-light text-muted-foreground text-xs">
                        Esta sesión no tiene partidas registradas.
                      </p>
                    </div>
                  ) : (
                    <MatchDetailList
                      currentUserId={currentUserId}
                      matches={matches}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Match Detail List (reusable accordion for expanded sessions) ── */

function MatchDetailList({
  matches,
  currentUserId,
}: {
  matches: Match[];
  currentUserId: string | null;
}) {
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {matches.map((match, index) => {
        const isExpanded = expandedMatchId === match.id;
        const matchTime = new Date(match.created_at).toLocaleTimeString(
          "es-ES",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        return (
          <div
            className="overflow-hidden rounded-lg border border-border/60 bg-card/50"
            key={match.id}
          >
            {/* Match Summary */}
            <button
              className="flex w-full cursor-pointer items-center justify-between p-3 text-left transition-colors hover:bg-muted/10"
              onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-mono font-semibold text-xs ${
                    match.placement === 1
                      ? "border border-amber-500/30 bg-amber-500/20 text-amber-500"
                      : match.placement === 2
                        ? "border border-slate-300/40 bg-slate-300/20 text-slate-400 dark:text-slate-300"
                        : match.placement === 3
                          ? "border border-amber-700/30 bg-amber-700/20 text-amber-700 dark:text-amber-600"
                          : match.placement === 4 || match.placement === 5
                            ? "border border-blue-500/30 bg-blue-500/20 text-blue-500"
                            : "bg-muted text-muted-foreground"
                  }`}
                >
                  {match.placement}
                </span>
                <div>
                  <p className="font-bold text-foreground text-xs">
                    Partida #{index + 1} {match.placement === 1 && "🏆"}
                  </p>
                  <p className="font-light text-[10px] text-muted-foreground">
                    Drop:{" "}
                    <span className="font-medium text-foreground/80">
                      {match.poi}
                    </span>{" "}
                    • {matchTime}
                  </p>
                </div>
              </div>

              <span className="font-mono text-primary text-xs hover:underline">
                {isExpanded ? "Ocultar" : "Detalles"}
              </span>
            </button>

            {/* Match Player Stats */}
            {isExpanded && (
              <div className="space-y-3 border-border/40 border-t bg-card/40 p-4">
                <div className="flex justify-between border-border/20 border-b pb-2 text-[10px] text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground/80">
                      Causa:{" "}
                    </span>
                    {match.elimination_cause}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/80">
                      Loot:{" "}
                    </span>
                    {match.loot} •{" "}
                    <span className="font-semibold text-foreground/80">
                      Hostilidad:{" "}
                    </span>
                    {match.hostility}
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="border-border/30 border-b font-mono text-[10px] text-muted-foreground uppercase">
                        <th className="py-2">Operador</th>
                        <th className="py-2 text-center">Clase</th>
                        <th className="py-2 text-center">K / D / A</th>
                        <th className="py-2 text-center">Downs / Rev</th>
                        <th className="py-2 text-center">Desp / Final</th>
                        <th className="py-2 text-center">Mente</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {match.player_match_stats?.map(
                        (stat: PlayerMatchStats) => {
                          const k = stat.kills || 0;
                          const d = stat.downs || 0;
                          const kdr = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);

                          const mentalColors = [
                            "text-red-500",
                            "text-amber-500",
                            "text-blue-500",
                            "text-emerald-500",
                            "text-green-500",
                          ];

                          return (
                            <tr className="hover:bg-muted/5" key={stat.id}>
                              <td
                                className={`py-2 font-semibold ${stat.user_id === currentUserId ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <OperatorAvatar
                                    avatarSeed={stat.avatar_seed}
                                    className="h-5 w-5"
                                    gamertag={stat.gamertag}
                                  />
                                  <span>
                                    {cleanGamertag(stat.gamertag)}{" "}
                                    {stat.user_id === currentUserId && "(Tú)"}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 text-center">
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                                  {stat.active_class}
                                </span>
                              </td>
                              <td className="py-2 text-center font-mono">
                                {k} / {d} / {stat.assists}{" "}
                                <span className="text-[10px] text-muted-foreground">
                                  ({kdr})
                                </span>
                              </td>
                              <td className="py-2 text-center font-mono">
                                {stat.downs} / {stat.revives}
                              </td>
                              <td className="py-2 text-center">
                                {stat.respawned ? "✅" : "❌"} /{" "}
                                {stat.end_game ? "✅" : "❌"}
                              </td>
                              <td
                                className={`py-2 text-center font-bold ${mentalColors[stat.mental_state - 1]}`}
                              >
                                {stat.mental_state}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block space-y-2.5 xl:hidden">
                  {match.player_match_stats?.map((stat: PlayerMatchStats) => {
                    const k = stat.kills || 0;
                    const d = stat.downs || 0;
                    const kdr = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);

                    const mentalColors = [
                      "text-red-500 bg-red-500/10 border-red-500/20",
                      "text-amber-500 bg-amber-500/10 border-amber-500/20",
                      "text-blue-500 bg-blue-500/10 border-blue-500/20",
                      "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                      "text-green-500 bg-green-500/10 border-green-500/20",
                    ];

                    const mentalLabels = [
                      "Tilt 😡",
                      "Fatiga 🥱",
                      "Normal 😐",
                      "Concentrado 🎯",
                      "Excelente 🔥",
                    ];
                    const mentalLabel =
                      mentalLabels[stat.mental_state - 1] ||
                      `${stat.mental_state}`;

                    return (
                      <div
                        className="rounded-lg border border-border/50 bg-background/20 p-3 text-xs"
                        key={stat.id}
                      >
                        {/* Header of Player Card */}
                        <div className="flex items-center justify-between border-border/20 border-b pb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <OperatorAvatar
                                avatarSeed={stat.avatar_seed}
                                className="h-5 w-5"
                                gamertag={stat.gamertag}
                              />
                              <span
                                className={`font-bold ${stat.user_id === currentUserId ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                              >
                                {cleanGamertag(stat.gamertag)}{" "}
                                {stat.user_id === currentUserId && "(Tú)"}
                              </span>
                            </div>
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                              {stat.active_class}
                            </span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-light text-muted-foreground">
                              K/D/A (KDR):
                            </span>
                            <span className="font-mono font-semibold text-foreground">
                              {k}/{d}/{stat.assists}{" "}
                              <span className="text-[9px] text-muted-foreground">
                                ({kdr})
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-light text-muted-foreground">
                              Reanimaciones:
                            </span>
                            <span className="font-mono font-semibold text-foreground">
                              {stat.revives}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-light font-sans text-muted-foreground">
                              Reaparecido:
                            </span>
                            <span className="font-semibold text-foreground">
                              {stat.respawned ? "Sí ✅" : "No ❌"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-light font-sans text-muted-foreground">
                              Fase Final:
                            </span>
                            <span className="font-semibold text-foreground">
                              {stat.end_game ? "Sí ✅" : "No ❌"}
                            </span>
                          </div>

                          <div className="col-span-2 mt-1 flex items-center justify-between border-border/10 border-t pt-2">
                            <span className="font-light font-sans text-muted-foreground">
                              Estado Mental:
                            </span>
                            <span
                              className={`rounded border px-1.5 py-0.5 font-sans font-semibold text-[10px] ${mentalColors[stat.mental_state - 1]}`}
                            >
                              {mentalLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
