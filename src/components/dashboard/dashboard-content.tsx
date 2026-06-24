import { actions } from "astro:actions";
import { BarChart3, Check, Copy, HelpCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MainTabs, type TabType } from "./main-tabs";
import { SessionPanel } from "./session-panel";
import type { ActivePlayer } from "./squad-roster";
import { SquadSidebar } from "./squad-sidebar";
import { SquadWizard } from "./squad-wizard";

interface Member {
  favorite_class: string;
  gamertag: string;
  id: string;
  is_active: boolean;
  level: number;
  slot_number: number;
  user_id?: string | null;
}

interface Squad {
  id: string;
  invite_code?: string;
  members: Member[];
  name: string;
  owner_id?: string;
}

interface Session {
  created_at: string;
  id: string;
  name: string;
  squad_id: string;
}

export interface PlayerMatchStats {
  active_class: string;
  assists: number;
  created_at: string;
  downs: number;
  end_game: boolean;
  gamertag: string;
  id: string;
  kills: number;
  match_id: string;
  mental_state: number;
  respawned: boolean;
  revives: number;
  user_id?: string | null;
}

export interface Match {
  created_at: string;
  elimination_cause: string;
  hostility: string;
  id: string;
  loot: string;
  placement: number;
  player_match_stats: PlayerMatchStats[];
  poi: string;
  session_id: string;
}

interface DashboardContentProps {
  activeSession: Session | null;
  allSquads: Array<{ id: string; name: string }>;
  currentUser?: { id: string; email?: string } | null;
  profile?: { gamertag: string; level: number } | null;
  sessionMatches?: Match[];
  squad: Squad | null;
}

export function DashboardContent({
  squad,
  activeSession,
  sessionMatches = [],
  allSquads,
  currentUser = null,
  profile = null,
}: DashboardContentProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("active-session");
  const [copiedCode, setCopiedCode] = useState(false);
  const [squadName, setSquadName] = useState(squad?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(() => {
    if (!squad) {
      return [];
    }
    return squad.members.map((member) => {
      const hasUser = member.user_id !== null && member.user_id !== undefined;

      let kills = 0;
      let downs = 0;
      let assists = 0;

      for (const match of sessionMatches) {
        const stats = match.player_match_stats?.find(
          (p) => p.gamertag === member.gamertag
        );
        if (stats) {
          kills += stats.kills || 0;
          downs += stats.downs || 0;
          assists += stats.assists || 0;
        }
      }

      return {
        slot_number: member.slot_number,
        status: hasUser && member.is_active ? "titular" : "ausente",
        gamertag: member.gamertag,
        favorite_class: member.favorite_class,
        active_class: member.favorite_class,
        user_id: member.user_id,
        kills,
        downs,
        assists,
      };
    });
  });

  const isOwner = squad?.owner_id === currentUser?.id;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDeleteSquad = async () => {
    // biome-ignore lint/suspicious/noAlert: standard confirm
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este escuadrón? Esta acción es irreversible."
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.delete({ squadId: squad.id });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error deleting squad:", err);
      // biome-ignore lint/suspicious/noAlert: alert for user feedback
      alert("Error al eliminar el escuadrón.");
    }
  };

  if (!squad || isCreatingNew) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8">
        <SquadWizard
          onCancel={squad ? () => setIsCreatingNew(false) : undefined}
          profile={profile}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background md:flex-row">
      <SquadSidebar
        allSquads={allSquads}
        currentUser={currentUser}
        onNewSquadClick={() => setIsCreatingNew(true)}
        squad={squad}
      />

      {/* Central content area with tab navigation */}
      <div className="flex flex-1 flex-col">
        <MainTabs
          activeTab={activeTab}
          isOwner={isOwner}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 p-6 md:p-8">
          {activeTab === "active-session" && (
            <SessionPanel
              activePlayers={activePlayers}
              initialSession={activeSession}
              isOwner={isOwner}
              sessionMatches={sessionMatches}
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

          {activeTab === "settings" && isOwner && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-6 flex items-center gap-2 border-border border-b pb-4 font-bold text-foreground text-sm tracking-tight">
                Ajustes del Escuadrón
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Invite Code card */}
                <div className="space-y-4 rounded-lg border border-border bg-background p-5">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      Código de Invitación
                    </h4>
                    <p className="mt-1 font-light text-muted-foreground text-xs leading-relaxed">
                      Comparte este código con tus compañeros de equipo para que
                      puedan unirse a la escuadra y reclamar sus operadores.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/40 px-3.5 py-2.5">
                    <span className="font-bold font-mono text-foreground text-lg tracking-wider">
                      {squad.invite_code || "BS-PENDIENTE"}
                    </span>

                    {squad.invite_code && (
                      <Button
                        className="flex h-8 items-center gap-1.5 text-xs"
                        onClick={() => handleCopyCode(squad.invite_code || "")}
                        size="sm"
                        variant="outline"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Squad Info card */}
                <form
                  className="space-y-4 rounded-lg border border-border bg-background p-5"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setNameError(null);
                    if (!squad) {
                      return;
                    }
                    if (squadName.trim().length < 3) {
                      setNameError(
                        "El nombre debe tener al menos 3 caracteres."
                      );
                      return;
                    }
                    try {
                      setIsSavingName(true);
                      const { error } = await actions.squad.update({
                        squadId: squad.id,
                        name: squadName.trim(),
                      });
                      if (error) {
                        throw error;
                      }
                      window.location.reload();
                    } catch (err) {
                      console.error("Error updating squad name:", err);
                      setNameError(
                        "Error al actualizar el nombre del escuadrón."
                      );
                    } finally {
                      setIsSavingName(false);
                    }
                  }}
                >
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      Nombre del Escuadrón
                    </h4>
                    <p className="mt-1 font-light text-muted-foreground text-xs leading-relaxed">
                      Puedes modificar el nombre que identifica a tu escuadrón
                      directamente aquí.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-75"
                      disabled={isSavingName}
                      onChange={(e) => setSquadName(e.target.value)}
                      type="text"
                      value={squadName}
                    />
                    {nameError && (
                      <p className="mt-1 font-light text-destructive text-xs">
                        {nameError}
                      </p>
                    )}
                    <Button
                      className="mt-2 self-start"
                      disabled={
                        isSavingName || squadName.trim() === (squad?.name || "")
                      }
                      size="sm"
                      type="submit"
                    >
                      {isSavingName ? "Guardando..." : "Guardar Nombre"}
                    </Button>
                  </div>
                </form>

                {/* Danger Zone card */}
                <div className="space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5 md:col-span-2">
                  <div>
                    <h4 className="font-semibold text-destructive text-sm">
                      Zona de Peligro
                    </h4>
                    <p className="mt-1 font-light text-muted-foreground text-xs leading-relaxed">
                      Una vez que elimines el escuadrón, no podrás recuperar sus
                      datos ni el historial de sesiones asociadas. Todos los
                      slots e integrantes serán desvinculados permanentemente.
                    </p>
                  </div>

                  <Button
                    className="border border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={handleDeleteSquad}
                    size="sm"
                    variant="ghost"
                  >
                    Eliminar Escuadrón
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
