import { actions } from "astro:actions";
import { Calendar, Play, Power } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Match, PlayerMatchStats } from "./dashboard-content";
import { MatchForm } from "./match-form";
import { SquadHeader } from "./squad-header";
import { type ActivePlayer, SquadRoster } from "./squad-roster";

interface Session {
  created_at: string;
  id: string;
  name: string;
  squad_id: string;
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
  owner_id?: string;
}

interface SessionPanelProps {
  activePlayers: ActivePlayer[];
  initialSession: Session | null;
  isOwner: boolean;
  sessionMatches: Match[];
  setActivePlayers: (players: ActivePlayer[]) => void;
  squad: Squad;
  currentUser?: { id: string; email?: string } | null;
}

export function SessionPanel({
  squad,
  initialSession,
  sessionMatches,
  activePlayers,
  setActivePlayers,
  isOwner,
  currentUser = null,
}: SessionPanelProps) {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegisteringMatch, setIsRegisteringMatch] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError("El nombre de la sesión es requerido.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { error: actionError } = await actions.session.create({
        name: sessionName,
        squadId: squad.id,
      });

      if (actionError) {
        throw actionError;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión de juego"
      );
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!initialSession) {
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { error: actionError } = await actions.session.close({
        sessionId: initialSession.id,
      });

      if (actionError) {
        throw actionError;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al cerrar sesión de juego"
      );
      setLoading(false);
    }
  };

  if (!initialSession) {
    if (!isOwner) {
      return (
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm xl:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/20">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-bold text-foreground text-lg tracking-tight">
              Sin Sesión Activa
            </h2>
            <p className="mt-2 font-light text-muted-foreground text-sm leading-relaxed">
              A la espera de que el líder del escuadrón comience una sesión de
              juego.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm xl:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Play className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 font-bold text-foreground text-lg tracking-tight">
            Iniciar Nueva Sesión
          </h2>
          <p className="mt-1 font-light text-muted-foreground text-sm">
            Crea un contenedor para empezar a registrar y analizar tus partidas
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleCreateSession}>
          <div>
            <label
              className="mb-2 block font-medium text-foreground text-xs"
              htmlFor="sessionName"
            >
              Nombre de la Sesión
            </label>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              id="sessionName"
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Ej. Rankeds Martes, Torneo Semanal, etc."
              type="text"
              value={sessionName}
            />
          </div>

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Creando..." : "Crear Sesión Activa"}
          </Button>
        </form>
      </div>
    );
  }

  // Active Session panel
  const startDate = new Date(initialSession.created_at).toLocaleDateString(
    "es-ES",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="space-y-6">
      {/* Session info banner */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 xl:flex-row xl:items-center">
        <div className="flex items-start gap-3">
          <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-bold text-foreground text-md tracking-tight">
              Sesión Activa: {initialSession.name}
            </h2>
            <p className="font-light text-muted-foreground text-xs">
              Iniciada el {startDate}
            </p>
          </div>
        </div>
        {isOwner && (
          <Button
            className="flex items-center gap-1.5 px-4 py-2 h-auto"
            disabled={loading}
            onClick={handleCloseSession}
            size="sm"
            variant="destructive"
          >
            <Power className="h-4 w-4" />
            {loading ? "Cerrando..." : "Finalizar Sesión"}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-xs">
          {error}
        </div>
      )}

      {/* Roster stats header */}
      <SquadHeader activePlayers={activePlayers} />

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column: Squad Roster configuration */}
        <div className="xl:col-span-1">
          <SquadRoster
            activePlayers={activePlayers}
            isOwner={isOwner}
            currentUserId={currentUser?.id}
            squadId={squad.id}
            onChange={setActivePlayers}
            originalMembers={squad.members}
          />
        </div>

        {/* Right Column: Match registration or list */}
        <div className="space-y-4 xl:col-span-2">
          {isRegisteringMatch ? (
            <div className="space-y-4">
              <Button
                onClick={() => setIsRegisteringMatch(false)}
                size="sm"
                variant="outline"
              >
                Volver al Listado
              </Button>
              <MatchForm
                activePlayers={activePlayers}
                onCancel={() => setIsRegisteringMatch(false)}
                onSuccess={() => {
                  setIsRegisteringMatch(false);
                }}
                sessionId={initialSession.id}
                isOwner={isOwner}
                currentUserId={currentUser?.id}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between border-border/40 border-b pb-4">
                <h3 className="font-bold text-foreground text-sm tracking-tight">
                  Partidas de la Sesión
                </h3>
                 {initialSession && (
                  <Button onClick={() => setIsRegisteringMatch(true)} size="sm" className="px-4 py-2 h-auto">
                    + Registrar Partida
                  </Button>
                )}
              </div>

              {sessionMatches.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
                  <span className="mb-4 text-3xl">⚔️</span>
                  <h4 className="font-semibold text-foreground text-sm">
                    Sin Partidas Registradas
                  </h4>
                  <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
                    {isOwner
                      ? "Registra tu primera partida de la sesión usando el botón superior para empezar a acumular estadísticas."
                      : "El líder del escuadrón aún no ha registrado ninguna partida para esta sesión."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {sessionMatches.map((match) => {
                    const isExpanded = expandedMatchId === match.id;
                    const matchDate = new Date(
                      match.created_at
                    ).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        className="overflow-hidden rounded-lg border border-border/60 bg-background/30"
                        key={match.id}
                      >
                        {/* Summary Row */}
                        <button
                          className="flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-colors hover:bg-muted/10"
                          onClick={() =>
                            setExpandedMatchId(isExpanded ? null : match.id)
                          }
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full font-mono font-semibold text-xs ${
                                match.placement === 1
                                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-500 border"
                                  : match.placement === 2
                                    ? "border border-slate-300/40 bg-slate-300/20 text-slate-400 dark:text-slate-300 border"
                                    : match.placement === 3
                                      ? "border border-amber-700/30 bg-amber-700/20 text-amber-700 dark:text-amber-600 border"
                                      : match.placement === 4 || match.placement === 5
                                        ? "border border-blue-500/30 bg-blue-500/20 text-blue-500 border"
                                        : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {match.placement}
                            </span>
                            <div>
                              <p className="font-bold text-foreground text-xs">
                                {match.placement === 1
                                  ? "¡Victoria! 🏆"
                                  : `Lugar #${match.placement}`}
                              </p>
                              <p className="font-light text-[10px] text-muted-foreground">
                                Drop:{" "}
                                <span className="font-medium text-foreground/80">
                                  {match.poi}
                                </span>{" "}
                                • {matchDate}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono text-primary text-xs hover:underline">
                              {isExpanded ? "Ocultar" : "Detalles"}
                            </span>
                          </div>
                        </button>

                        {/* Expanded Player Stats */}
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
                            <div className="hidden xl:block overflow-x-auto">
                              <table className="w-full text-left font-sans text-xs">
                                <thead>
                                  <tr className="border-border/30 border-b font-mono text-[10px] text-muted-foreground uppercase">
                                    <th className="py-2">Operador</th>
                                    <th className="py-2 text-center">Clase</th>
                                    <th className="py-2 text-center">
                                      K / D / A
                                    </th>
                                    <th className="py-2 text-center">
                                      Downs / Rev
                                    </th>
                                    <th className="py-2 text-center">
                                      Desp / Final
                                    </th>
                                    <th className="py-2 text-center">Mente</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                  {match.player_match_stats?.map(
                                    (stat: PlayerMatchStats) => {
                                      const k = stat.kills || 0;
                                      const d = stat.downs || 0;
                                      const kdr =
                                        d > 0
                                          ? (k / d).toFixed(2)
                                          : k.toFixed(2);

                                      const mentalColors = [
                                        "text-red-500",
                                        "text-amber-500",
                                        "text-blue-500",
                                        "text-emerald-500",
                                        "text-green-500",
                                      ];

                                      return (
                                        <tr
                                          className="hover:bg-muted/5"
                                          key={stat.id}
                                        >
                                          <td className="py-2 font-semibold text-foreground">
                                            {stat.gamertag}
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
                            <div className="block xl:hidden space-y-2.5">
                              {match.player_match_stats?.map(
                                (stat: PlayerMatchStats) => {
                                  const k = stat.kills || 0;
                                  const d = stat.downs || 0;
                                  const kdr =
                                    d > 0
                                      ? (k / d).toFixed(2)
                                      : k.toFixed(2);

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
                                  const mentalLabel = mentalLabels[stat.mental_state - 1] || `${stat.mental_state}`;

                                  return (
                                    <div
                                      className="rounded-lg border border-border/50 bg-background/20 p-3 text-xs"
                                      key={stat.id}
                                    >
                                      {/* Header of Player Card */}
                                      <div className="flex items-center justify-between border-b border-border/20 pb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-foreground">
                                            {stat.gamertag}
                                          </span>
                                          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                                            {stat.active_class}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Stats Grid */}
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-[11px]">
                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground font-light">K/D/A (KDR):</span>
                                          <span className="font-mono font-semibold text-foreground">
                                            {k}/{d}/{stat.assists} <span className="text-muted-foreground text-[9px]">({kdr})</span>
                                          </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground font-light">Reanimaciones:</span>
                                          <span className="font-mono font-semibold text-foreground">
                                            {stat.revives}
                                          </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground font-light font-sans">Reaparecido:</span>
                                          <span className="font-semibold text-foreground">
                                            {stat.respawned ? "Sí ✅" : "No ❌"}
                                          </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                          <span className="text-muted-foreground font-light font-sans">Fase Final:</span>
                                          <span className="font-semibold text-foreground">
                                            {stat.end_game ? "Sí ✅" : "No ❌"}
                                          </span>
                                        </div>

                                        <div className="flex justify-between items-center col-span-2 border-t border-border/10 pt-2 mt-1">
                                          <span className="text-muted-foreground font-light font-sans">Estado Mental:</span>
                                          <span
                                            className={`rounded px-1.5 py-0.5 font-sans text-[10px] font-semibold border ${mentalColors[stat.mental_state - 1]}`}
                                          >
                                            {mentalLabel}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
