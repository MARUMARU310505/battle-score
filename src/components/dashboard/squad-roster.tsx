import { actions } from "astro:actions";
import { UserCheck, UserMinus } from "lucide-react";
import { useState } from "react";

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
  originalMembers: _originalMembers,
  isOwner = false,
  currentUserId: _currentUserId = null,
  squadId,
  setSquadState,
}: SquadRosterProps) {
  const [loadingSlot, setLoadingSlot] = useState<number | null>(null);

  const handleStatusChange = async (
    slot: number,
    status: "titular" | "ausente"
  ) => {
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
      // biome-ignore lint/suspicious/noAlert: standard alert
      alert("Error al cambiar el estado del operador.");
    } finally {
      setLoadingSlot(null);
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
                      {player.gamertag}
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
