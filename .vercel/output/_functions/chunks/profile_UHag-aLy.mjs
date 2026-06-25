!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"71a7833a24c9bc964b1bfcd179f378a3e26605ac"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0c3703a1-2aa9-4160-99f0-b9658a208d4b",e._sentryDebugIdIdentifier="sentry-dbid-0c3703a1-2aa9-4160-99f0-b9658a208d4b");}catch(e){}}();import './page-ssr_CHRI393N.mjs';
import { c as createComponent } from './astro-component_anW73TDG.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_BOwWm_4U.mjs';
import { r as renderComponent } from './entrypoint_GKLamRve.mjs';
import { a as actions } from './server_DPXFZvOc.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { AlertCircle, User, Award, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { B as Button, N as Nav } from './nav_B0rYCviu.mjs';
import { $ as $$BaseLayout } from './base-layout_BMzA7kH-.mjs';

const AVATAR_PRESETS = [
  "Felix",
  "Aneka",
  "Jack",
  "Buster",
  "Cody",
  "Loki",
  "Bella",
  "Milo",
  "Zoe",
  "Luna",
  "Toby",
  "Leo",
  "Coco",
  "Lucky",
  "Ginger",
  "Max"
];
function ProfileForm({ initialProfile }) {
  const initialGamertagValue = initialProfile?.gamertag ? initialProfile.gamertag.split("||")[0] : "";
  const initialSeedValue = initialProfile?.avatar_seed ? initialProfile.avatar_seed : initialProfile?.gamertag?.includes("||") ? initialProfile.gamertag.split("||")[1] : initialGamertagValue;
  const [gamertag, setGamertag] = useState(initialGamertagValue);
  const [avatarSeed, setAvatarSeed] = useState(initialSeedValue);
  const [level, setLevel] = useState(initialProfile?.level || 1);
  const [favoriteClass, setFavoriteClass] = useState(
    initialProfile?.favorite_class || "Asalto"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isNew = !initialProfile;
  const handleSubmit = async (e) => {
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
      const { error: actionError } = await actions.profile.save({
        gamertag: gamertag.trim(),
        level,
        favoriteClass,
        avatarSeed: (avatarSeed || gamertag).trim()
      });
      if (actionError) {
        throw new Error(actionError.message || "Error al guardar el perfil");
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1e3);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar tu perfil."
      );
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-md", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 p-6 xl:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text font-bold text-2xl text-transparent tracking-tight xl:text-3xl", children: isNew ? "Configura tu Perfil" : "Editar Perfil" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: isNew ? "Antes de ingresar al panel de control de Battle Score, configura tus datos globales de operador." : "Actualiza tus datos globales de operador. Los cambios se propagarán a todos tus escuadrones." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-center justify-center space-y-4 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-xs transition duration-1000 group-hover:opacity-100 group-hover:duration-200" }),
        /* @__PURE__ */ jsx("div", { className: "relative flex h-20 w-20 items-center justify-center rounded-full border border-border bg-card shadow-lg", children: (avatarSeed || gamertag).trim() ? /* @__PURE__ */ jsx(
          "img",
          {
            alt: "Avatar Live Preview",
            className: "h-full w-full rounded-full bg-muted object-cover",
            height: 80,
            src: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent((avatarSeed || gamertag).trim())}`,
            width: 80
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-muted font-bold font-mono text-foreground text-lg uppercase", children: "?" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-xs flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: "Selecciona tu Avatar" }),
        /* @__PURE__ */ jsx("div", { className: "grid w-full grid-cols-4 gap-2 rounded-lg border border-border/40 bg-background/30 p-2.5", children: AVATAR_PRESETS.map((preset) => {
          const isSelected = avatarSeed === preset;
          return /* @__PURE__ */ jsx(
            "button",
            {
              className: `relative aspect-square cursor-pointer overflow-hidden rounded-md border p-1 transition-all duration-200 hover:scale-105 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card/50 hover:border-border/80"}`,
              onClick: () => setAvatarSeed(preset),
              type: "button",
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  alt: preset,
                  className: "h-full w-full rounded-full bg-muted object-cover",
                  src: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(preset)}`
                }
              )
            },
            preset
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
      error && /* @__PURE__ */ jsxs("div", { className: "flex animate-shake items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive text-sm", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      success && /* @__PURE__ */ jsx("div", { className: "flex animate-pulse items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-500 text-sm", children: /* @__PURE__ */ jsx("span", { children: "¡Perfil guardado con éxito! Redirigiendo..." }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "font-semibold text-muted-foreground text-xs uppercase tracking-wider",
            htmlFor: "gamertag",
            children: "Gamertag / Usuario"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground", children: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              disabled: loading || success,
              id: "gamertag",
              onChange: (e) => setGamertag(e.target.value),
              placeholder: "Ej. Ghost_123",
              required: true,
              type: "text",
              value: gamertag
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "font-semibold text-muted-foreground text-xs uppercase tracking-wider",
            htmlFor: "level",
            children: "Nivel de Jugador"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("span", { className: "absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground", children: /* @__PURE__ */ jsx(Award, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              disabled: loading || success,
              id: "level",
              min: "1",
              onChange: (e) => setLevel(Number(e.target.value)),
              required: true,
              type: "number",
              value: level === 0 ? "" : level
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "font-semibold text-muted-foreground text-xs uppercase tracking-wider",
            htmlFor: "favorite-class",
            children: "Clase Favorita"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            disabled: loading || success,
            id: "favorite-class",
            onChange: (e) => setFavoriteClass(e.target.value),
            value: favoriteClass,
            children: [
              /* @__PURE__ */ jsx("option", { value: "Asalto", children: "Asalto" }),
              /* @__PURE__ */ jsx("option", { value: "Soporte", children: "Soporte" }),
              /* @__PURE__ */ jsx("option", { value: "Recon", children: "Recon" }),
              /* @__PURE__ */ jsx("option", { value: "Ingeniero", children: "Ingeniero" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "mt-6 flex h-10 w-full items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200",
          disabled: loading || success,
          type: "submit",
          children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
            /* @__PURE__ */ jsx("span", { children: "Guardando..." })
          ] }) : /* @__PURE__ */ jsx("span", { children: "Guardar Perfil" })
        }
      )
    ] })
  ] }) }) });
}

const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Profile;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/");
  }
  const { data: profile } = await Astro2.callAction(actions.profile.get, {});
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "Mi Perfil de Operador — Battle Score",
    description: "Configura tu perfil de operador global",
    ignoreTitleTemplate: true
  } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-1 flex-col"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} <main class="flex flex-1 items-center justify-center p-4 xl:p-8"> ${renderComponent($$result2, "ProfileForm", ProfileForm, { "initialProfile": profile, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/profile-form", "client:component-export": "ProfileForm" })} </main> </div> ` })}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/dashboard/profile.astro", void 0);

const $$file = "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/dashboard/profile.astro";
const $$url = "/dashboard/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
