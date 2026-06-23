import { BarChart3, HelpCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { MainTabs, type TabType } from "./main-tabs";
import { SessionPanel } from "./session-panel";
import type { ActivePlayer } from "./squad-roster";
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

interface Session {
  created_at: string;
  id: string;
  name: string;
  squad_id: string;
}

interface DashboardContentProps {
  activeSession: Session | null;
  allSquads: Array<{ id: string; name: string }>;
  squad: Squad | null;
}

export function DashboardContent({
  squad,
  activeSession,
  allSquads,
}: DashboardContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("active-session");
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(() => {
    if (!squad) {
      return [];
    }
    return squad.members.map((member) => ({
      slot_number: member.slot_number,
      status: "titular",
      gamertag: member.gamertag,
      real_name: member.real_name,
      favorite_class: member.favorite_class,
      active_class: member.favorite_class,
    }));
  });

  if (!squad || isCreatingNew) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8">
        <SquadWizard
          onCancel={squad ? () => setIsCreatingNew(false) : undefined}
        />
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
      <SquadSidebar
        allSquads={allSquads}
        onEditClick={() => setIsEditing(true)}
        onNewSquadClick={() => setIsCreatingNew(true)}
        squad={squad}
      />

      {/* Central content area with tab navigation */}
      <div className="flex flex-1 flex-col">
        <MainTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6 md:p-8">
          {activeTab === "active-session" && (
            <SessionPanel
              activePlayers={activePlayers}
              initialSession={activeSession}
              setActivePlayers={setActivePlayers}
              squad={squad}
            />
          )}

          {activeTab === "history" && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-bold text-foreground text-sm tracking-tight">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                Sesiones Anteriores
              </h3>
              <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
                <span className="mb-4 text-3xl">📅</span>
                <h4 className="font-semibold text-foreground text-sm">
                  Historial Cerrado
                </h4>
                <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
                  En la Fase 7 se habilitará el desglose completo del historial,
                  donde podrás consultar todas las sesiones finalizadas, sus
                  métricas acumuladas y las partidas jugadas.
                </p>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-bold text-foreground text-sm tracking-tight">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Estadísticas Globales
              </h3>
              <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
                <span className="mb-4 text-3xl">📈</span>
                <h4 className="font-semibold text-foreground text-sm">
                  Análisis de Rendimiento
                </h4>
                <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
                  Los gráficos de K/D, mapas más jugados, tasa de victorias y
                  estadísticas acumuladas por clase se desbloquearán en la Fase
                  8 con datos reales.
                </p>
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-bold text-foreground text-sm tracking-tight">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                Recomendaciones del Coach
              </h3>
              <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center">
                <span className="mb-4 text-3xl">💡</span>
                <h4 className="font-semibold text-foreground text-sm">
                  Sugerencias Tácticas
                </h4>
                <p className="mt-2 max-w-sm font-light text-muted-foreground text-xs">
                  El Coach de Fatiga y las recomendaciones automáticas de
                  composición de escuadrón y rotaciones de mapas se activarán en
                  la Fase 8.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
