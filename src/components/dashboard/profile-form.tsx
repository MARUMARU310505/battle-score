import { actions } from "astro:actions";
import { AlertCircle, Award, Loader2, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Profile {
  favorite_class: string;
  gamertag: string;
  level: number;
}

interface ProfileFormProps {
  initialProfile: Profile | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const initialGamertagValue = initialProfile?.gamertag
    ? initialProfile.gamertag.split("||")[0]
    : "";
  const initialSeedValue = initialProfile?.gamertag?.includes("||")
    ? initialProfile.gamertag.split("||")[1]
    : initialGamertagValue;

  const [gamertag, setGamertag] = useState(initialGamertagValue);
  const [avatarSeed, setAvatarSeed] = useState(initialSeedValue);
  const [level, setLevel] = useState<number>(initialProfile?.level || 1);
  const [favoriteClass, setFavoriteClass] = useState(
    initialProfile?.favorite_class || "Asalto"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 9);
    setAvatarSeed(randomSeed);
  };

  const isNew = !initialProfile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!gamertag.trim()) {
      setError("El Gamertag es requerido.");
      return;
    }

    if (level < 1) {
      setError("El nivel debe ser mayor o igual a 1.");
      return;
    }

    setLoading(true);
    try {
      const fullGamertag =
        gamertag.trim() + "||" + (avatarSeed || gamertag).trim();
      const { error: actionError } = await actions.profile.save({
        gamertag: fullGamertag,
        level,
        favoriteClass,
      });

      if (actionError) {
        throw new Error(actionError.message || "Error al guardar el perfil");
      }

      setSuccess(true);

      // Delay redirection slightly so the user sees the success state
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al guardar tu perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg backdrop-blur-md">
        <div className="space-y-6 p-6 xl:p-8">
          <div className="space-y-2 text-center">
            <h1 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text font-bold text-2xl text-transparent tracking-tight xl:text-3xl">
              {isNew ? "Configura tu Perfil" : "Editar Perfil"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isNew
                ? "Antes de ingresar al panel de control de Battle Score, configura tus datos globales de operador."
                : "Actualiza tus datos globales de operador. Los cambios se propagarán a todos tus escuadrones."}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-xs transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card shadow-lg">
                {(avatarSeed || gamertag).trim() ? (
                  <img
                    alt="Avatar Live Preview"
                    className="h-full w-full rounded-full bg-muted object-cover"
                    height={80}
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent((avatarSeed || gamertag).trim())}`}
                    width={80}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted font-bold font-mono text-foreground text-lg uppercase">
                    ?
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Vista previa del avatar
              </span>
              <Button
                className="flex h-8 items-center gap-1.5 border-border/80 bg-background/50 px-3 font-semibold text-xs tracking-wide transition-all duration-200 hover:bg-muted"
                onClick={handleRandomizeAvatar}
                type="button"
                variant="outline"
              >
                <span>🎲 Cambiar Avatar</span>
              </Button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex animate-shake items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex animate-pulse items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-500 text-sm">
                <span>¡Perfil guardado con éxito! Redirigiendo...</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
                htmlFor="gamertag"
              >
                Gamertag / Usuario
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                </span>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading || success}
                  id="gamertag"
                  onChange={(e) => setGamertag(e.target.value)}
                  placeholder="Ej. Ghost_123"
                  required
                  type="text"
                  value={gamertag}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
                htmlFor="level"
              >
                Nivel de Jugador
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Award className="h-4 w-4" />
                </span>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading || success}
                  id="level"
                  min="1"
                  onChange={(e) => setLevel(Number(e.target.value))}
                  required
                  type="number"
                  value={level === 0 ? "" : level}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
                htmlFor="favorite-class"
              >
                Clase Favorita
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || success}
                id="favorite-class"
                onChange={(e) => setFavoriteClass(e.target.value)}
                value={favoriteClass}
              >
                <option value="Asalto">Asalto</option>
                <option value="Soporte">Soporte</option>
                <option value="Recon">Recon</option>
                <option value="Ingeniero">Ingeniero</option>
              </select>
            </div>

            <Button
              className="mt-6 flex h-10 w-full items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200"
              disabled={loading || success}
              type="submit"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Perfil</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
