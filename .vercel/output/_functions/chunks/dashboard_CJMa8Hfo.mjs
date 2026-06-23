!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"d9eddfe5ff0a9193a99cfff4c059b06ab7d53ab4"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="36111fd7-0362-40fd-910c-9df80a6f0d24",e._sentryDebugIdIdentifier="sentry-dbid-36111fd7-0362-40fd-910c-9df80a6f0d24");}catch(e){}}();import './page-ssr_CYs5QmLu.mjs';
import { c as createComponent } from './astro-component_DDRuvWP-.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_C_SQUMVQ.mjs';
import { r as renderComponent } from './entrypoint_B2Vs5dyY.mjs';
import { a as actions } from './server_D9HWf41S.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { B as Button, N as Nav } from './nav_CrSyAfBx.mjs';
import { $ as $$BaseLayout } from './base-layout_BXkConVn.mjs';

const CLASS_BADGES = {
  Asalto: "🚀 Asalto",
  Soporte: "🛡️ Soporte",
  Recon: "👁️ Recon",
  Ingeniero: "🔧 Ingeniero"
};
function SquadSidebar({ squad, onEditClick }) {
  return /* @__PURE__ */ jsxs("aside", { className: "flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between border-border border-r bg-card p-4 md:w-64", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-mono font-semibold text-muted-foreground text-xs uppercase tracking-wider", children: "Escuadrón" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 truncate font-bold text-foreground text-lg", children: squad.name })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: squad.members.map((member) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-bold font-mono text-foreground text-xs uppercase", children: member.gamertag.slice(0, 2) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate font-bold text-foreground text-xs", children: member.gamertag }),
                /* @__PURE__ */ jsxs("span", { className: "shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground", children: [
                  "Nivel ",
                  member.level
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 truncate font-light text-[10px] text-muted-foreground", children: member.real_name }),
              /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex items-center gap-1.5", children: /* @__PURE__ */ jsx("span", { className: "rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary", children: CLASS_BADGES[member.favorite_class] || member.favorite_class }) })
            ] })
          ]
        },
        member.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 border-border border-t pt-4", children: /* @__PURE__ */ jsx(
      Button,
      {
        className: "w-full",
        onClick: onEditClick,
        size: "sm",
        variant: "outline",
        children: "Editar Escuadrón"
      }
    ) })
  ] });
}

