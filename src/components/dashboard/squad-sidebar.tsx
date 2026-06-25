import { actions } from "astro:actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  members: Member[];
  name: string;
  owner_id?: string;
}

interface SquadSidebarProps {
  allSquads: Array<{ id: string; name: string }>;
  currentUser?: { id: string; email?: string } | null;
  onNewSquadClick: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: state dispatcher type
  setSquadState?: React.Dispatch<React.SetStateAction<any>>;
  squad: Squad;
}

const CLASS_BADGES: Record<string, string> = {
  Asalto: "🚀 Asalto",
  Soporte: "🛡️ Soporte",
  Recon: "👁️ Recon",
  Ingeniero: "🔧 Ingeniero",
};

export function SquadSidebar({
  squad,
  allSquads,
  onNewSquadClick,
  currentUser = null,
  setSquadState,
}: SquadSidebarProps) {
  const isOwner = squad.owner_id === currentUser?.id;
  const myMember = squad.members.find((m) => m.user_id === currentUser?.id);

  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [editClass, setEditClass] = useState("Asalto");
  const [loadingSlot, setLoadingSlot] = useState<number | null>(null);

  const startEditing = (member: Member) => {
    setEditingSlot(member.slot_number);
    setEditClass(member.favorite_class);
  };

  const handleSaveClass = async (slotNumber: number) => {
    setLoadingSlot(slotNumber);
    try {
      const { error } = await actions.squad.updateMemberClass({
        squadId: squad.id,
        slotNumber,
        favoriteClass: editClass,
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
              m.slot_number === slotNumber
                ? { ...m, favorite_class: editClass }
                : m
            ),
          };
        });
      }
      setEditingSlot(null);
    } catch (err) {
      console.error("Error updating member class:", err);
      // biome-ignore lint/suspicious/noAlert: standard alert
      alert("Error al actualizar el rol del operador.");
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleToggleActive = async (
    slotNumber: number,
    currentActive: boolean
  ) => {
    setLoadingSlot(slotNumber);
    try {
      const { error } = await actions.squad.setIsActive({
        squadId: squad.id,
        slotNumber,
        isActive: !currentActive,
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
              m.slot_number === slotNumber
                ? { ...m, is_active: !currentActive }
                : m
            ),
          };
        });
      }
    } catch (err) {
      console.error("Error toggling active state:", err);
      // biome-ignore lint/suspicious/noAlert: standard alert
      alert("Error al cambiar el estado del operador.");
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleLeaveSquad = async () => {
    if (!myMember) {
      return;
    }
    // biome-ignore lint/suspicious/noAlert: standard confirm
    const confirmed = confirm(
      "¿Estás seguro de que deseas salir de este escuadrón?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.releaseSlot({
        squadId: squad.id,
        slotNumber: myMember.slot_number,
      });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error leaving squad:", err);
      // biome-ignore lint/suspicious/noAlert: alert for user feedback
      alert("Error al salir del escuadrón.");
    }
  };

  return (
    <aside className="flex min-h-0 w-full flex-col justify-between border-border border-r bg-card p-4 xl:min-h-[calc(100vh-4rem)] xl:w-64">
      <div className="space-y-6">
        {/* Squad Selector */}
        <div className="space-y-1.5">
          <label
            className="font-mono font-semibold text-[10px] text-muted-foreground uppercase tracking-wider"
            htmlFor="squad-switcher"
          >
            Escuadrón Activo
          </label>
          <select
            className="w-full cursor-pointer rounded-md border border-border bg-background px-2.5 py-1.5 font-bold text-foreground text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            id="squad-switcher"
            onChange={async (e) => {
              const val = e.target.value;
              if (val === "new") {
                onNewSquadClick();
              } else {
                await actions.squad.setActive({ squadId: val });
                window.location.reload();
              }
            }}
            value={squad.id}
          >
            {allSquads.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option className="font-semibold text-primary" value="new">
              + Crear Escuadrón
            </option>
          </select>
        </div>

        {/* Member list */}
        <div className="space-y-3">
          {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: legacy mapping */}
          {Array.from({ length: 4 }, (_, i) => i + 1).map((slotNumber) => {
            const member = squad.members.find(
              (m) => m.slot_number === slotNumber
            );
            if (!member) {
              return (
                <div
                  className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30"
                  key={`empty-${slotNumber}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border border-dashed bg-muted font-mono text-muted-foreground text-xs uppercase">
                      {slotNumber}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="truncate font-bold text-muted-foreground text-xs italic">
                          Slot disponible
                        </p>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                          Asalto
                        </span>
                        <span className="shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-amber-500 uppercase">
                          Invitación
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const hasUser =
              member.user_id !== null && member.user_id !== undefined;

            const isEditingThisSlot = editingSlot === member.slot_number;

            if (isEditingThisSlot) {
              return (
                <div
                  className="relative space-y-2.5 overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-3"
                  key={member.id}
                >
                  {loadingSlot === member.slot_number && (
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
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[9px] text-primary uppercase">
                      Clase de {member.gamertag}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                      Nivel {member.level}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <select
                      className="w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      onChange={(e) => setEditClass(e.target.value)}
                      value={editClass}
                    >
                      <option value="Asalto">Asalto</option>
                      <option value="Soporte">Soporte</option>
                      <option value="Recon">Recon</option>
                      <option value="Ingeniero">Ingeniero</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      className="cursor-pointer rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingSlot(null)}
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      className="cursor-pointer rounded px-1.5 py-0.5 font-semibold text-[10px] text-primary hover:underline"
                      onClick={() => handleSaveClass(member.slot_number)}
                      type="button"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              );
            }

            const canEdit =
              (isOwner && hasUser) || member.user_id === currentUser?.id;
            const canToggle = isOwner && member.slot_number !== 1 && hasUser;

            let statusBadge: React.ReactNode = null;
            if (!hasUser) {
              statusBadge = (
                <span
                  className="shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-amber-500 uppercase"
                  title="Slot disponible para invitar"
                >
                  Invitación
                </span>
              );
            } else if (member.is_active) {
              statusBadge = (
                <span className="shrink-0 rounded border border-green-500/20 bg-green-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-green-500 uppercase">
                  Activo
                </span>
              );
            } else {
              statusBadge = (
                <span className="shrink-0 rounded border border-border bg-muted px-1 py-0.2 font-mono font-semibold text-[9px] text-muted-foreground uppercase">
                  AFK
                </span>
              );
            }

            return (
              <div
                className="relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30"
                key={member.id}
              >
                {loadingSlot === member.slot_number && (
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
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-bold font-mono text-foreground text-xs uppercase">
                    {member.gamertag.slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`truncate font-bold text-xs ${member.user_id === currentUser?.id ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`}
                      >
                        {member.gamertag}{" "}
                        {member.user_id === currentUser?.id && "(Tú)"}
                      </p>
                      <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        Nivel {member.level}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary">
                        {CLASS_BADGES[member.favorite_class] ||
                          member.favorite_class}
                      </span>
                      {statusBadge}
                    </div>
                  </div>
                </div>

                {(canEdit || canToggle) && (
                  <div className="flex justify-end gap-2 border-border/40 border-t pt-2">
                    {canEdit && (
                      <button
                        className="cursor-pointer font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => startEditing(member)}
                        type="button"
                      >
                        Editar Rol
                      </button>
                    )}
                    {canToggle && (
                      <button
                        className={`cursor-pointer font-mono text-[10px] transition-colors ${
                          member.is_active
                            ? "text-destructive transition-colors hover:text-destructive/80"
                            : "text-green-500 transition-colors hover:text-green-400"
                        }`}
                        onClick={() =>
                          handleToggleActive(
                            member.slot_number,
                            member.is_active
                          )
                        }
                        type="button"
                      >
                        {member.is_active ? "Desactivar" : "Activar"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      {!isOwner && myMember && (
        <div className="mt-6 space-y-2 border-border border-t pt-4">
          <Button
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={handleLeaveSquad}
            size="sm"
            variant="ghost"
          >
            Salir del Escuadrón
          </Button>
        </div>
      )}
    </aside>
  );
}
