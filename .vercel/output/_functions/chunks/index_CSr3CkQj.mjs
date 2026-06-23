!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"c9cd6b3575bdb60f9b32c7442b601090456e57f9"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="df15f6d6-c292-4c42-bbed-729cfcd56bc3",e._sentryDebugIdIdentifier="sentry-dbid-df15f6d6-c292-4c42-bbed-729cfcd56bc3");}catch(e){}}();import './page-ssr_89sZ-QWM.mjs';
import { c as createComponent } from './astro-component_BqOIDPVZ.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_tVHA_YY-.mjs';
import { r as renderComponent } from './entrypoint_ZfoDqWIb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { B as Button, N as Nav } from './nav_Bdhz0dcO.mjs';
import { $ as $$BaseLayout } from './base-layout_CbaJAs8P.mjs';

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

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { user } = Astro2.locals;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "Battle Score BR Analytics — Analiza tu escuadrón",
    description: "Plataforma de análisis de rendimiento para escuadrones competitivos de Battle Royale.",
    ignoreTitleTemplate: true
  } }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-background text-foreground transition-colors duration-200"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} <main>${renderComponent($$result2, "Hero", Hero, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/hero", "client:component-export": "Hero" })}</main> </div> ` })}`;
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
