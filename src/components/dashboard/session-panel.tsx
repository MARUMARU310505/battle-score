import { actions } from "astro:actions";
import { Calendar, Play, Power } from "lucide-react";
import { useState } from "react";
import {
  getNearestPOI,
  getPOIGrid,
  isGridCode,
  MapModal,
} from "@/components/map";
import { Button } from "@/components/ui/button";
import type { Match, PlayerMatchStats } from "./dashboard-content";
import { MatchForm } from "./match-form";
import { SessionLiveStats } from "./session-live-stats";
import { type ActivePlayer, SquadHeader } from "./squad-header";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";

interface Session {
  created_at: string;
  id: string;
  is_registering_match?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: draft structure is dynamic
  match_registration_draft?: any;
  name: string;
  ready_players?: string[];
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
  currentUser?: { id: string; email?: string } | null;
  initialSession: Session | null;
  isOwner: boolean;
  sessionMatches: Match[];
  setActivePlayers: (players: ActivePlayer[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: session callback type
  setSession?: (session: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: squad state dispatcher type
  setSquadState?: React.Dispatch<React.SetStateAction<any>>;
  squad: Squad;
}

const LoaderSpinner = () => (
  <svg
    aria-label="Cargando"
    className="mr-2 -ml-1 inline h-3.5 w-3.5 animate-spin text-current"
    fill="none"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Cargando</title>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      fill="currentColor"
    />
  </svg>
);

export function SessionPanel({
  squad,
  initialSession,
  sessionMatches,
  activePlayers,
  setActivePlayers,
  isOwner,
  currentUser = null,
  setSession,
  setSquadState,
}: SessionPanelProps) {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [selectedPoiForMap, setSelectedPoiForMap] = useState<string | null>(
    null
  );
  const [mapModalMode, setMapModalMode] = useState<
    "deploy" | "circle" | "death" | "second_deploy"
  >("deploy");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [subTab, setSubTab] = useState<"list" | "stats">("list");

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError("El nombre de la sesión es requerido.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { data, error: actionError } = await actions.session.create({
        name: sessionName,
        squadId: squad.id,
      });

      if (actionError) {
        throw actionError;
      }

      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión de juego"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!initialSession) {
      return;
    }
    setError(null);
    setLoading(true);
    setIsClosing(true);

    try {
      const { error: actionError } = await actions.session.close({
        sessionId: initialSession.id,
      });

      if (actionError) {
        throw actionError;
      }

      if (setSession) {
        setSession(null);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al cerrar sesión de juego"
      );
    } finally {
      setLoading(false);
      setIsClosing(false);
    }
  };

