import { actions } from "astro:actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import POIS from "@/data/pois.json";
import type { ActivePlayer } from "./squad-roster";

interface PlayerStatInput {
  activeClass: string;
  assists: number;
  downs: number;
  endGame: boolean;
  gamertag: string;
  kills: number;
  mentalState: number;
  respawned: boolean;
  revives: number;
  userId?: string | null;
}

interface MatchFormProps {
  activePlayers: ActivePlayer[];
  onCancel: () => void;
  onSuccess: () => void;
  sessionId: string;
}



export function MatchForm({
  sessionId,
  activePlayers,
  onCancel,
  onSuccess,
}: MatchFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out absent players for the stats registration
  const playingMembers = activePlayers.filter((p) => p.status !== "ausente");

  // Step 1: Match General Info State
  const [poi, setPoi] = useState("Desconocido");
  const [placement, setPlacement] = useState(1);
  const [hostility, setHostility] = useState<"Baja" | "Media" | "Alta">(
    "Media"
  );
  const [loot, setLoot] = useState<"Malo" | "Normal" | "Excelente">("Normal");
  const [eliminationCause, setEliminationCause] = useState("Ninguna");

  // Step 2: Individual Player Stats State
  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>(() =>
    playingMembers.map((p) => ({
      userId: p.user_id,
      gamertag: p.gamertag,
      activeClass: p.active_class,
      downs: 0,
      kills: 0,
      assists: 0,
      revives: 0,
      respawned: false,
      endGame: false,
      mentalState: 3,
    }))
  );

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
      };
      return updated;
    });
  };

  const handleNext = () => {
    if (placement < 1) {
      setError("La posición debe ser mayor o igual a 1.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: actionError } = await actions.match.create({
        sessionId,
        poi,
        placement,
        hostility,
        loot,
        eliminationCause: placement === 1 ? "Victoria" : eliminationCause,
        playerStats,
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
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-border/40 border-b pb-4">
        <div>
          <h3 className="font-bold text-foreground text-sm tracking-tight">
            Registrar Partida
          </h3>
          <p className="font-light text-muted-foreground text-xs">
            {step === 1
              ? "Paso 1: Información General"
              : "Paso 2: Estadísticas de Operadores"}
          </p>
        </div>
        <span className="font-mono text-muted-foreground text-xs">
          Paso {step} de 2
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs">
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-poi"
              >
                Punto de Caída (POI)
              </label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                id="match-poi"
                onChange={(e) => setPoi(e.target.value)}
                value={poi}
              >
                {POIS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1 block font-medium text-muted-foreground text-xs"
                htmlFor="match-placement"
              >
                Posición / Colocación
              </label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                id="match-placement"
                min="1"
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value, 10) || 1;
                  setPlacement(val);
                  if (val === 1) {
                    setEliminationCause("Ninguna");
                  }
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
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                id="match-hostility"
                onChange={(e) =>
                  setHostility(e.target.value as "Baja" | "Media" | "Alta")
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
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                id="match-loot"
                onChange={(e) =>
                  setLoot(e.target.value as "Malo" | "Normal" | "Excelente")
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
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                disabled={placement === 1}
                id="match-cause"
                onChange={(e) => setEliminationCause(e.target.value)}
                placeholder={
                  placement === 1
                    ? "Ninguna (Victoria)"
                    : "Ej. Flanqueo, Sniper, etc."
                }
                type="text"
                value={placement === 1 ? "Ninguna" : eliminationCause}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-border/40 border-t pt-4">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleNext} type="button">
              Siguiente Paso
            </Button>
          </div>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-1">
            {playerStats.map((stat, idx) => (
              <div
                className="space-y-3 rounded-lg border border-border/60 bg-background/50 p-4"
                key={stat.gamertag}
              >
                <div className="flex items-center justify-between border-border/40 border-b pb-2">
                  <span className="font-bold text-foreground text-xs">
                    {stat.gamertag}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                    {stat.activeClass}
                  </span>
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
                      className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      id={`kills-${stat.gamertag}`}
                      min="0"
                      onChange={(e) =>
                        handleStatChange(
                          idx,
                          "kills",
                          Number.parseInt(e.target.value, 10) || 0
                        )
                      }
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
                      className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      id={`downs-${stat.gamertag}`}
                      min="0"
                      onChange={(e) =>
                        handleStatChange(
                          idx,
                          "downs",
                          Number.parseInt(e.target.value, 10) || 0
                        )
                      }
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
                      className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      id={`assists-${stat.gamertag}`}
                      min="0"
                      onChange={(e) =>
                        handleStatChange(
                          idx,
                          "assists",
                          Number.parseInt(e.target.value, 10) || 0
                        )
                      }
                      type="number"
                      value={stat.assists}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-0.5 block text-[10px] text-muted-foreground"
                      htmlFor={`revives-${stat.gamertag}`}
                    >
                      Revivir (R)
                    </label>
                    <input
                      className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      id={`revives-${stat.gamertag}`}
                      min="0"
                      onChange={(e) =>
                        handleStatChange(
                          idx,
                          "revives",
                          Number.parseInt(e.target.value, 10) || 0
                        )
                      }
                      type="number"
                      value={stat.revives}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-end">
                  <div className="flex flex-wrap gap-4 py-1">
                    <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground">
                      <input
                        checked={stat.respawned}
                        className="rounded border-border bg-background text-primary focus:ring-primary"
                        onChange={(e) =>
                          handleStatChange(idx, "respawned", e.target.checked)
                        }
                        type="checkbox"
                      />
                      ¿Redesplegado?
                    </label>
                    <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground">
                      <input
                        checked={stat.endGame}
                        className="rounded border-border bg-background text-primary focus:ring-primary"
                        onChange={(e) =>
                          handleStatChange(idx, "endGame", e.target.checked)
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
                            className={`flex-1 cursor-pointer rounded border py-1 text-center font-mono text-[9px] transition-all ${
                              isActive ? activeColor : colors[lvl - 1]
                            }`}
                            key={lvl}
                            onClick={() =>
                              handleStatChange(idx, "mentalState", lvl)
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
            ))}
          </div>

          <div className="flex justify-between border-border/40 border-t pt-4">
            <Button onClick={() => setStep(1)} type="button" variant="outline">
              Atrás
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : "Guardar Partida"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
