!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"25f39b046960f343648b5091ab94457f0b17ccff"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fbc73559-4613-44a7-ac0b-db771c0bbddd",e._sentryDebugIdIdentifier="sentry-dbid-fbc73559-4613-44a7-ac0b-db771c0bbddd");}catch(e){}}();import { $ as $$BaseLayout } from './base-layout_Bl-HtU1c.mjs';
import { c as createComponent } from './_astro_assets_Cw_dlQdA.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_Ug7RKuBl.mjs';
import { r as renderComponent } from './entrypoint_wceMKO0z.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Button as Button$1 } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 gap-1.5 in-data-[slot=button-group]:rounded-md px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),8px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),10px)] px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs": "size-6 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),8px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 in-data-[slot=button-group]:rounded-md rounded-[min(var(--radius-md),10px)]",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Button$1,
    {
      className: cn(buttonVariants({ variant, size, className })),
      "data-slot": "button",
      ...props
    }
  );
}

function Hero() {
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-background py-24 sm:py-32", children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20", children: /* @__PURE__ */ jsx("div", { className: "h-[400px] w-[600px] rounded-full bg-radial from-neutral-400 to-transparent blur-3xl dark:from-neutral-800" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 font-sans text-muted-foreground text-xs", children: /* @__PURE__ */ jsx("span", { children: "Versión 1.1 — Beta Abierta" }) }),
        /* @__PURE__ */ jsx("h1", { className: "mx-auto max-w-4xl font-extrabold text-4xl text-foreground uppercase leading-none tracking-tight sm:text-6xl", children: "Analiza el rendimiento de tu escuadrón" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-6 max-w-2xl font-light text-lg text-muted-foreground leading-8", children: "Registra tus sesiones de juego, realiza un seguimiento detallado del rendimiento de tu equipo y optimiza tu estrategia. Diseñado para jugadores competitivos." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [
          /* @__PURE__ */ jsx(Button, { className: "rounded-md px-6", size: "lg", children: "Comenzar ahora" }),
          /* @__PURE__ */ jsx(Button, { className: "rounded-md px-6", size: "lg", variant: "outline", children: "Saber más" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto mt-20 max-w-5xl rounded-xl border border-border bg-card/50 p-8 shadow-md backdrop-blur-xs", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "📊" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Registro de Sesión" }),
          /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-sm", children: "Documenta cada ronda detallando caídas (Downs), bajas (Kills), muertes y causas de aniquilación." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🎮" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Análisis de Escuadrón" }),
          /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-sm", children: "Visualiza el KDR y desempeño colectivo e individual de los 4 integrantes principales del equipo." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 rounded-lg border border-border/50 bg-background/50 p-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "⚡" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Coach de Fatiga" }),
          /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-sm", children: "Detecta y advierte el cansancio (Tilt) en base a estadísticas y estado mental reportado." })
        ] })
      ] }) })
    ] })
  ] });
}

function ThemeToggle() {
  const [theme, setThemeState] = useState("light");
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", nextTheme);
  };
  return /* @__PURE__ */ jsx(
    Button,
    {
      "aria-label": "Toggle theme",
      className: "h-9 w-9 rounded-md text-foreground hover:bg-muted/50",
      onClick: toggleTheme,
      size: "icon",
      variant: "ghost",
      children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4 transition-all" }) : /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 transition-all" })
    }
  );
}

function Nav({ user = null }) {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full border-border border-b bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("a", { className: "flex items-center space-x-2", href: "/", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-foreground text-xl tracking-tight", children: [
      "REDSEC",
      /* @__PURE__ */ jsx("span", { className: "ml-1.5 border-border border-l pl-1.5 font-light font-sans text-muted-foreground text-sm uppercase", children: "BR Analytics" })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(ThemeToggle, {}),
      user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "hidden text-muted-foreground text-sm md:inline-block", children: user.email }),
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsx("a", { href: "/dashboard", children: "Dashboard" }) })
      ] }) : /* @__PURE__ */ jsx(Button, { size: "sm", children: /* @__PURE__ */ jsx("span", { children: "Iniciar con Google" }) })
    ] })
  ] }) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "RedSec BR Analytics — Analiza tu escuadrón",
    description: "Plataforma de análisis de rendimiento para escuadrones competitivos de Battle Royale.",
    ignoreTitleTemplate: true
  } }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-background text-foreground transition-colors duration-200"> ${renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} <main>${renderComponent($$result2, "Hero", Hero, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/hero", "client:component-export": "Hero" })}</main> </div> ` })}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/index.astro", void 0);

const $$file = "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
