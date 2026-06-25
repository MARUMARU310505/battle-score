import type { ActivePlayer } from "./squad-roster";
import { cleanGamertag, OperatorAvatar } from "./squad-sidebar";

interface SquadHeaderProps {
  activePlayers: ActivePlayer[];
  currentUserId?: string | null;
}

export function SquadHeader({
  activePlayers,
  currentUserId = null,
}: SquadHeaderProps) {
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

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
      {activePlayers.map((player) => {
        const isAbsent = player.status === "ausente";
        const isMe = !isAbsent && player.user_id === currentUserId;
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
                <div className="mt-0.5 flex items-center gap-2">
                  {!isAbsent && (
                    <OperatorAvatar
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
          </div>
        );
      })}
    </div>
  );
}
