import { actions } from "astro:actions";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNearestPOI,
  getPOIGrid,
  isGridCode,
  MapModal,
} from "@/components/map";
import { Button } from "@/components/ui/button";
import type { ActivePlayer } from "./squad-header";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";

interface PlayerStatInput {
  activeClass: string;
  assists: number | "";
  avatarSeed?: string | null;
  downs: number | "";
  endGame: boolean;
  gamertag: string;
  kills: number | "";
  mentalState: number;
  points: number | "";
  respawned: boolean;
  userId?: string | null;
}

interface MatchFormProps {
  activePlayers: ActivePlayer[];
  currentUserId?: string | null;
  isOwner?: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: session draft object
  session: any;
  // biome-ignore lint/suspicious/noExplicitAny: session setter callback
  setSession?: (session: any) => void;
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

const ELIMINATION_CAUSES = [
  "Ninguna (Victoria)",
  "Despliegue Inicial Erróneo (Mal Drop)",
  "Rotación Tardía / Atrapados por la Zona",
  "Flanqueo / Ataque por la Espalda",
  "Desorganización de Escuadra / Falta de Comms",
  "Escuadra Dispersa / Falta de Cohesión",
  "Desventaja de Nivel / Habilidad Enemiga",
  "Duelo Directo Perdido (Gunfight)",
  "Eliminados por un Solo Operador",
  "Superados en Número (Outnumbered)",
  "Ataque Cruzado / Tercero en Discordia (Sandwich)",
  "Ataque de Vehículo Blindado Enemigo (Tanque)",
  "Fuego de Helicóptero Enemigo",
  "Falta de Blindaje (Sin Placas)",
  "Agotamiento de Recursos (Sin Munición)",
  "Sniper / Fuego de Larga Distancia Coordinado",
  "Ataque Aéreo / Rachas de Bajas Hostiles",
  "Emboscada al Intentar Reanimar Compañero",
  "Falta de Cobertura en Terreno Abierto",
  "Destrucción de Vehículo Propio",
  "Problemas Técnicos (Bajos FPS/Lag)",
  "Fatiga o Cansancio del Escuadrón",
  "Desconexión / Abandono de un Operador",
  "Otro",
];

export function MatchForm({
  session,
  activePlayers,
  onCancel,
  onSuccess,
  isOwner = false,
  currentUserId = null,
  setSession,
}: MatchFormProps) {
  const sessionId = session.id;
  const [loading, setLoading] = useState(false);
  const [isSavingMatch, setIsSavingMatch] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const draft = session.match_registration_draft || {
    poi: "Desconocido",
    placement: 1,
    hostility: "Media",
    loot: "Normal",
    eliminationCause: "Ninguna",
    playerStats: [],
  };

  // Local state for the form inputs
  const [poi, setPoi] = useState(draft.poi || "Desconocido");
  const [circleZone, setCircleZone] = useState(draft.circleZone || "");
  const [deathZone, setDeathZone] = useState(draft.deathZone || "");
  const [secondDeployZone, setSecondDeployZone] = useState(
    draft.secondDeployZone || ""
  );
  const [mapTarget, setMapTarget] = useState<
    "poi" | "circle" | "death" | "second_deploy"
  >("poi");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [placement, setPlacement] = useState(draft.placement || 1);
  const [hostility, setHostility] = useState<"Baja" | "Media" | "Alta">(
    draft.hostility || "Media"
  );
  const [loot, setLoot] = useState<"Malo" | "Normal" | "Excelente">(
    draft.loot || "Normal"
  );
  const [eliminationCause, setEliminationCause] = useState(
    draft.eliminationCause || "Ninguna"
  );
  const [parsingImage, setParsingImage] = useState(false);

  const currentUserGamertag =
    activePlayers.find((p) => p.user_id === currentUserId)?.gamertag || null;

  // Individual Player Stats State
  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>(() => {
    const dbStats = draft.playerStats || [];
    const linkedGamertags = activePlayers
      .filter((p) => p.user_id !== null && p.user_id !== undefined)
      .map((p) => p.gamertag);

    if (dbStats.length > 0) {
      return dbStats.filter(
        // biome-ignore lint/suspicious/noExplicitAny: db stats type
        (stat: any) => linkedGamertags.includes(stat.gamertag)
      );
    }
    const playingMembers = activePlayers.filter(
      (p) =>
        p.status !== "ausente" && p.user_id !== null && p.user_id !== undefined
    );
    return playingMembers.map((p) => ({
      userId: p.user_id || null,
      gamertag: p.gamertag,
      activeClass: p.active_class,
      downs: 0,
      kills: 0,
      assists: 0,
      points: 0,
      respawned: false,
      endGame: false,
      mentalState: 3,
      avatarSeed: p.avatar_seed || null,
    }));
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setParsingImage(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];

        // Call serverless action to parse the scoreboard using Gemini
        const activeGamertags = playerStats.map((ps) => ps.gamertag);
        const getSquadSizeLabel = (count: number) => {
          if (count === 4) {
            return "Cuartetos";
          }
          if (count === 3) {
            return "Tríos";
          }
          if (count === 2) {
            return "Dúos";
          }
          return "Solitario";
        };

        const { data, error: parseError } = await actions.match.parseScoreboard(
          {
            base64Image: base64Data,
            activeGamertags,
            squadSize: getSquadSizeLabel(activeGamertags.length),
          }
        );

        if (parseError) {
          throw parseError;
        }

        if (data && Array.isArray(data.parsedStats)) {
          const matchGamertag = (g1: string, g2: string) => {
            const clean = (s: string) =>
              s
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]/g, ""); // remove spec chars
            return clean(g1) === clean(g2);
          };

          const newPlayerStats = playerStats.map((ps) => {
            const parsed = data.parsedStats.find((p: any) =>
              matchGamertag(p.gamertag, ps.gamertag)
            );

            if (parsed) {
              return {
                ...ps,
                kills:
                  typeof parsed.kills === "number" ? parsed.kills : ps.kills,
                downs:
                  typeof parsed.downs === "number" ? parsed.downs : ps.downs,
                assists:
                  typeof parsed.assists === "number"
                    ? parsed.assists
                    : ps.assists,
                points:
                  typeof parsed.points === "number" ? parsed.points : ps.points,
              };
            }
            return ps;
          });

          setPlayerStats(newPlayerStats);

          let updatedPlacement = placement;
          let updatedCause = eliminationCause;

          if (typeof data.placement === "number" && data.placement >= 1) {
            updatedPlacement = data.placement;
            setPlacement(data.placement);
            if (data.placement === 1) {
              updatedCause = "Ninguna (Victoria)";
              setEliminationCause("Ninguna (Victoria)");
            }
          }

          // Trigger auto-save draft to Supabase so other members see it immediately
          const updatedDraft = {
            poi,
            placement: updatedPlacement,
            hostility,
            loot,
            eliminationCause: updatedCause,
            playerStats: newPlayerStats.map((ps) => ({
              userId: ps.userId || null,
              gamertag: ps.gamertag,
              activeClass: ps.activeClass,
              downs: ps.downs === "" ? 0 : ps.downs,
              kills: ps.kills === "" ? 0 : ps.kills,
              assists: ps.assists === "" ? 0 : ps.assists,
              points: ps.points === "" ? 0 : ps.points,
              respawned: ps.respawned,
              endGame: ps.endGame,
              mentalState: ps.mentalState,
              avatarSeed: ps.avatarSeed || null,
            })),
          };

          const { data: updatedSession, error: draftError } =
            await actions.session.updateMatchRegistrationDraft({
              sessionId,
              draft: updatedDraft,
            });

          if (draftError) {
            console.error("Error auto-saving draft:", draftError);
          } else if (updatedSession && setSession) {
            setSession(updatedSession);
          }
        }
      } catch (err) {
        console.error("Error parsing scoreboard:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error al procesar la imagen del marcador."
        );
      } finally {
        setParsingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync state from database updates (realtime)
  useEffect(() => {
    const activeDraft = session.match_registration_draft;
    if (!activeDraft) {
      return;
    }

    setPoi(activeDraft.poi || "Desconocido");
    setCircleZone(activeDraft.circleZone || "");
    setDeathZone(activeDraft.deathZone || "");
    setSecondDeployZone(activeDraft.secondDeployZone || "");
    setPlacement(activeDraft.placement || 1);
    setHostility(activeDraft.hostility || "Media");
    setLoot(activeDraft.loot || "Normal");
    setEliminationCause(activeDraft.eliminationCause || "Ninguna");

    setPlayerStats((prev) => {
      const dbStats = activeDraft.playerStats || [];
      const linkedGamertags = activePlayers
        .filter((p) => p.user_id !== null && p.user_id !== undefined)
        .map((p) => p.gamertag);

      return (
        dbStats
          // biome-ignore lint/suspicious/noExplicitAny: db stats type
          .filter((stat: any) => linkedGamertags.includes(stat.gamertag))
          // biome-ignore lint/suspicious/noExplicitAny: db stats type
          .map((dbStat: any) => {
            const isCurrentUser =
              dbStat.userId === currentUserId ||
              dbStat.gamertag === currentUserGamertag;
            const isReadyInDb = session.ready_players?.includes(
              dbStat.gamertag
            );

            const hasLocalChanges = (local: PlayerStatInput) =>
              (local.kills !== 0 && local.kills !== "") ||
              (local.downs !== 0 && local.downs !== "") ||
              (local.assists !== 0 && local.assists !== "") ||
              (local.points !== 0 && local.points !== "") ||
              local.respawned !== false ||
              local.endGame !== false ||
              local.mentalState !== 3;

            if (isCurrentUser && !isReadyInDb) {
              const localMatch = prev.find(
                (p) => p.gamertag === dbStat.gamertag
              );
              if (localMatch && hasLocalChanges(localMatch)) {
                return localMatch;
              }
              return dbStat;
            }

            if (isOwner && !isReadyInDb) {
              const localMatch = prev.find(
                (p) => p.gamertag === dbStat.gamertag
              );
              if (localMatch && hasLocalChanges(localMatch)) {
                return localMatch;
              }
              return dbStat;
            }

            return dbStat;
          })
      );
    });
  }, [
    session.match_registration_draft,
    session.ready_players,
    currentUserId,
    currentUserGamertag,
    isOwner,
    activePlayers,
  ]);

  // biome-ignore lint/suspicious/noExplicitAny: draft value types
  const handleGeneralInfoChange = async (field: string, value: any) => {
    if (!isOwner) {
      return;
    }

    const updatedDraft = {
      poi,
      placement,
      hostility,
      loot,
      eliminationCause,
      circleZone,
      deathZone,
      secondDeployZone,
      playerStats,
      [field]: value,
    };

    if (field === "placement") {
      updatedDraft.placement = value;
      if (value === 1) {
        setEliminationCause("Ninguna (Victoria)");
        updatedDraft.eliminationCause = "Ninguna (Victoria)";
        setDeathZone("");
        updatedDraft.deathZone = "";
      } else if (
        eliminationCause === "Ninguna" ||
        eliminationCause === "Ninguna (Victoria)" ||
        eliminationCause === "Victoria"
      ) {
        setEliminationCause("Duelo Directo Perdido (Gunfight)");
        updatedDraft.eliminationCause = "Duelo Directo Perdido (Gunfight)";
      }
    }

    if (field === "poi") {
      setPoi(value);
    }
    if (field === "circleZone") {
      setCircleZone(value);
    }
    if (field === "deathZone") {
      setDeathZone(value);
    }
    if (field === "secondDeployZone") {
      setSecondDeployZone(value);
      if (value && value.trim() !== "") {
        const updatedStats = playerStats.map((stat) => ({
          ...stat,
          respawned: true,
        }));
        setPlayerStats(updatedStats);
        updatedDraft.playerStats = updatedStats;
      }
    }
    if (field === "placement") {
      setPlacement(value);
    }
    if (field === "hostility") {
      setHostility(value);
    }
    if (field === "loot") {
      setLoot(value);
    }
    if (field === "eliminationCause") {
      setEliminationCause(value);
    }

    try {
      const { data, error: actionError } =
        await actions.session.updateMatchRegistrationDraft({
          sessionId,
          draft: updatedDraft,
        });
      if (actionError) {
        throw actionError;
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error updating draft general info:", err);
    }
  };

  const handleStatChange = (
    index: number,
    field: keyof PlayerStatInput,
    value: string | number | boolean
  ) => {
    setPlayerStats((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      } as PlayerStatInput;
      return updated;
    });
  };

  const sanitizeStat = (stat: PlayerStatInput) => ({
    ...stat,
    kills: stat.kills === "" ? 0 : stat.kills,
    downs: stat.downs === "" ? 0 : stat.downs,
    assists: stat.assists === "" ? 0 : stat.assists,
    points: stat.points === "" ? 0 : stat.points,
  });

  const handleToggleReady = async (
    gamertag: string,
    currentStat: PlayerStatInput
  ) => {
    const isCurrentlyReady = session.ready_players?.includes(gamertag);
    setLoadingPlayer(gamertag);
    setLoading(true);
    setError(null);
    try {
      let playerStatsPayload;
      if (!isCurrentlyReady) {
        playerStatsPayload = secondDeployZone
          ? { ...sanitizeStat(currentStat), respawned: true }
          : sanitizeStat(currentStat);
      }

      const { data, error: actionError } =
        await actions.session.togglePlayerReady({
          sessionId,
          userId: currentStat.userId || null,
          gamertag,
          isReady: !isCurrentlyReady,
          playerStats: playerStatsPayload,
        });
      if (actionError) {
        throw new Error(actionError.message || "Error al actualizar estado.");
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error toggling ready status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cambiar el estado de listo."
      );
    } finally {
      setLoading(false);
      setLoadingPlayer(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placement < 1) {
      setError("La posición debe ser mayor o igual a 1.");
      return;
    }
    setError(null);
    setLoading(true);
    setIsSavingMatch(true);

    try {
      const sanitizedPlayerStats = playerStats.map((ps) => sanitizeStat(ps));
      const finalPlayerStats = secondDeployZone
        ? sanitizedPlayerStats.map((ps) => ({ ...ps, respawned: true }))
        : sanitizedPlayerStats;

      const { error: actionError } = await actions.match.create({
        sessionId,
        poi,
        placement,
        hostility,
        loot,
        eliminationCause: placement === 1 ? "Victoria" : eliminationCause,
        circleZone: circleZone || null,
        deathZone: deathZone || null,
        secondDeployZone: secondDeployZone || null,
        playerStats: finalPlayerStats,
      });

      if (actionError) {
        throw actionError;
      }

      onSuccess();
    } catch (err) {
      console.error("Error creating match:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al registrar la partida."
      );
    } finally {
      setLoading(false);
      setIsSavingMatch(false);
    }
  };

  const allReady = playerStats.every((p) =>
    session.ready_players?.includes(p.gamertag)
  );

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm">
      {isSavingMatch && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/85 backdrop-blur-[2px]">
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
                Guardando Partida
              </p>
              <p className="font-light text-muted-foreground text-xs">
                Guardando partida y estadísticas...
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 flex flex-col justify-between gap-4 border-border/40 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-bold text-foreground text-sm tracking-tight">
            Registrar Partida
          </h3>
          <p className="font-light text-muted-foreground text-xs">
            Completa los datos de la partida y las estadísticas de los
            operadores en una sola vista
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <input
              accept="image/*"
              className="hidden"
              disabled={parsingImage}
              id="scoreboard-image-upload"
              onChange={handleImageUpload}
              type="file"
            />
            <label
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 font-semibold text-primary text-xs transition-all hover:bg-primary/10 active:scale-95 ${
                parsingImage ? "pointer-events-none opacity-50" : ""
              }`}
              htmlFor="scoreboard-image-upload"
            >
              {parsingImage ? (
                <>
                  <LoaderSpinner />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5" />
                  <span>Cargar Marcador</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Row 1: General match details */}
        <div className="space-y-4 rounded-lg border border-border/50 bg-background/20 p-4">
          <h4 className="border-border/20 border-b pb-2 font-bold text-foreground text-xs uppercase tracking-wider">
            1. Información General de la Partida{" "}
            {!isOwner && (
              <span className="font-normal text-[10px] text-amber-500 lowercase italic">
                (solo lectura para invitados)
              </span>
            )}
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-poi"
              >
                Punto de Caída (POI)
              </label>
              <Button
                className="w-full justify-start border-border bg-background text-left font-normal text-foreground text-xs hover:bg-accent/50 disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner}
                id="match-poi"
                onClick={() => {
                  setMapTarget("poi");
                  setIsMapModalOpen(true);
                }}
                type="button"
                variant="outline"
              >
                {isGridCode(poi)
                  ? `${poi} - ${getNearestPOI(poi)}`
                  : poi && poi !== "Desconocido"
                    ? getPOIGrid(poi)
                      ? `${getPOIGrid(poi)} - ${poi}`
                      : poi
                    : "Seleccionar en Mapa"}
              </Button>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-placement"
              >
                Posición / Colocación
              </label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner}
                id="match-placement"
                min="1"
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value, 10) || 1;
                  handleGeneralInfoChange("placement", val);
                }}
                type="number"
                value={placement}
              />
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-hostility"
              >
                Hostilidad de la Zona
              </label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner}
                id="match-hostility"
                onChange={(e) =>
                  handleGeneralInfoChange("hostility", e.target.value)
                }
                value={hostility}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-loot"
              >
                Calidad de Loot
              </label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner}
                id="match-loot"
                onChange={(e) =>
                  handleGeneralInfoChange("loot", e.target.value)
                }
                value={loot}
              >
                <option value="Malo">Malo</option>
                <option value="Normal">Normal</option>
                <option value="Excelente">Excelente</option>
              </select>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-cause"
              >
                Causa de Aniquilación
              </label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner || placement === 1}
                id="match-cause"
                onChange={(e) =>
                  handleGeneralInfoChange("eliminationCause", e.target.value)
                }
                value={
                  placement === 1 ? "Ninguna (Victoria)" : eliminationCause
                }
              >
                {placement === 1 ? (
                  <option value="Ninguna (Victoria)">Ninguna (Victoria)</option>
                ) : (
                  ELIMINATION_CAUSES.filter(
                    (c) => c !== "Ninguna (Victoria)"
                  ).map((cause) => (
                    <option key={cause} value={cause}>
                      {cause}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block font-medium font-semibold text-muted-foreground text-slate-300 text-xs"
                htmlFor="match-circle"
              >
                Cierre de Círculo
              </label>
              <Button
                className="w-full justify-start border-slate-700 bg-background text-left font-normal text-foreground text-xs hover:bg-accent/50 disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner}
                id="match-circle"
                onClick={() => {
                  setMapTarget("circle");
                  setIsMapModalOpen(true);
                }}
                type="button"
                variant="outline"
              >
                {circleZone
                  ? `${circleZone} - ${getNearestPOI(circleZone)}`
                  : "Seleccionar en Mapa"}
              </Button>
            </div>

            <div>
              <label
                className="mb-1 block font-medium font-semibold text-muted-foreground text-rose-400 text-xs"
                htmlFor="match-death"
              >
                Punto de Muerte (Eliminación)
              </label>
              <Button
                className="w-full justify-start border-rose-950/40 bg-background text-left font-normal text-foreground text-xs hover:bg-rose-500/10 disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner || placement === 1}
                id="match-death"
                onClick={() => {
                  setMapTarget("death");
                  setIsMapModalOpen(true);
                }}
                type="button"
                variant="outline"
              >
                {placement === 1
                  ? "No aplica (Victoria)"
                  : deathZone
                    ? `${deathZone} - ${getNearestPOI(deathZone)}`
                    : "Seleccionar en Mapa"}
              </Button>
            </div>

            <div>
              <label
                className="mb-1 block font-medium font-semibold text-amber-400 text-xs"
                htmlFor="match-second-deploy"
              >
                Segundo Redespliegue Grupal
              </label>
              <Button
                className="w-full justify-start border-amber-950/40 bg-background text-left font-normal text-foreground text-xs hover:bg-amber-500/10 disabled:bg-muted disabled:opacity-50"
                disabled={!isOwner}
                id="match-second-deploy"
                onClick={() => {
                  setMapTarget("second_deploy");
                  setIsMapModalOpen(true);
                }}
                type="button"
                variant="outline"
              >
                {secondDeployZone
                  ? `${secondDeployZone} - ${getNearestPOI(secondDeployZone)}`
                  : "Seleccionar en Mapa"}
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2: Player stats */}
        <div className="space-y-4 rounded-lg border border-border/50 bg-background/20 p-4">
          <h4 className="border-border/20 border-b pb-2 font-bold text-foreground text-xs uppercase tracking-wider">
            2. Estadísticas de los Operadores{" "}
            <span className="font-normal text-[10px] text-amber-500 lowercase italic">
              (solo puedes modificar tu propio slot)
            </span>
          </h4>
          <div className="space-y-4 pr-1">
            {[...playerStats]
              .map((stat, originalIdx) => ({ stat, originalIdx }))
              .sort((a, b) => {
                const isACurrentUser =
                  a.stat.userId === currentUserId ||
                  a.stat.gamertag === currentUserGamertag;
                const isBCurrentUser =
                  b.stat.userId === currentUserId ||
                  b.stat.gamertag === currentUserGamertag;
                if (isACurrentUser && !isBCurrentUser) {
                  return -1;
                }
                if (!isACurrentUser && isBCurrentUser) {
                  return 1;
                }
                return 0;
              })
              .map(({ stat, originalIdx }) => {
                const isCurrentUser =
                  stat.userId === currentUserId ||
                  stat.gamertag === currentUserGamertag;
                const isPlayerReady = session.ready_players?.includes(
                  stat.gamertag
                );
                const canEditPlayer =
                  (isOwner || isCurrentUser) && !isPlayerReady;

                return (
                  <div
                    className={`relative space-y-3 overflow-hidden rounded-lg border p-4 transition-colors duration-200 ${
                      isPlayerReady
                        ? "border-green-500/20 bg-green-500/5 opacity-90"
                        : canEditPlayer
                          ? "border-primary/20 bg-primary/5"
                          : "border-border/60 bg-background/30 opacity-70"
                    }`}
                    key={stat.gamertag}
                  >
                    {loadingPlayer === stat.gamertag && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                        <svg
                          aria-label="Cargando"
                          className="h-6 w-6 animate-spin text-primary"
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
                      </div>
                    )}
                    <div className="flex flex-col gap-2 border-border/40 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
                      {/* Row 1: Player Name, Tú, Class Select */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <OperatorAvatar
                            avatarSeed={stat.avatarSeed}
                            className="h-5 w-5"
                            gamertag={stat.gamertag}
                          />
                          <span
                            className={`font-bold text-xs ${isCurrentUser ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                          >
                            {cleanGamertag(stat.gamertag)}
                          </span>
                        </div>
                        {isCurrentUser && (
                          <span className="rounded bg-emerald-500 px-1.5 py-0.5 font-semibold text-[8px] text-white uppercase dark:bg-emerald-600">
                            Tú
                          </span>
                        )}
                        <select
                          className="rounded border border-border bg-background px-2 py-0.5 font-mono font-sans text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled={!canEditPlayer}
                          onChange={(e) =>
                            handleStatChange(
                              originalIdx,
                              "activeClass",
                              e.target.value
                            )
                          }
                          value={stat.activeClass}
                        >
                          {["Asalto", "Soporte", "Recon", "Ingeniero"].map(
                            (cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* Row 2: Status & Action Button */}
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {isPlayerReady ? (
                          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-semibold text-[9px] text-green-500">
                            Listo 🎯
                          </span>
                        ) : (
                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-semibold text-[9px] text-amber-500">
                            Llenando...
                          </span>
                        )}

                        {(isOwner || isCurrentUser) && (
                          <Button
                            className={`flex h-6 items-center gap-1 px-2 font-medium text-[10px] transition-all ${
                              isPlayerReady
                                ? "border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            disabled={loading}
                            onClick={() =>
                              handleToggleReady(stat.gamertag, stat)
                            }
                            size="sm"
                            type="button"
                            variant={isPlayerReady ? "outline" : "default"}
                          >
                            {loadingPlayer === stat.gamertag && (
                              <LoaderSpinner />
                            )}
                            {isPlayerReady ? "Modificar" : "Marcar Listo"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                      <div>
                        <label
                          className="mb-0.5 block text-[10px] text-muted-foreground"
                          htmlFor={`kills-${stat.gamertag}`}
                        >
                          Kills (K)
                        </label>
                        <input
                          className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled={!canEditPlayer}
                          id={`kills-${stat.gamertag}`}
                          min="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            handleStatChange(
                              originalIdx,
                              "kills",
                              val === "" ? "" : Number.parseInt(val, 10) || 0
                            );
                          }}
                          type="number"
                          value={stat.kills}
                        />
                      </div>

                      <div>
                        <label
                          className="mb-0.5 block text-[10px] text-muted-foreground"
                          htmlFor={`downs-${stat.gamertag}`}
                        >
                          Downs (D)
                        </label>
                        <input
                          className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled={!canEditPlayer}
                          id={`downs-${stat.gamertag}`}
                          min="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            handleStatChange(
                              originalIdx,
                              "downs",
                              val === "" ? "" : Number.parseInt(val, 10) || 0
                            );
                          }}
                          type="number"
                          value={stat.downs}
                        />
                      </div>

                      <div>
                        <label
                          className="mb-0.5 block text-[10px] text-muted-foreground"
                          htmlFor={`assists-${stat.gamertag}`}
                        >
                          Asistencias (A)
                        </label>
                        <input
                          className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled={!canEditPlayer}
                          id={`assists-${stat.gamertag}`}
                          min="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            handleStatChange(
                              originalIdx,
                              "assists",
                              val === "" ? "" : Number.parseInt(val, 10) || 0
                            );
                          }}
                          type="number"
                          value={stat.assists}
                        />
                      </div>

                      <div>
                        <label
                          className="mb-0.5 block text-[10px] text-muted-foreground"
                          htmlFor={`points-${stat.gamertag}`}
                        >
                          Puntos (XP)
                        </label>
                        <input
                          className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled={!canEditPlayer}
                          id={`points-${stat.gamertag}`}
                          min="0"
                          onChange={(e) => {
                            const val = e.target.value;
                            handleStatChange(
                              originalIdx,
                              "points",
                              val === "" ? "" : Number.parseInt(val, 10) || 0
                            );
                          }}
                          type="number"
                          value={stat.points}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-end">
                      <div className="flex flex-wrap gap-4 py-1">
                        <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground">
                          <input
                            checked={secondDeployZone ? true : stat.respawned}
                            className="rounded border-border bg-background text-primary focus:ring-primary disabled:opacity-50"
                            disabled={!canEditPlayer || !!secondDeployZone}
                            onChange={(e) =>
                              handleStatChange(
                                originalIdx,
                                "respawned",
                                e.target.checked
                              )
                            }
                            type="checkbox"
                          />
                          ¿Redesplegado?
                        </label>
                        <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground">
                          <input
                            checked={stat.endGame}
                            className="rounded border-border bg-background text-primary focus:ring-primary disabled:opacity-50"
                            disabled={!canEditPlayer}
                            onChange={(e) =>
                              handleStatChange(
                                originalIdx,
                                "endGame",
                                e.target.checked
                              )
                            }
                            type="checkbox"
                          />
                          ¿End Game / Final?
                        </label>
                      </div>

                      <div>
                        <label
                          className="mb-1.5 block text-[10px] text-muted-foreground"
                          htmlFor={`mental-${stat.gamertag}`}
                        >
                          Estado Mental (Fatiga)
                        </label>
                        <div
                          className="flex gap-1.5"
                          id={`mental-${stat.gamertag}`}
                        >
                          {[1, 2, 3, 4, 5].map((lvl) => {
                            const levelLabels = [
                              "Fatigado",
                              "Cansado",
                              "Normal",
                              "Enfocado",
                              "Excelente",
                            ];
                            const colors = [
                              "bg-red-500/10 text-red-500 border-red-500/30",
                              "bg-amber-500/10 text-amber-500 border-amber-500/30",
                              "bg-blue-500/10 text-blue-500 border-blue-500/30",
                              "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
                              "bg-green-500/10 text-green-500 border-green-500/30",
                            ];
                            const activeColor =
                              "bg-primary text-primary-foreground border-primary";
                            const isActive = stat.mentalState === lvl;

                            return (
                              <button
                                className={`flex-1 cursor-pointer rounded border py-1 text-center font-mono text-[9px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                  isActive ? activeColor : colors[lvl - 1]
                                }`}
                                disabled={!canEditPlayer}
                                key={lvl}
                                onClick={() =>
                                  handleStatChange(
                                    originalIdx,
                                    "mentalState",
                                    lvl
                                  )
                                }
                                title={levelLabels[lvl - 1]}
                                type="button"
                              >
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 border-border/40 border-t pt-4">
          {!allReady && isOwner && (
            <p className="text-amber-500 text-xs">
              Esperando a que todos los operadores marquen "Listo" para
              registrar la partida.
            </p>
          )}
          <div className="flex w-full justify-end gap-3">
            {isOwner ? (
              <>
                <Button onClick={onCancel} type="button" variant="outline">
                  Cancelar
                </Button>
                <Button disabled={loading || !allReady} type="submit">
                  {loading ? (
                    <>
                      <LoaderSpinner />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Partida"
                  )}
                </Button>
              </>
            ) : (
              <div className="w-full py-2 text-center text-muted-foreground text-xs italic">
                Completa tus estadísticas y haz clic en "Marcar Listo" para que
                el líder de la escuadra pueda guardar la partida.
              </div>
            )}
          </div>
        </div>
      </form>
      <MapModal
        isOpen={isMapModalOpen}
        mode={mapTarget === "poi" ? "deploy" : mapTarget}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={(grid) => {
          if (mapTarget === "poi") {
            setPoi(grid);
            handleGeneralInfoChange("poi", grid);
          } else if (mapTarget === "circle") {
            setCircleZone(grid);
            handleGeneralInfoChange("circleZone", grid);
          } else if (mapTarget === "death") {
            setDeathZone(grid);
            handleGeneralInfoChange("deathZone", grid);
          } else if (mapTarget === "second_deploy") {
            setSecondDeployZone(grid);
            handleGeneralInfoChange("secondDeployZone", grid);
          }
        }}
        selectedGrid={
          mapTarget === "poi"
            ? isGridCode(poi)
              ? poi
              : getPOIGrid(poi) || null
            : mapTarget === "circle"
              ? circleZone
              : mapTarget === "death"
                ? deathZone
                : secondDeployZone
        }
      />
    </div>
  );
}
