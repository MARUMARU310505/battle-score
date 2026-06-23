import { actions } from "astro:actions";
import { Button } from "@/components/ui/button";

interface Member {
  favorite_class: string;
  gamertag: string;
  id: string;
  level: number;
  real_name: string;
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
  onEditClick: () => void;
  onNewSquadClick: () => void;
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
  onEditClick,
  allSquads,
  onNewSquadClick,
  currentUser = null,
}: SquadSidebarProps) {
  const isOwner = squad.owner_id === currentUser?.id;
  const myMember = squad.members.find((m) => m.user_id === currentUser?.id);

  const handleDeleteSquad = async () => {
    // biome-ignore lint/suspicious/noAlert: standard confirm dialog is appropriate for deletion safety
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

  const handleLeaveSquad = async () => {
    if (!myMember) {
      return;
    }
    // biome-ignore lint/suspicious/noAlert: standard confirm dialog is appropriate for action verification
    if (!confirm("¿Estás seguro de que deseas salir de este escuadrón?")) {
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
    <aside className="flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between border-border border-r bg-card p-4 md:w-64">
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
          {squad.members.map((member) => (
            <div
              className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30"
              key={member.id}
            >
              {/* Avatar placeholder */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-bold font-mono text-foreground text-xs uppercase">
                {member.gamertag.slice(0, 2)}
              </div>

              {/* Member Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate font-bold text-foreground text-xs">
                    {member.gamertag}
                  </p>
                  <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    Nivel {member.level}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-light text-[10px] text-muted-foreground">
                  {member.real_name}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary">
                    {CLASS_BADGES[member.favorite_class] ||
                      member.favorite_class}
                  </span>
                  {member.user_id ? (
                    <span className="shrink-0 rounded border border-green-500/20 bg-green-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-green-500 uppercase">
                      Vinculado
                    </span>
                  ) : (
                    <span
                      className="shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-amber-500 uppercase"
                      title="Slot disponible para invitar"
                    >
                      Invitación
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 space-y-2 border-border border-t pt-4">
        {isOwner ? (
          <>
            <Button
              className="w-full"
              onClick={onEditClick}
              size="sm"
              variant="outline"
            >
              Editar Escuadrón
            </Button>
            <Button
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={handleDeleteSquad}
              size="sm"
              variant="ghost"
            >
              Eliminar Escuadrón
            </Button>
          </>
        ) : (
          myMember && (
            <Button
              className="w-full text-destructive hover:bg-destructive/10"
              onClick={handleLeaveSquad}
              size="sm"
              variant="ghost"
            >
              Salir del Escuadrón
            </Button>
          )
        )}
      </div>
    </aside>
  );
}
