import { useState } from "react";
import { SquadSidebar } from "./squad-sidebar";
import { SquadWizard } from "./squad-wizard";

interface Member {
  favorite_class: string;
  gamertag: string;
  id: string;
  level: number;
  real_name: string;
  slot_number: number;
}

interface Squad {
  id: string;
  members: Member[];
  name: string;
}

interface DashboardContentProps {
  squad: Squad | null;
}

export function DashboardContent({ squad }: DashboardContentProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!squad) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8">
        <SquadWizard />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8">
        <SquadWizard
          initialSquad={squad}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background md:flex-row">
      <SquadSidebar onEditClick={() => setIsEditing(true)} squad={squad} />

      {/* Central content area */}
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center justify-center rounded-xl border border-border border-dashed bg-card/20 p-12 text-center">
          <span className="mb-4 text-4xl">🎮</span>
          <h2 className="font-bold text-foreground text-lg">
            Sesión de Juego Activa
          </h2>
          <p className="mt-2 max-w-sm font-light text-muted-foreground text-sm">
            Tu escuadrón está listo. En las siguientes fases podrás iniciar una
            sesión de juego, registrar tus partidas en tiempo real y empezar a
            acumular estadísticas.
          </p>
        </div>
      </main>
    </div>
  );
}
