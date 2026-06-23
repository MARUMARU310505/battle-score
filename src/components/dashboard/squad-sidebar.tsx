import { Button } from "@/components/ui/button";

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

interface SquadSidebarProps {
  onEditClick: () => void;
  squad: Squad;
}

const CLASS_BADGES: Record<string, string> = {
  Asalto: "🚀 Asalto",
  Soporte: "🛡️ Soporte",
  Recon: "👁️ Recon",
  Ingeniero: "🔧 Ingeniero",
};

export function SquadSidebar({ squad, onEditClick }: SquadSidebarProps) {
  return (
    <aside className="flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between border-border border-r bg-card p-4 md:w-64">
      <div className="space-y-6">
        {/* Squad Title */}
        <div>
          <h2 className="font-mono font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Escuadrón
          </h2>
          <h1 className="mt-1 truncate font-bold text-foreground text-lg">
            {squad.name}
          </h1>
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
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary">
                    {CLASS_BADGES[member.favorite_class] ||
                      member.favorite_class}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit squad button */}
      <div className="mt-6 border-border border-t pt-4">
        <Button
          className="w-full"
          onClick={onEditClick}
          size="sm"
          variant="outline"
        >
          Editar Escuadrón
        </Button>
      </div>
    </aside>
  );
}
