import { actions } from "astro:actions";
import { BarChart3, Check, Copy, HelpCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { MainTabs, type TabType } from "./main-tabs";
import { SessionPanel } from "./session-panel";
import { SessionsHistory } from "./sessions-history";
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
  status: "titular" | "ausente";
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
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("active-session");
  const [copiedCode, setCopiedCode] = useState(false);
  const [squadName, setSquadName] = useState(squad?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Real-time synchronization states
  const [squadState, setSquadState] = useState(squad);
  const [session, setSession] = useState(activeSession);
  const [matches, setMatches] = useState(sessionMatches);

  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(() => {
    if (!squad) {
      return [];
    }
    const players: ActivePlayer[] = [];
    for (let slot = 1; slot <= 4; slot++) {
      const member = squad.members.find((m) => m.slot_number === slot);
      if (member) {
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

        players.push({
          slot_number: member.slot_number,
          status:
            member.status ||
            (hasUser && member.is_active ? "titular" : "ausente"),
          gamertag: member.gamertag,
          favorite_class: member.favorite_class,
          active_class: member.favorite_class,
          user_id: member.user_id,
          kills,
          downs,
          assists,
        });
      } else {
        players.push({
          slot_number: slot,
          status: "ausente",
          gamertag: "Invitado",
          favorite_class: "Asalto",
          active_class: "Asalto",
          user_id: null,
          kills: 0,
          downs: 0,
          assists: 0,
        });
      }
    }
    return players;
  });

  // Recalculate and update roster player statistics when squadState or matches change
  useEffect(() => {
    if (!squadState) {
      return;
    }
    setActivePlayers(() => {
      const players: ActivePlayer[] = [];
      for (let slot = 1; slot <= 4; slot++) {
        const member = squadState.members.find((m) => m.slot_number === slot);
        if (member) {
          const hasUser =
            member.user_id !== null && member.user_id !== undefined;

          let kills = 0;
          let downs = 0;
          let assists = 0;

          for (const match of matches) {
            const stats = match.player_match_stats?.find(
              (p) => p.gamertag === member.gamertag
            );
            if (stats) {
              kills += stats.kills || 0;
              downs += stats.downs || 0;
              assists += stats.assists || 0;
            }
          }

          players.push({
            slot_number: member.slot_number,
            status:
              member.status ||
              (hasUser && member.is_active ? "titular" : "ausente"),
            gamertag: member.gamertag,
            favorite_class: member.favorite_class,
            active_class: member.favorite_class,
            user_id: member.user_id,
            kills,
            downs,
            assists,
          });
        } else {
          players.push({
            slot_number: slot,
            status: "ausente",
            gamertag: "Invitado",
            favorite_class: "Asalto",
            active_class: "Asalto",
            user_id: null,
            kills: 0,
            downs: 0,
            assists: 0,
          });
        }
      }
      return players;
    });
  }, [squadState, matches]);

  // Real-time channel listener for Sessions
  useEffect(() => {
    if (!squadState) {
      return;
    }

    const sessionsChannel = supabase
      .channel("sessions_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_sessions",
          filter: `squad_id=eq.${squadState.id}`,
        },
        async () => {
          const { data: activeSessionData } = await actions.session.getActive({
            squadId: squadState.id,
          });
          setSession(activeSessionData || null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: realtime listener only needs squadState.id
  }, [squadState?.id, supabase, squadState]);

  // Real-time channel listener for Matches and Player Stats
  useEffect(() => {
    if (!session?.id) {
      setMatches([]);
      return;
    }

    const fetchLatestMatches = async () => {
      const { data: matchesData } = await actions.match.list({
        sessionId: session.id,
      });
      setMatches(matchesData || []);
    };

    const matchesChannel = supabase
      .channel("matches_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `session_id=eq.${session.id}`,
        },
        () => {
          fetchLatestMatches();
        }
      )
      .subscribe();

    const statsChannel = supabase
      .channel("stats_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_match_stats",
        },
        () => {
          fetchLatestMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(statsChannel);
    };
  }, [session?.id, supabase]);

  // Real-time channel listener for Squad Members
  useEffect(() => {
    if (!squadState) {
      return;
    }

    const membersChannel = supabase
      .channel("members_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "squad_members",
          filter: `squad_id=eq.${squadState.id}`,
        },
        async () => {
          const { data: squadData } = await actions.squad.get();
          if (squadData?.activeSquad) {
            setSquadState(squadData.activeSquad);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(membersChannel);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: realtime listener only needs squadState.id
  }, [squadState?.id, supabase, squadState]);

  const isOwner = !!(
    currentUser?.id &&
    squadState?.owner_id &&
    squadState.owner_id === currentUser.id
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDeleteSquad = async () => {
    if (!squadState) {
      return;
    }
    // biome-ignore lint/suspicious/noAlert: standard confirm
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este escuadrón? Esta acción es irreversible."
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.delete({ squadId: squadState.id });
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

  if (!squadState || isCreatingNew) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8">
        <SquadWizard
          onCancel={squadState ? () => setIsCreatingNew(false) : undefined}
          profile={profile}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background xl:flex-row">
      <SquadSidebar
        allSquads={allSquads}
        currentUser={currentUser}
        onNewSquadClick={() => setIsCreatingNew(true)}
        setSquadState={setSquadState}
        squad={squadState}
      />

      {/* Central content area with tab navigation */}
      <div className="flex flex-1 flex-col">
        <MainTabs
          activeTab={activeTab}
          isOwner={isOwner}
          onTabChange={setActiveTab}
        />

        <main className="flex-1 p-6 pb-16 xl:p-8">
          {activeTab === "active-session" && (
            <SessionPanel
              activePlayers={activePlayers}
              currentUser={currentUser}
              initialSession={session}
              isOwner={isOwner}
              sessionMatches={matches}
              setActivePlayers={setActivePlayers}
              setSession={setSession}
              setSquadState={setSquadState}
              squad={squadState}
            />
          )}

          {activeTab === "history" && (
            <SessionsHistory
              currentUserId={currentUser?.id}
              squadId={squadState.id}
            />
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

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
                      {squadState.invite_code || "BS-PENDIENTE"}
                    </span>

                    {squadState.invite_code && (
                      <Button
                        className="flex h-auto items-center gap-1.5 px-3 py-1.5 text-xs"
                        onClick={() =>
                          handleCopyCode(squadState.invite_code || "")
                        }
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
                      setSquadState((prev) =>
                        prev ? { ...prev, name: squadName.trim() } : null
                      );
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
                      className="mt-2 h-auto self-start px-4 py-2"
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
                <div className="space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5 xl:col-span-2">
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
                    className="h-auto border border-destructive/20 px-4 py-2 text-destructive hover:bg-destructive/10"
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
