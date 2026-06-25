import { actions } from "astro:actions";
import { User, UserCheck, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";

export interface ActivePlayer {
  active_class: string;
  assists?: number;
  downs?: number;
  favorite_class: string;
  gamertag: string;
  kills?: number;
  slot_number: number;
  status: "titular" | "reemplazo" | "ausente";
  user_id?: string | null;
}

interface SquadRosterProps {
  activePlayers: ActivePlayer[];
  currentUserId?: string | null;
  isOwner?: boolean;
  onChange: (players: ActivePlayer[]) => void;
  originalMembers: Array<{
    gamertag: string;
    favorite_class: string;
    slot_number: number;
  }>;
  // biome-ignore lint/suspicious/noExplicitAny: React state dispatcher type
  setSquadState?: React.Dispatch<React.SetStateAction<any>>;
  squadId: string;
}

export function SquadRoster({
  activePlayers,
  onChange: _onChange,
  originalMembers,
  isOwner = false,
  currentUserId: _currentUserId = null,
  squadId,
  setSquadState,
}: SquadRosterProps) {
  const [loadingSlot, setLoadingSlot] = useState<number | null>(null);

  // Local state for replacement input fields to avoid keystroke database latency
  const [localGamertags, setLocalGamertags] = useState<Record<number, string>>(
    () => {
      const initial: Record<number, string> = {};
      for (const player of activePlayers) {
        if (player.status === "reemplazo") {
          initial[player.slot_number] = player.gamertag;
        }
      }
      return initial;
    }
  );

  useEffect(() => {
    setLocalGamertags((prev) => {
      const updated = { ...prev };
      for (const player of activePlayers) {
        if (player.status === "reemplazo") {
          updated[player.slot_number] = player.gamertag;
        }
      }
      return updated;
    });
  }, [activePlayers]);

  const handleStatusChange = async (
    slot: number,
    status: "titular" | "reemplazo" | "ausente"
  ) => {
    const original = originalMembers.find((m) => m.slot_number === slot);
    let newGamertag = "";

    const player = activePlayers.find((p) => p.slot_number === slot);
    if (!player) {
      return;
    }

    if (status === "titular" && original) {
      newGamertag = original.gamertag;
    } else if (status === "reemplazo") {
      newGamertag = player.gamertag === "Ausente" ? "" : player.gamertag;
    } else if (status === "ausente") {
      newGamertag = "Ausente";
    }

    setLoadingSlot(slot);
    try {
      const { error } = await actions.squad.updateMemberStatus({
        squadId,
        slotNumber: slot,
        status,
        gamertag: newGamertag,
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
              m.slot_number === slot
                ? { ...m, status, gamertag: newGamertag }
                : m
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error updating member status in DB:", err);
      // biome-ignore lint/suspicious/noAlert: standard alert
      alert("Error al cambiar el estado del operador.");
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleGamertagChange = async (slot: number, gamertag: string) => {
    setLoadingSlot(slot);
    try {
      const { error } = await actions.squad.updateMemberStatus({
        squadId,
        slotNumber: slot,
        status: "reemplazo",
        gamertag,
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
              m.slot_number === slot ? { ...m, gamertag } : m
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error updating replacement gamertag:", err);
    } finally {
      setLoadingSlot(slot);
      setTimeout(() => setLoadingSlot(null), 300); // Small delay to indicate completion
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-foreground text-sm tracking-tight">
          Roster de la Sesión
        </h3>
        <p className="font-light text-muted-foreground text-xs">
          Alineación de operadores para esta sesión de juego
        </p>
      </div>

      <div className="space-y-4">
        {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: legacy mapping function */}
        {activePlayers.map((player) => {
          const isAbsent = player.status === "ausente";
          const isSub = player.status === "reemplazo";
          const isSlotLoading = loadingSlot === player.slot_number;

          return (
            <div
              className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ${
                isAbsent
                  ? "border-border/40 bg-card/10 opacity-70"
                  : "border-border bg-card shadow-xs"
              }`}
              key={player.slot_number}
            >
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

              {/* Operator details & Toggle */}
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="font-medium font-mono text-[10px] text-muted-foreground uppercase">
                    Operador #{player.slot_number}
                  </span>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      {isSub ? (
                        <input
                          className="rounded-md border border-border bg-background px-2 py-0.5 font-normal font-sans text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-75"
                          disabled={!isOwner || isSlotLoading}
                          onBlur={() => {
                            handleGamertagChange(
                              player.slot_number,
                              localGamertags[player.slot_number] || ""
                            );
                          }}
                          onChange={(e) => {
                            setLocalGamertags((prev) => ({
                              ...prev,
                              [player.slot_number]: e.target.value,
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleGamertagChange(
                                player.slot_number,
                                localGamertags[player.slot_number] || ""
                              );
                              e.currentTarget.blur();
                            }
                          }}
                          placeholder="Gamertag Reemplazo"
                          type="text"
                          value={localGamertags[player.slot_number] || ""}
                        />
                      ) : (
                        player.gamertag
                      )}
                    </h4>
                  </div>
                </div>

                {/* Status Toggle buttons */}
                {player.user_id !== null && player.user_id !== undefined ? (
                  <div className="flex items-center gap-1.5 self-start xl:self-center">
                    <button
                      className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        player.status === "titular"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      disabled={!isOwner || isSlotLoading}
                      onClick={() =>
                        handleStatusChange(player.slot_number, "titular")
                      }
                      type="button"
                    >
                      <UserCheck className="h-3 w-3" />
                      Titular
                    </button>
                    <button
                      className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        player.status === "reemplazo"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      disabled={!isOwner || isSlotLoading}
                      onClick={() =>
                        handleStatusChange(player.slot_number, "reemplazo")
                      }
                      type="button"
                    >
                      <User className="h-3 w-3" />
                      Reemplazo
                    </button>
                    <button
                      className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        player.status === "ausente"
                          ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      disabled={!isOwner || isSlotLoading}
                      onClick={() =>
                        handleStatusChange(player.slot_number, "ausente")
                      }
                      type="button"
                    >
                      <UserMinus className="h-3 w-3" />
                      Ausente
                    </button>
                  </div>
                ) : (
                  <span className="shrink-0 rounded border border-border/30 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/60 italic">
                    Slot disponible (Invitación)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
