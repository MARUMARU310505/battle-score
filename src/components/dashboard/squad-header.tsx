import { actions } from "astro:actions";
import { UserCheck, UserMinus } from "lucide-react";
import { useState } from "react";
import { useNotification } from "@/components/ui/notification";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";

export interface ActivePlayer {
  active_class: string;
  assists?: number;
  avatar_seed?: string | null;
  downs?: number;
  favorite_class: string;
  gamertag: string;
  kills?: number;
  slot_number: number;
  status: "titular" | "reemplazo" | "ausente";
  user_id?: string | null;
}

interface SquadHeaderProps {
  activePlayers: ActivePlayer[];
  currentUserId?: string | null;
  isOwner?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: React state dispatcher type
  setSquadState?: React.Dispatch<React.SetStateAction<any>>;
  squadId?: string;
}

export function SquadHeader({
  activePlayers,
  currentUserId = null,
  isOwner = false,
  squadId,
  setSquadState,
}: SquadHeaderProps) {
  const [loadingSlot, setLoadingSlot] = useState<number | null>(null);
  const { notify } = useNotification();

  const activePlaying = activePlayers.filter((p) => p.status !== "ausente");
  const hasAnyStats = activePlaying.some(
    (p) => (p.kills || 0) > 0 || (p.downs || 0) > 0 || (p.assists || 0) > 0
  );

  let mvpSlot: number | null = null;
  let mochilaSlot: number | null = null;

  if (hasAnyStats && activePlaying.length >= 2) {
    const getKDR = (p: ActivePlayer) => {
      const k = p.kills || 0;
      const d = p.downs || 0;
      return d > 0 ? k / d : k;
    };

    const sortedForMvp = [...activePlaying].sort((a, b) => {
      const kdrA = getKDR(a);
      const kdrB = getKDR(b);
      if (kdrB !== kdrA) {
        return kdrB - kdrA;
      }

      const killsA = a.kills || 0;
      const killsB = b.kills || 0;
      if (killsB !== killsA) {
        return killsB - killsA;
      }

      const assistsA = a.assists || 0;
      const assistsB = b.assists || 0;
      if (assistsB !== assistsA) {
        return assistsB - assistsA;
      }

      const downsA = a.downs || 0;
      const downsB = b.downs || 0;
      return downsA - downsB; // Lower downs first
    });

    const sortedForMochila = [...activePlaying].sort((a, b) => {
      const kdrA = getKDR(a);
      const kdrB = getKDR(b);
      if (kdrA !== kdrB) {
        return kdrA - kdrB;
      }

      const killsA = a.kills || 0;
      const killsB = b.kills || 0;
      if (killsA !== killsB) {
        return killsA - killsB;
      }

      const assistsA = a.assists || 0;
      const assistsB = b.assists || 0;
      if (assistsA !== assistsB) {
        return assistsA - assistsB;
      }

      const downsA = a.downs || 0;
      const downsB = b.downs || 0;
      return downsB - downsA; // Higher downs first
    });

    const firstMvp = sortedForMvp[0];
    const firstMochila = sortedForMochila[0];
    if (
      firstMvp &&
      firstMochila &&
      firstMvp.slot_number !== firstMochila.slot_number
    ) {
      mvpSlot = firstMvp.slot_number;
      mochilaSlot = firstMochila.slot_number;
    }
  }

  const handleStatusChange = async (
    slot: number,
    status: "titular" | "ausente"
  ) => {
    if (!squadId) {
      return;
    }
    const player = activePlayers.find((p) => p.slot_number === slot);
    if (!player) {
      return;
    }

    setLoadingSlot(slot);
    try {
      const { error } = await actions.squad.updateMemberStatus({
        squadId,
        slotNumber: slot,
        status,
        gamertag: player.gamertag,
      });
      if (error) {
        throw error;
      }
      if (setSquadState) {
        // biome-ignore lint/suspicious/noExplicitAny: state updater uses any
        setSquadState((prev: any) => {
          if (!prev) {
            return null;
          }
          return {
            ...prev,
            // biome-ignore lint/suspicious/noExplicitAny: m mapper uses any
            members: prev.members.map((m: any) =>
              m.slot_number === slot ? { ...m, status } : m
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error updating member status in DB:", err);
      notify("error", "Error al cambiar el estado del operador.");
    } finally {
      setLoadingSlot(null);
    }
  };

  const showStatusControls = isOwner && !!squadId;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {activePlayers.map((player) => {
        const isAbsent = player.status === "ausente";
        const isMe = !isAbsent && player.user_id === currentUserId;
        const isSlotLoading = loadingSlot === player.slot_number;
        const hasUser = player.user_id !== null && player.user_id !== undefined;
        const k = player.kills || 0;
        const d = player.downs || 0;
        const a = player.assists || 0;
        const kdr = d > 0 ? k / d : k;

        return (
          <div
            className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ${
              isAbsent
                ? "border-border/40 bg-card/10 opacity-50"
                : "border-border bg-card shadow-xs hover:border-border/80"
            }`}
            key={player.slot_number}
          >
            {/* Loading overlay */}
            {isSlotLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px]">
                <svg
                  aria-label="Cargando"
                  className="h-5 w-5 animate-spin text-primary"
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

            {/* Header info */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  Operador #{player.slot_number}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  {!isAbsent && (
                    <OperatorAvatar
                      avatarSeed={player.avatar_seed}
                      className="h-6 w-6"
                      gamertag={player.gamertag}
                    />
                  )}
                  <h3
                    className={`truncate font-bold text-sm ${isMe ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                  >
                    {isAbsent ? "Ausente" : cleanGamertag(player.gamertag)}{" "}
                    {isMe && "(Tú)"}
                  </h3>
                </div>
                {/* MVP / Mochila Badge */}
                {!isAbsent && player.slot_number === mvpSlot && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 font-bold font-mono text-[9px] text-amber-500 uppercase tracking-wider">
                    🏆 MVP
                  </span>
                )}
                {!isAbsent && player.slot_number === mochilaSlot && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/15 px-2 py-0.5 font-bold font-mono text-[9px] text-red-500 uppercase tracking-wider">
                    🎒 Mochila
                  </span>
                )}
              </div>
              {!isAbsent && (
                <span className="shrink-0 rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary">
                  {player.active_class}
                </span>
              )}
            </div>

            {/* Stats row */}
            {isAbsent ? (
              <div className="mt-4 flex h-[38px] items-center justify-center border-border/40 border-t pt-3">
                <span className="font-light text-muted-foreground text-xs italic">
                  Fuera de servicio
                </span>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-4 gap-2 border-border/40 border-t pt-3 text-center">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase">
                    K
                  </p>
                  <p className="mt-0.5 font-semibold text-foreground text-sm">
                    {k}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase">
                    D
                  </p>
                  <p className="mt-0.5 font-semibold text-foreground text-sm">
                    {d}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase">
                    A
                  </p>
                  <p className="mt-0.5 font-semibold text-foreground text-sm">
                    {a}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase">
                    KDR
                  </p>
                  <p className="mt-0.5 font-semibold text-foreground text-sm">
                    {kdr.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Status toggle buttons (absorbed from SquadRoster) */}
            {showStatusControls && (
              <div className="mt-3 flex items-center gap-1.5 border-border/30 border-t pt-3">
                {hasUser ? (
                  <>
                    <button
                      className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        player.status === "titular"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      disabled={isSlotLoading}
                      onClick={() =>
                        handleStatusChange(player.slot_number, "titular")
                      }
                      type="button"
                    >
                      <UserCheck className="h-3 w-3" />
                      Titular
                    </button>
                    <button
                      className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        player.status === "ausente"
                          ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      disabled={isSlotLoading}
                      onClick={() =>
                        handleStatusChange(player.slot_number, "ausente")
                      }
                      type="button"
                    >
                      <UserMinus className="h-3 w-3" />
                      Ausente
                    </button>
                  </>
                ) : (
                  <span className="w-full rounded border border-border/30 bg-muted/40 px-2 py-1 text-center font-mono text-[10px] text-muted-foreground/60 italic">
                    Slot disponible (Invitación)
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
