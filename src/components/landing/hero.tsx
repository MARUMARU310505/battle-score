import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 xl:py-32">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="h-[400px] w-[600px] rounded-full bg-radial from-neutral-400 to-transparent blur-3xl dark:from-neutral-800" />
      </div>

      <div className="mx-auto max-w-7xl px-4 xl:px-6 xl:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 font-sans text-muted-foreground text-xs">
            <span>Versión 1.1 — Beta Abierta</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl font-extrabold text-4xl text-foreground uppercase leading-none tracking-tight xl:text-6xl">
            Analiza el rendimiento de tu escuadrón
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl font-light text-lg text-muted-foreground leading-8">
            Registra tus sesiones de juego, realiza un seguimiento detallado del
            rendimiento de tu equipo y optimiza tu estrategia. Diseñado para
            jugadores competitivos.
          </p>

          {/* Call to action */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              className="h-11 rounded-md px-6 font-semibold text-sm"
              size="lg"
            >
              Comenzar ahora
            </Button>
            <Button
              className="h-11 rounded-md px-6 font-semibold text-sm"
              size="lg"
              variant="outline"
            >
              Saber más
            </Button>
          </div>
        </div>

        {/* Feature Grid placeholder/preview */}
        <div className="mx-auto mt-20 max-w-5xl rounded-xl border border-border bg-card/50 p-8 shadow-md backdrop-blur-xs">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-bold text-foreground">Registro de Sesión</h3>
              <p className="font-light text-muted-foreground text-sm">
                Documenta cada ronda detallando caídas (Downs), bajas (Kills),
                muertes y causas de aniquilación.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-4">
              <span className="text-2xl">🎮</span>
              <h3 className="font-bold text-foreground">
                Análisis de Escuadrón
              </h3>
              <p className="font-light text-muted-foreground text-sm">
                Visualiza el KDR y desempeño colectivo e individual de los 4
                integrantes principales del equipo.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-4">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-foreground">Coach de Fatiga</h3>
              <p className="font-light text-muted-foreground text-sm">
                Detecta y advierte el cansancio (Tilt) en base a estadísticas y
                estado mental reportado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
