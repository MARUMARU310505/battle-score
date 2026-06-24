import { User, UserCheck, UserMinus } from "lucide-react";

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

const CLASSES = ["Asalto", "Soporte", "Recon", "Ingeniero"];

interface SquadRosterProps {
  activePlayers: ActivePlayer[];
  disabled?: boolean;
  onChange: (players: ActivePlayer[]) => void;
  originalMembers: Array<{
    gamertag: string;
    favorite_class: string;
    slot_number: number;
  }>;
}

export function SquadRoster({
  activePlayers,
  onChange,
  originalMembers,
  disabled = false,
}: SquadRosterProps) {
  const handleStatusChange = (
    slot: number,
    status: "titular" | "reemplazo" | "ausente"
  ) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }

      const original = originalMembers.find((m) => m.slot_number === slot);
      let newGamertag = player.gamertag;

      if (status === "titular" && original) {
        newGamertag = original.gamertag;
      } else if (status === "reemplazo") {
        newGamertag = "";
      } else if (status === "ausente") {
        newGamertag = "Ausente";
      }

      return {
        ...player,
        status,
        gamertag: newGamertag,
      };
    });

    onChange(updated);
  };

  const handleGamertagChange = (slot: number, gamertag: string) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }
      return { ...player, gamertag };
    });
    onChange(updated);
  };

  const handleClassChange = (slot: number, active_class: string) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }
      return { ...player, active_class };
    });
    onChange(updated);
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
        {activePlayers.map((player) => {
          const isAbsent = player.status === "ausente";
          const isSub = player.status === "reemplazo";

          return (
            <div
              className={`rounded-lg border p-4 transition-all duration-200 ${
                isAbsent
                  ? "border-border/40 bg-card/10 opacity-70"
                  : "border-border bg-card shadow-xs"
              }`}
              key={player.slot_number}
            >
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
                          disabled={disabled}
                          onChange={(e) =>
                            handleGamertagChange(
                              player.slot_number,
                              e.target.value
                            )
                          }
                          placeholder="Gamertag Reemplazo"
                          type="text"
                          value={player.gamertag}
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
                      disabled={disabled}
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
                      disabled={disabled}
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
                      disabled={disabled}
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

              {/* Class Selection */}
              {!isAbsent &&
                player.user_id !== null &&
                player.user_id !== undefined && (
                  <div className="mt-3 border-border/40 border-t pt-3">
                    <div className="flex items-center gap-3">
                      <label
                        className="font-medium text-muted-foreground text-xs"
                        htmlFor={`class-select-${player.slot_number}`}
                      >
                        Clase en Sesión:
                      </label>
                      <select
                        className="rounded-md border border-border bg-background px-2 py-1 font-sans text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
                        disabled={disabled}
                        id={`class-select-${player.slot_number}`}
                        onChange={(e) =>
                          handleClassChange(player.slot_number, e.target.value)
                        }
                        value={player.active_class}
                      >
                        {CLASSES.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