const CLASSES = ["Asalto", "Soporte", "Recon", "Ingeniero"];
function validateMembers(members) {
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (!m.gamertag.trim()) {
      return `El Gamertag del Jugador #${i + 1} es requerido.`;
    }
    if (!m.real_name.trim()) {
      return `El nombre real del Jugador #${i + 1} es requerido.`;
    }
    if (m.level < 1) {
      return `El nivel del Jugador #${i + 1} debe ser mayor o igual a 1.`;
    }
  }
  return null;
}
function SquadWizard({
  initialSquad = null,
  onCancel
}) {
  const [step, setStep] = useState(1);
  const [squadName, setSquadName] = useState(initialSquad?.name || "");
  const [members, setMembers] = useState(
    initialSquad?.members.map((m) => ({
      id: m.id,
      gamertag: m.gamertag,
      real_name: m.real_name,
      level: m.level,
      favorite_class: m.favorite_class,
      slot_number: m.slot_number
    })) || [
      {
        gamertag: "",
        real_name: "",
        level: 1,
        favorite_class: "Asalto",
        slot_number: 1
      },
      {
        gamertag: "",
        real_name: "",
        level: 1,
        favorite_class: "Soporte",
        slot_number: 2
      },
      {
        gamertag: "",
        real_name: "",
        level: 1,
        favorite_class: "Recon",
        slot_number: 3
      },
      {
        gamertag: "",
        real_name: "",
        level: 1,
        favorite_class: "Ingeniero",
        slot_number: 4
      }
    ]
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleMemberChange = (index, field, value) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  const handleNext = () => {
    if (squadName.trim().length < 3) {
      setError("El nombre del escuadrón debe tener al menos 3 caracteres.");
      return;
    }
    setError(null);
    setStep(2);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const validationError = validateMembers(members);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(false);
    try {
      setLoading(true);
      if (initialSquad) {
        const { error: actionError } = await actions.squad.update({
          squadId: initialSquad.id,
          name: squadName,
          members
        });
        if (actionError) {
          throw actionError;
        }
      } else {
        const { error: actionError } = await actions.squad.create({
          name: squadName,
          members
        });
        if (actionError) {
          throw actionError;
        }
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el escuadrón.";
      setError(message);
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm md:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-foreground text-xl tracking-tight", children: initialSquad ? "Editar Escuadrón" : "Configuración del Escuadrón" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-sm", children: step === 1 ? "Paso 1: Nombre de tu equipo" : "Paso 2: Registrar integrantes (4 operadores)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "font-mono text-muted-foreground text-xs", children: [
        "Paso ",
        step,
        " de 2"
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-md bg-destructive/10 p-3 font-light text-destructive text-sm", children: error }),
    step === 1 ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "mb-2 block font-medium text-foreground text-sm",
            htmlFor: "squadName",
            children: "Nombre del Escuadrón"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary",
            id: "squadName",
            onChange: (e) => setSquadName(e.target.value),
            placeholder: "Ej. Alpha Team, Battle Score BR, etc.",
            type: "text",
            value: squadName
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
        onCancel && /* @__PURE__ */ jsx(Button, { onClick: onCancel, type: "button", variant: "outline", children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleNext, type: "button", children: "Siguiente Paso" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: members.map((member, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "space-y-4 rounded-md border border-border/60 bg-background/50 p-4",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-border/40 border-b pb-2", children: /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-muted-foreground text-xs uppercase", children: [
              "Operador #",
              member.slot_number,
              " ",
              index === 0 && "(Líder)"
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-1 block font-medium text-muted-foreground text-xs",
                    htmlFor: `gamertag-${member.slot_number}`,
                    children: "Gamertag"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `gamertag-${member.slot_number}`,
                    onChange: (e) => handleMemberChange(index, "gamertag", e.target.value),
                    placeholder: "Ej. Ghost",
                    type: "text",
                    value: member.gamertag
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-1 block font-medium text-muted-foreground text-xs",
                    htmlFor: `real_name-${member.slot_number}`,
                    children: "Nombre Real"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `real_name-${member.slot_number}`,
                    onChange: (e) => handleMemberChange(index, "real_name", e.target.value),
                    placeholder: "Ej. Alex",
                    type: "text",
                    value: member.real_name
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-1 block font-medium text-muted-foreground text-xs",
                    htmlFor: `level-${member.slot_number}`,
                    children: "Nivel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `level-${member.slot_number}`,
                    min: "1",
                    onChange: (e) => handleMemberChange(
                      index,
                      "level",
                      Number.parseInt(e.target.value, 10) || 1
                    ),
                    type: "number",
                    value: member.level
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-1 block font-medium text-muted-foreground text-xs",
                    htmlFor: `favorite_class-${member.slot_number}`,
                    children: "Clase Favorita"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `favorite_class-${member.slot_number}`,
                    onChange: (e) => handleMemberChange(
                      index,
                      "favorite_class",
                      e.target.value
                    ),
                    value: member.favorite_class,
                    children: CLASSES.map((cls) => /* @__PURE__ */ jsx("option", { value: cls, children: cls }, cls))
                  }
                )
              ] })
            ] })
          ]
        },
        member.slot_number
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            disabled: loading,
            onClick: () => setStep(1),
            type: "button",
            variant: "outline",
            children: "Atrás"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          onCancel && /* @__PURE__ */ jsx(
            Button,
            {
              disabled: loading,
              onClick: onCancel,
              type: "button",
              variant: "outline",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(Button, { disabled: loading, type: "submit", children: loading ? "Guardando..." : "Guardar Escuadrón" })
        ] })
      ] })
    ] })
  ] });
}

function DashboardContent({ squad }) {
  const [isEditing, setIsEditing] = useState(false);
  if (!squad) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8", children: /* @__PURE__ */ jsx(SquadWizard, {}) });
  }
  if (isEditing) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8", children: /* @__PURE__ */ jsx(
      SquadWizard,
      {
        initialSquad: squad,
        onCancel: () => setIsEditing(false)
      }
    ) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background md:flex-row", children: [
    /* @__PURE__ */ jsx(SquadSidebar, { onEditClick: () => setIsEditing(true), squad }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 space-y-6 p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto mt-12 flex max-w-xl flex-col items-center justify-center rounded-xl border border-border border-dashed bg-card/20 p-12 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-4 text-4xl", children: "🎮" }),
      /* @__PURE__ */ jsx("h2", { className: "font-bold text-foreground text-lg", children: "Sesión de Juego Activa" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-sm", children: "Tu escuadrón está listo. En las siguientes fases podrás iniciar una sesión de juego, registrar tus partidas en tiempo real y empezar a acumular estadísticas." })
    ] }) })
  ] });
}

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Dashboard;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/");
  }
  const { data: squad } = await Astro2.callAction(actions.squad.get, {});
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "Dashboard — Battle Score BR Analytics",
    description: "Panel principal de Battle Score BR Analytics",
    ignoreTitleTemplate: true
  } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-background text-foreground flex flex-col"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} ${renderComponent($$result2, "DashboardContent", DashboardContent, { "squad": squad, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/dashboard-content", "client:component-export": "DashboardContent" })} </div> ` })}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/dashboard.astro", void 0);

const $$file = "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