  const handleStartRegistration = async () => {
    if (!initialSession) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const playersForDraft = activePlayers
        .filter(
          (p) =>
            p.status !== "ausente" &&
            p.user_id !== null &&
            p.user_id !== undefined
        )
        .map((p) => ({
          userId: p.user_id || null,
          gamertag: p.gamertag,
          activeClass: p.active_class,
          avatarSeed: p.avatar_seed || null,
        }));
      const { data, error: actionError } =
        await actions.session.startMatchRegistration({
          sessionId: initialSession.id,
          players: playersForDraft,
        });
      if (actionError) {
        throw new Error(actionError.message || "Error al iniciar el registro.");
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error starting match registration:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al iniciar el registro de partida."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!initialSession) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: actionError } =
        await actions.session.cancelMatchRegistration({
          sessionId: initialSession.id,
        });
      if (actionError) {
        throw new Error(
          actionError.message || "Error al cancelar el registro."
        );
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error cancelling match registration:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cancelar el registro de partida."
      );
    } finally {
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
            {loading ? (
              <>
                <LoaderSpinner />
                Creando...
              </>
            ) : (
              "Crear Sesión Activa"
            )}
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
    <div className="relative space-y-6">
      {isClosing && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-lg bg-background/75 backdrop-blur-[2px]">
          <div className="fade-in zoom-in-95 flex max-w-xs animate-in flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-lg duration-200">
            <svg
              className="h-8 w-8 animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm tracking-tight">
                Finalizando Sesión
              </p>
              <p className="font-light text-muted-foreground text-xs">
                Guardando datos de la sesión...
              </p>
            </div>
          </div>
        </div>
      )}
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
            className="flex h-auto items-center gap-1.5 px-4 py-2"
            disabled={loading}
            onClick={handleCloseSession}
            size="sm"
            variant="destructive"
          >
            {loading ? (
              <>
                <LoaderSpinner />
                Cerrando...
              </>
            ) : (
              <>
                <Power className="h-4 w-4" />
                Finalizar Sesión
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-xs">
          {error}
        </div>
      )}

      {/* Roster stats header with status controls */}
      <SquadHeader
        activePlayers={activePlayers}
        currentUserId={currentUser?.id}
        isOwner={isOwner}
        setSquadState={setSquadState}
        squadId={squad.id}
      />

      {/* Match registration or list (full width) */}
      <div>
        <div className="space-y-4">
          {initialSession.is_registering_match ? (
            <div className="space-y-4">
              {isOwner ? (
                <Button
                  disabled={loading}
                  onClick={handleCancelRegistration}
                  size="sm"
                  variant="outline"
                >
                  {loading && <LoaderSpinner />}
                  Volver al Listado (Cancelar)
                </Button>
              ) : (
                <div className="flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/10 p-3 font-medium text-amber-500 text-xs">
                  <span>
                    El líder de la escuadra está registrando una partida.
                    Completa tus estadísticas.
                  </span>
                </div>
              )}
              <MatchForm
                activePlayers={activePlayers}
                currentUserId={currentUser?.id}
                isOwner={isOwner}
                onCancel={handleCancelRegistration}
                onSuccess={() => {
                  handleCancelRegistration();
                }}
                session={initialSession}
                setSession={setSession}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-col gap-3 border-border/40 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className={`cursor-pointer border-b-2 pb-1 font-bold text-xs uppercase tracking-wider transition-all ${
                      subTab === "list"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSubTab("list")}
                    type="button"
                  >
                    Partidas ({sessionMatches.length})
                  </button>
                  <button
                    className={`cursor-pointer border-b-2 pb-1 font-bold text-xs uppercase tracking-wider transition-all ${
                      subTab === "stats"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSubTab("stats")}
                    type="button"
                  >
                    Rendimiento en Vivo
                  </button>
                </div>
                {isOwner && initialSession && (
                  <Button
                    className="h-auto shrink-0 px-4 py-2"
                    disabled={loading}
                    onClick={handleStartRegistration}
                    size="sm"
                  >
                    {loading && <LoaderSpinner />}+ Registrar Partida
                  </Button>
                )}
              </div>

              {subTab === "stats" ? (
                <SessionLiveStats
                  activePlayers={activePlayers}
                  currentUserId={currentUser?.id}
                  sessionMatches={sessionMatches}
                />
              ) : sessionMatches.length === 0 ? (
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
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-bold text-xs sm:h-8 sm:w-8 sm:text-sm ${
                                match.placement === 1
                                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-500"
                                  : match.placement === 2
                                    ? "border border-slate-300/40 bg-slate-300/20 text-slate-400 dark:text-slate-300"
                                    : match.placement === 3
                                      ? "border border-amber-700/30 bg-amber-700/20 text-amber-700 dark:text-amber-600"
                                      : match.placement === 4 ||
                                          match.placement === 5
                                        ? "border border-blue-500/30 bg-blue-500/20 text-blue-500"
                                        : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {match.placement}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2">
                                <span className="font-bold text-foreground text-xs">
                                  {match.placement === 1
                                    ? "¡Victoria! 🏆"
                                    : `Lugar #${match.placement}`}
                                </span>
                                <span className="text-[10px] text-muted-foreground/40">
                                  •
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {matchDate}
                                </span>
                              </div>
                              <div className="fade-in flex animate-in flex-wrap items-center gap-x-2.5 gap-y-1 font-light text-[10px] text-muted-foreground duration-200">
                                <span className="inline-flex items-center gap-1">
                                  <span className="text-muted-foreground/70">
                                    Drop:
                                  </span>
                                  <span
                                    className="cursor-pointer font-medium text-foreground/80 transition-colors hover:text-emerald-400 hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPoiForMap(match.poi);
                                      setMapModalMode("deploy");
                                      setIsMapModalOpen(true);
                                    }}
                                  >
                                    {isGridCode(match.poi)
                                      ? `${match.poi} - ${getNearestPOI(match.poi)}`
                                      : match.poi}
                                  </span>
                                </span>

                                {match.circle_zone && (
                                  <span className="inline-flex items-center gap-1">
                                    <span className="text-muted-foreground/40">
                                      •
                                    </span>
                                    <span className="text-muted-foreground/70">
                                      Círculo:
                                    </span>
                                    <span
                                      className="cursor-pointer font-medium text-foreground/80 transition-colors hover:text-white hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPoiForMap(match.circle_zone);
                                        setMapModalMode("circle");
                                        setIsMapModalOpen(true);
                                      }}
                                    >
                                      {match.circle_zone} -{" "}
                                      {getNearestPOI(match.circle_zone)}
                                    </span>
                                  </span>
                                )}

                                {match.death_zone && (
                                  <span className="inline-flex items-center gap-1">
                                    <span className="text-muted-foreground/40">
                                      •
                                    </span>
                                    <span className="text-muted-foreground/70">
                                      Muerte:
                                    </span>
                                    <span
                                      className="cursor-pointer font-medium text-foreground/80 transition-colors hover:text-rose-400 hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPoiForMap(match.death_zone);
                                        setMapModalMode("death");
                                        setIsMapModalOpen(true);
                                      }}
                                    >
                                      {match.death_zone} -{" "}
                                      {getNearestPOI(match.death_zone)}
                                    </span>
                                  </span>
                                )}

                                {match.second_deploy_zone && (
                                  <span className="inline-flex items-center gap-1">
                                    <span className="text-muted-foreground/40">
                                      •
                                    </span>
                                    <span className="text-muted-foreground/70">
                                      Redespliegue:
                                    </span>
                                    <span
                                      className="cursor-pointer font-medium text-foreground/80 transition-colors hover:text-amber-400 hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPoiForMap(
                                          match.second_deploy_zone
                                        );
                                        setMapModalMode("second_deploy");
                                        setIsMapModalOpen(true);
                                      }}
                                    >
                                      {match.second_deploy_zone} -{" "}
                                      {getNearestPOI(match.second_deploy_zone)}
                                    </span>
                                  </span>
                                )}
                              </div>
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
                            <div className="hidden overflow-x-auto xl:block">
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
                                          <td
                                            className={`py-2 font-semibold ${stat.user_id === currentUser?.id ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                                          >
                                            <div className="flex items-center gap-1.5">
                                              <OperatorAvatar
                                                avatarSeed={stat.avatar_seed}
                                                className="h-5 w-5"
                                                gamertag={stat.gamertag}
                                              />
                                              <span>
                                                {cleanGamertag(stat.gamertag)}{" "}
                                                {stat.user_id ===
                                                  currentUser?.id && "(Tú)"}
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
                              {match.player_match_stats?.map(
                                (stat: PlayerMatchStats) => {
                                  const k = stat.kills || 0;
                                  const d = stat.downs || 0;
                                  const kdr =
                                    d > 0 ? (k / d).toFixed(2) : k.toFixed(2);

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
                                              className={`font-bold ${stat.user_id === currentUser?.id ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                                            >
                                              {cleanGamertag(stat.gamertag)}{" "}
                                              {stat.user_id ===
                                                currentUser?.id && "(Tú)"}
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
      <MapModal
        isOpen={isMapModalOpen}
        mode={mapModalMode}
        onClose={() => {
          setIsMapModalOpen(false);
          setSelectedPoiForMap(null);
        }}
        readOnly={true}
        selectedGrid={
          selectedPoiForMap && isGridCode(selectedPoiForMap)
            ? selectedPoiForMap
            : selectedPoiForMap
              ? getPOIGrid(selectedPoiForMap)
              : null
        }
      />
    </div>
  );
}
