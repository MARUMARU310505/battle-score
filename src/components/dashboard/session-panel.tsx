import { actions } from "astro:actions";
import { Calendar, Play, Power } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
}

interface SessionPanelProps {
  activePlayers: ActivePlayer[];
  initialSession: Session | null;
  setActivePlayers: (players: ActivePlayer[]) => void;
  squad: Squad;
}

export function SessionPanel({
  squad,
  initialSession,
  activePlayers,
  setActivePlayers,
}: SessionPanelProps) {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    return (
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
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
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
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
        <Button
          className="flex items-center gap-1.5"
          disabled={loading}
          onClick={handleCloseSession}
          size="sm"
          variant="destructive"
        >
          <Power className="h-4 w-4" />
          {loading ? "Cerrando..." : "Finalizar Sesión"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-xs">
          {error}
        </div>
      )}

      {/* Roster stats header */}
      <SquadHeader activePlayers={activePlayers} />

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Squad Roster configuration */}
        <div className="md:col-span-1">
          <SquadRoster
            activePlayers={activePlayers}
            onChange={setActivePlayers}
            originalMembers={squad.members}
          />
        </div>

        {/* Right Column: Match registration placeholder */}
        <div className="space-y-4 md:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-bold text-foreground text-sm tracking-tight">
              Partidas de la Sesión
            </h3>
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
              <span className="mb-4 text-3xl">⚔️</span>
              <h4 className="font-semibold text-foreground text-sm">
                Registro de Partidas Diferido
              </h4>
              <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
                En la Fase 6 podrás registrar tus partidas ronda por ronda,
                especificando estadísticas de cada jugador, drops, POIs y
                rendimiento táctico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
