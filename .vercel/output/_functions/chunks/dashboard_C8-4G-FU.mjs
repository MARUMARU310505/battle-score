!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"bef452b3ccc56d267223ad34e70c101dfed3c9a7"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ff43452d-84e6-4b95-86d1-08294968689c",e._sentryDebugIdIdentifier="sentry-dbid-ff43452d-84e6-4b95-86d1-08294968689c");}catch(e){}}();import './page-ssr_C2I633KQ.mjs';
import { c as createComponent } from './astro-component_P2jlS4QB.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_fLCUvsuq.mjs';
import { r as renderComponent } from './entrypoint_CllwnPlb.mjs';
import { a as actions } from './server_22scp5ZU.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Activity, Calendar, BarChart3, Sparkles, UserCheck, User, UserMinus, Play, Power, Trophy, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { B as Button, N as Nav } from './nav_BpNBOeY2.mjs';
import { $ as $$BaseLayout } from './base-layout_Bvwu81JX.mjs';

const TABS = [
  { id: "active-session", label: "Sesión Activa", icon: Activity },
  { id: "history", label: "Sesiones Anteriores", icon: Calendar },
  { id: "stats", label: "Estadísticas", icon: BarChart3 },
  { id: "insights", label: "Recomendaciones", icon: Sparkles }
];
function MainTabs({ activeTab, onTabChange }) {
  return /* @__PURE__ */ jsx("div", { className: "border-border border-b bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(
    "nav",
    {
      "aria-label": "Tabs",
      className: "scrollbar-none -mb-px flex space-x-6 overflow-x-auto",
      children: TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            className: `group flex cursor-pointer items-center whitespace-nowrap border-b-2 px-1 py-4 font-medium text-sm transition-all duration-200 focus:outline-none ${isActive ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground/80"}
                `,
            onClick: () => onTabChange(tab.id),
            type: "button",
            children: [
              /* @__PURE__ */ jsx(
                Icon,
                {
                  className: `mr-2 h-4 w-4 shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground/75 group-hover:text-foreground/70"}
                  `
                }
              ),
              tab.label
            ]
          },
          tab.id
        );
      })
    }
  ) }) });
}

