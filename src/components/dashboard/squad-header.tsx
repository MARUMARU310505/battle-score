import type { ActivePlayer } from "./squad-roster";

interface SquadHeaderProps {
  activePlayers: ActivePlayer[];
}

export function SquadHeader({ activePlayers }: SquadHeaderProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:grid-cols-4">
      {activePlayers.map((player) => {
        const isAbsent = player.status === "ausente";
        const k = player.kills || 0;
        const d = player.downs || 0;
        const a = player.assists || 0;
        const kdr = d > 0 ? k / d : k;

        return (
          <div
            className={`rounded-lg border p-4 transition-all duration-200 ${
              isAbsent
                ? "border-border/40 bg-card/10 opacity-50"
                : "border-border bg-card shadow-xs hover:border-border/80"
            }`}
            key={player.slot_number}
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  Operador #{player.slot_number}
                </p>
                <h3 className="mt-0.5 truncate font-bold text-foreground text-sm">
                  {isAbsent ? "Ausente" : player.gamertag}
                </h3>
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
          </div>
        );
      })}
    </div>
  );
}
