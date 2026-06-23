import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface NavProps {
  user?: {
    email: string;
  } | null;
}

export function Nav({ user = null }: NavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold text-foreground text-xl tracking-tight">
              REDSEC
              <span className="ml-1.5 border-border border-l pl-1.5 font-light font-sans text-muted-foreground text-sm uppercase">
                BR Analytics
              </span>
            </span>
          </a>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-muted-foreground text-sm md:inline-block">
                {user.email}
              </span>
              <Button asChild size="sm" variant="outline">
                <a href="/dashboard">Dashboard</a>
              </Button>
            </div>
          ) : (
            <Button size="sm">
              <span>Iniciar con Google</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