function SquadHeader({ activePlayers }) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: activePlayers.map((player) => {
    const isAbsent = player.status === "ausente";
    const kdr = 0;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `rounded-lg border p-4 transition-all duration-200 ${isAbsent ? "border-border/40 bg-card/10 opacity-50" : "border-border bg-card shadow-xs hover:border-border/80"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: [
                "Operador #",
                player.slot_number,
                " ",
                player.status === "reemplazo" && "(Sub)"
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "mt-0.5 truncate font-bold text-foreground text-sm", children: isAbsent ? "Ausente" : player.gamertag })
            ] }),
            !isAbsent && /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary", children: player.active_class })
          ] }),
          isAbsent ? /* @__PURE__ */ jsx("div", { className: "mt-4 flex h-[38px] items-center justify-center border-border/40 border-t pt-3", children: /* @__PURE__ */ jsx("span", { className: "font-light text-muted-foreground text-xs italic", children: "Fuera de servicio" }) }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-4 gap-2 border-border/40 border-t pt-3 text-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: "K" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: "0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: "D" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: "0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: "A" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: "0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: "KDR" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: kdr.toFixed(2) })
            ] })
          ] })
        ]
      },
      player.slot_number
    );
  }) });
}

const CLASSES$1 = ["Asalto", "Soporte", "Recon", "Ingeniero"];
function SquadRoster({
  activePlayers,
  onChange,
  originalMembers
}) {
  const handleStatusChange = (slot, status) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }
      const original = originalMembers.find((m) => m.slot_number === slot);
      let newGamertag = player.gamertag;
      let newRealName = player.real_name;
      if (status === "titular" && original) {
        newGamertag = original.gamertag;
        newRealName = original.real_name;
      } else if (status === "reemplazo") {
        newGamertag = "";
        newRealName = "Sustituto";
      } else if (status === "ausente") {
        newGamertag = "Ausente";
        newRealName = "Ausente";
      }
      return {
        ...player,
        status,
        gamertag: newGamertag,
        real_name: newRealName
      };
    });
    onChange(updated);
  };
  const handleGamertagChange = (slot, gamertag) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }
      return { ...player, gamertag };
    });
    onChange(updated);
  };
  const handleClassChange = (slot, active_class) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }
      return { ...player, active_class };
    });
    onChange(updated);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm tracking-tight", children: "Roster de la Sesión" }),
      /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "Alineación de operadores para esta sesión de juego" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: activePlayers.map((player) => {
      const isAbsent = player.status === "ausente";
      const isSub = player.status === "reemplazo";
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rounded-lg border p-4 transition-all duration-200 ${isAbsent ? "border-border/40 bg-card/10 opacity-70" : "border-border bg-card shadow-xs"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium font-mono text-[10px] text-muted-foreground uppercase", children: [
                  "Operador #",
                  player.slot_number
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: isSub ? /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "rounded-md border border-border bg-background px-2 py-0.5 font-normal font-sans text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    onChange: (e) => handleGamertagChange(
                      player.slot_number,
                      e.target.value
                    ),
                    placeholder: "Gamertag Reemplazo",
                    type: "text",
                    value: player.gamertag
                  }
                ) : player.gamertag }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 self-start sm:self-center", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all ${player.status === "titular" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                    onClick: () => handleStatusChange(player.slot_number, "titular"),
                    type: "button",
                    children: [
                      /* @__PURE__ */ jsx(UserCheck, { className: "h-3 w-3" }),
                      "Titular"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all ${player.status === "reemplazo" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                    onClick: () => handleStatusChange(player.slot_number, "reemplazo"),
                    type: "button",
                    children: [
                      /* @__PURE__ */ jsx(User, { className: "h-3 w-3" }),
                      "Reemplazo"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all ${player.status === "ausente" ? "bg-destructive/15 text-destructive hover:bg-destructive/25" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                    onClick: () => handleStatusChange(player.slot_number, "ausente"),
                    type: "button",
                    children: [
                      /* @__PURE__ */ jsx(UserMinus, { className: "h-3 w-3" }),
                      "Ausente"
                    ]
                  }
                )
              ] })
            ] }),
            !isAbsent && /* @__PURE__ */ jsx("div", { className: "mt-3 border-border/40 border-t pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "font-medium text-muted-foreground text-xs",
                  htmlFor: `class-select-${player.slot_number}`,
                  children: "Clase en Sesión:"
                }
              ),
              /* @__PURE__ */ jsx(
                "select",
                {
                  className: "rounded-md border border-border bg-background px-2 py-1 font-sans text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                  id: `class-select-${player.slot_number}`,
                  onChange: (e) => handleClassChange(player.slot_number, e.target.value),
                  value: player.active_class,
                  children: CLASSES$1.map((cls) => /* @__PURE__ */ jsx("option", { value: cls, children: cls }, cls))
                }
              )
            ] }) })
          ]
        },
        player.slot_number
      );
    }) })
  ] });
}

function SessionPanel({
  squad,
  initialSession,
  activePlayers,
  setActivePlayers
}) {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError("El nombre de la sesión es requerido.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: actionError } = await actions.session.create({
        name: sessionName,
        squadId: squad.id
      });
      if (actionError) {
        throw actionError;
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión de juego"
      );
      setLoading(false);
    }
  };
  const handleCloseSession = async () => {
    if (!initialSession) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: actionError } = await actions.session.close({
        sessionId: initialSession.id
      });
      if (actionError) {
        throw actionError;
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al cerrar sesión de juego"
      );
      setLoading(false);
    }
  };
  if (!initialSession) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm md:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(Play, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-bold text-foreground text-lg tracking-tight", children: "Iniciar Nueva Sesión" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-sm", children: "Crea un contenedor para empezar a registrar y analizar tus partidas" })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs", children: error }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleCreateSession, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "mb-2 block font-medium text-foreground text-xs",
              htmlFor: "sessionName",
              children: "Nombre de la Sesión"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary",
              id: "sessionName",
              onChange: (e) => setSessionName(e.target.value),
              placeholder: "Ej. Rankeds Martes, Torneo Semanal, etc.",
              type: "text",
              value: sessionName
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { className: "w-full", disabled: loading, type: "submit", children: loading ? "Creando..." : "Crear Sesión Activa" })
      ] })
    ] });
  }
  const startDate = new Date(initialSession.created_at).toLocaleDateString(
    "es-ES",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-bold text-foreground text-md tracking-tight", children: [
            "Sesión Activa: ",
            initialSession.name
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-light text-muted-foreground text-xs", children: [
            "Iniciada el ",
            startDate
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: "flex items-center gap-1.5",
          disabled: loading,
          onClick: handleCloseSession,
          size: "sm",
          variant: "destructive",
          children: [
            /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" }),
            loading ? "Cerrando..." : "Finalizar Sesión"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-destructive/10 p-3 text-destructive text-xs", children: error }),
    /* @__PURE__ */ jsx(SquadHeader, { activePlayers }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx("div", { className: "md:col-span-1", children: /* @__PURE__ */ jsx(
        SquadRoster,
        {
          activePlayers,
          onChange: setActivePlayers,
          originalMembers: squad.members
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 md:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm tracking-tight", children: "Partidas de la Sesión" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "⚔️" }),
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Registro de Partidas Diferido" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "En la Fase 6 podrás registrar tus partidas ronda por ronda, especificando estadísticas de cada jugador, drops, POIs y rendimiento táctico." })
        ] })
      ] }) })
    ] })
  ] });
}

const CLASS_BADGES = {
  Asalto: "🚀 Asalto",
  Soporte: "🛡️ Soporte",
  Recon: "👁️ Recon",
  Ingeniero: "🔧 Ingeniero"
};
function SquadSidebar({
  squad,
  onEditClick,
  allSquads,
  onNewSquadClick
}) {
  return /* @__PURE__ */ jsxs("aside", { className: "flex min-h-[calc(100vh-4rem)] w-full flex-col justify-between border-border border-r bg-card p-4 md:w-64", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "font-mono font-semibold text-[10px] text-muted-foreground uppercase tracking-wider",
            htmlFor: "squad-switcher",
            children: "Escuadrón Activo"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full cursor-pointer rounded-md border border-border bg-background px-2.5 py-1.5 font-bold text-foreground text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary",
            id: "squad-switcher",
            onChange: async (e) => {
              const val = e.target.value;
              if (val === "new") {
                onNewSquadClick();
              } else {
                await actions.squad.setActive({ squadId: val });
                window.location.reload();
              }
            },
            value: squad.id,
            children: [
              allSquads.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id)),
              /* @__PURE__ */ jsx("option", { className: "font-semibold text-primary", value: "new", children: "+ Crear Escuadrón" })
            ]
          }
        )
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

function DashboardContent({
  squad,
  activeSession,
  allSquads
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState("active-session");
  const [activePlayers, setActivePlayers] = useState(() => {
    if (!squad) {
      return [];
    }
    return squad.members.map((member) => ({
      slot_number: member.slot_number,
      status: "titular",
      gamertag: member.gamertag,
      real_name: member.real_name,
      favorite_class: member.favorite_class,
      active_class: member.favorite_class
    }));
  });
  if (!squad || isCreatingNew) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8", children: /* @__PURE__ */ jsx(
      SquadWizard,
      {
        onCancel: squad ? () => setIsCreatingNew(false) : void 0
      }
    ) });
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
    /* @__PURE__ */ jsx(
      SquadSidebar,
      {
        allSquads,
        onEditClick: () => setIsEditing(true),
        onNewSquadClick: () => setIsCreatingNew(true),
        squad
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsx(MainTabs, { activeTab, onTabChange: setActiveTab }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 p-6 md:p-8", children: [
        activeTab === "active-session" && /* @__PURE__ */ jsx(
          SessionPanel,
          {
            activePlayers,
            initialSession: activeSession,
            setActivePlayers,
            squad
          }
        ),
        activeTab === "history" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-bold text-foreground text-sm tracking-tight", children: [
            /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-muted-foreground" }),
            "Sesiones Anteriores"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "📅" }),
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Historial Cerrado" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "En la Fase 7 se habilitará el desglose completo del historial, donde podrás consultar todas las sesiones finalizadas, sus métricas acumuladas y las partidas jugadas." })
          ] })
        ] }),
        activeTab === "stats" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-bold text-foreground text-sm tracking-tight", children: [
            /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" }),
            "Estadísticas Globales"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "📈" }),
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Análisis de Rendimiento" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "Los gráficos de K/D, mapas más jugados, tasa de victorias y estadísticas acumuladas por clase se desbloquearán en la Fase 8 con datos reales." })
          ] })
        ] }),
        activeTab === "insights" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-bold text-foreground text-sm tracking-tight", children: [
            /* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4 text-muted-foreground" }),
            "Recomendaciones del Coach"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "💡" }),
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Sugerencias Tácticas" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "El Coach de Fatiga y las recomendaciones automáticas de composición de escuadrón y rotaciones de mapas se activarán en la Fase 8." })
          ] })
        ] })
      ] })
    ] })
  ] });
}

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Dashboard;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/");
  }
  const { data } = await Astro2.callAction(actions.squad.get, {});
  const squad = data?.activeSquad || null;
  const allSquads = data?.allSquads || [];
  let activeSession = null;
  if (squad) {
    const { data: sessionData } = await Astro2.callAction(
      actions.session.getActive,
      {
        squadId: squad.id
      }
    );
    activeSession = sessionData;
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "Dashboard — Battle Score BR Analytics",
    description: "Panel principal de Battle Score BR Analytics",
    ignoreTitleTemplate: true
  } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-background text-foreground flex flex-col"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} ${renderComponent($$result2, "DashboardContent", DashboardContent, { "squad": squad, "allSquads": allSquads, "activeSession": activeSession, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/dashboard-content", "client:component-export": "DashboardContent" })} </div> ` })}`;
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
