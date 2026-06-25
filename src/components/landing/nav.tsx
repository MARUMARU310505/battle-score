import { LayoutDashboard, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface NavProps {
  user?: {
    email?: string;
  } | null;
}

export function Nav({ user = null }: NavProps) {
  const handleSignIn = async () => {
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 xl:px-6 xl:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold text-foreground text-xl tracking-tight">
              Battle Score
              <span className="ml-1.5 border-border border-l pl-1.5 font-light font-sans text-muted-foreground text-sm uppercase xl:inline-block hidden">
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
              <span className="hidden text-muted-foreground text-sm xl:inline-block">
                {user.email}
              </span>
              <a
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "h-8 w-8"
                )}
                href="/dashboard"
                title="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
              </a>
              <a
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "h-8 w-8"
                )}
                href="/dashboard/profile"
                title="Editar Perfil"
              >
                <User className="h-4 w-4" />
              </a>
              <a
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-8 w-8 text-muted-foreground hover:text-foreground"
                )}
                href="/api/auth/signout"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <Button onClick={handleSignIn} size="sm">
              <span>Iniciar con Google</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
