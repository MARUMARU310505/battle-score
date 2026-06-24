!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"a3de67afb54a6eaab76f9455fd19e34366e2bb5a"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3df93a00-6f92-436e-80f7-ce907652b71e",e._sentryDebugIdIdentifier="sentry-dbid-3df93a00-6f92-436e-80f7-ce907652b71e");}catch(e){}}();import './page-ssr_CH3Aup6W.mjs';
import { c as createComponent } from './astro-component_BHzLDYUW.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_K9hVaRjK.mjs';
import { r as renderComponent } from './entrypoint_IPTwynej.mjs';
import { a as actions } from './server_DZJIGYsy.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Activity, Calendar, BarChart3, Sparkles, Settings, UserCheck, User, UserMinus, Play, Power, Loader2, Trophy, Crosshair, Target, ChevronUp, ChevronDown, HelpCircle, Check, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { B as Button, N as Nav } from './nav_2VwlJSPQ.mjs';
import { S as SquadWizard } from './squad-wizard_BH2UNCNV.mjs';
import { $ as $$BaseLayout } from './base-layout_DprDH51r.mjs';

function MainTabs({
  activeTab,
  onTabChange,
  isOwner = false
}) {
  const tabs = [
    { id: "active-session", label: "Sesión Activa", icon: Activity },
    { id: "history", label: "Sesiones Anteriores", icon: Calendar },
    { id: "stats", label: "Estadísticas", icon: BarChart3 },
    { id: "insights", label: "Recomendaciones", icon: Sparkles }
  ];
  if (isOwner) {
    tabs.push({ id: "settings", label: "Ajustes", icon: Settings });
  }
  return /* @__PURE__ */ jsx("div", { className: "border-border border-b bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(
    "nav",
    {
      "aria-label": "Tabs",
      className: "scrollbar-none -mb-px flex space-x-6 overflow-x-auto",
      children: tabs.map((tab) => {
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

const POIS = [
	"Military Base",
	"Downtown",
	"Superstore",
	"Airport",
	"Promenade",
	"Boneyard",
	"Storage Town",
	"Train Station",
	"Hospital",
	"Stadium",
	"TV Station",
	"Quarry",
	"Lumber",
	"Farmland",
	"Prison",
	"Port",
	"Desconocido"
];

function MatchForm({
  sessionId,
  activePlayers,
  onCancel,
  onSuccess
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const playingMembers = activePlayers.filter((p) => p.status !== "ausente");
  const [poi, setPoi] = useState("Desconocido");
  const [placement, setPlacement] = useState(1);
  const [hostility, setHostility] = useState(
    "Media"
  );
  const [loot, setLoot] = useState("Normal");
  const [eliminationCause, setEliminationCause] = useState("Ninguna");
  const [playerStats, setPlayerStats] = useState(
    () => playingMembers.map((p) => ({
      userId: p.user_id,
      gamertag: p.gamertag,
      activeClass: p.active_class,
      downs: 0,
      kills: 0,
      assists: 0,
      revives: 0,
      respawned: false,
      endGame: false,
      mentalState: 3
    }))
  );
  const handleStatChange = (index, field, value) => {
    setPlayerStats((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  const handleNext = () => {
    if (placement < 1) {
      setError("La posición debe ser mayor o igual a 1.");
      return;
    }
    setError(null);
    setStep(2);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: actionError } = await actions.match.create({
        sessionId,
        poi,
        placement,
        hostility,
        loot,
        eliminationCause: placement === 1 ? "Victoria" : eliminationCause,
        playerStats
      });
      if (actionError) {
        throw actionError;
      }
      onSuccess();
    } catch (err) {
      console.error("Error creating match:", err);
      setError(
        err instanceof Error ? err.message : "Ocurrió un error al registrar la partida."
      );
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between border-border/40 border-b pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm tracking-tight", children: "Registrar Partida" }),
        /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: step === 1 ? "Paso 1: Información General" : "Paso 2: Estadísticas de Operadores" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "font-mono text-muted-foreground text-xs", children: [
        "Paso ",
        step,
        " de 2"
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs", children: error }),
    step === 1 ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "mb-1 block font-medium text-muted-foreground text-xs",
              htmlFor: "match-poi",
              children: "Punto de Caída (POI)"
            }
          ),
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
              id: "match-poi",
              onChange: (e) => setPoi(e.target.value),
              value: poi,
              children: POIS.map((p) => /* @__PURE__ */ jsx("option", { value: p, children: p }, p))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "mb-1 block font-medium text-muted-foreground text-xs",
              htmlFor: "match-placement",
              children: "Posición / Colocación"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
              id: "match-placement",
              min: "1",
              onChange: (e) => {
                const val = Number.parseInt(e.target.value, 10) || 1;
                setPlacement(val);
                if (val === 1) {
                  setEliminationCause("Ninguna");
                }
              },
              type: "number",
              value: placement
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "mb-1 block font-medium text-muted-foreground text-xs",
              htmlFor: "match-hostility",
              children: "Hostilidad de la Zona"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
              id: "match-hostility",
              onChange: (e) => setHostility(e.target.value),
              value: hostility,
              children: [
                /* @__PURE__ */ jsx("option", { value: "Baja", children: "Baja" }),
                /* @__PURE__ */ jsx("option", { value: "Media", children: "Media" }),
                /* @__PURE__ */ jsx("option", { value: "Alta", children: "Alta" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "mb-1 block font-medium text-muted-foreground text-xs",
              htmlFor: "match-loot",
              children: "Calidad de Loot"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
              id: "match-loot",
              onChange: (e) => setLoot(e.target.value),
              value: loot,
              children: [
                /* @__PURE__ */ jsx("option", { value: "Malo", children: "Malo" }),
                /* @__PURE__ */ jsx("option", { value: "Normal", children: "Normal" }),
                /* @__PURE__ */ jsx("option", { value: "Excelente", children: "Excelente" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "mb-1 block font-medium text-muted-foreground text-xs",
              htmlFor: "match-cause",
              children: "Causa de Aniquilación"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
              disabled: placement === 1,
              id: "match-cause",
              onChange: (e) => setEliminationCause(e.target.value),
              placeholder: placement === 1 ? "Ninguna (Victoria)" : "Ej. Flanqueo, Sniper, etc.",
              type: "text",
              value: placement === 1 ? "Ninguna" : eliminationCause
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 border-border/40 border-t pt-4", children: [
        /* @__PURE__ */ jsx(Button, { onClick: onCancel, type: "button", variant: "outline", children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleNext, type: "button", children: "Siguiente Paso" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx("div", { className: "max-h-[50vh] space-y-4 overflow-y-auto pr-1", children: playerStats.map((stat, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "space-y-3 rounded-lg border border-border/60 bg-background/50 p-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-border/40 border-b pb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-xs", children: stat.gamertag }),
              /* @__PURE__ */ jsx("span", { className: "rounded bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground", children: stat.activeClass })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-0.5 block text-[10px] text-muted-foreground",
                    htmlFor: `kills-${stat.gamertag}`,
                    children: "Kills (K)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `kills-${stat.gamertag}`,
                    min: "0",
                    onChange: (e) => handleStatChange(
                      idx,
                      "kills",
                      Number.parseInt(e.target.value, 10) || 0
                    ),
                    type: "number",
                    value: stat.kills
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-0.5 block text-[10px] text-muted-foreground",
                    htmlFor: `downs-${stat.gamertag}`,
                    children: "Downs (D)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `downs-${stat.gamertag}`,
                    min: "0",
                    onChange: (e) => handleStatChange(
                      idx,
                      "downs",
                      Number.parseInt(e.target.value, 10) || 0
                    ),
                    type: "number",
                    value: stat.downs
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-0.5 block text-[10px] text-muted-foreground",
                    htmlFor: `assists-${stat.gamertag}`,
                    children: "Asistencias (A)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `assists-${stat.gamertag}`,
                    min: "0",
                    onChange: (e) => handleStatChange(
                      idx,
                      "assists",
                      Number.parseInt(e.target.value, 10) || 0
                    ),
                    type: "number",
                    value: stat.assists
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-0.5 block text-[10px] text-muted-foreground",
                    htmlFor: `revives-${stat.gamertag}`,
                    children: "Revivir (R)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    id: `revives-${stat.gamertag}`,
                    min: "0",
                    onChange: (e) => handleStatChange(
                      idx,
                      "revives",
                      Number.parseInt(e.target.value, 10) || 0
                    ),
                    type: "number",
                    value: stat.revives
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 py-1", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      checked: stat.respawned,
                      className: "rounded border-border bg-background text-primary focus:ring-primary",
                      onChange: (e) => handleStatChange(idx, "respawned", e.target.checked),
                      type: "checkbox"
                    }
                  ),
                  "¿Redesplegado?"
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      checked: stat.endGame,
                      className: "rounded border-border bg-background text-primary focus:ring-primary",
                      onChange: (e) => handleStatChange(idx, "endGame", e.target.checked),
                      type: "checkbox"
                    }
                  ),
                  "¿End Game / Final?"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "mb-1.5 block text-[10px] text-muted-foreground",
                    htmlFor: `mental-${stat.gamertag}`,
                    children: "Estado Mental (Fatiga)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "flex gap-1.5",
                    id: `mental-${stat.gamertag}`,
                    children: [1, 2, 3, 4, 5].map((lvl) => {
                      const levelLabels = [
                        "Fatigado",
                        "Cansado",
                        "Normal",
                        "Enfocado",
                        "Excelente"
                      ];
                      const colors = [
                        "bg-red-500/10 text-red-500 border-red-500/30",
                        "bg-amber-500/10 text-amber-500 border-amber-500/30",
                        "bg-blue-500/10 text-blue-500 border-blue-500/30",
                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
                        "bg-green-500/10 text-green-500 border-green-500/30"
                      ];
                      const activeColor = "bg-primary text-primary-foreground border-primary";
                      const isActive = stat.mentalState === lvl;
                      return /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: `flex-1 cursor-pointer rounded border py-1 text-center font-mono text-[9px] transition-all ${isActive ? activeColor : colors[lvl - 1]}`,
                          onClick: () => handleStatChange(idx, "mentalState", lvl),
                          title: levelLabels[lvl - 1],
                          type: "button",
                          children: lvl
                        },
                        lvl
                      );
                    })
                  }
                )
              ] })
            ] })
          ]
        },
        stat.gamertag
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-border/40 border-t pt-4", children: [
        /* @__PURE__ */ jsx(Button, { onClick: () => setStep(1), type: "button", variant: "outline", children: "Atrás" }),
        /* @__PURE__ */ jsx(Button, { disabled: loading, type: "submit", children: loading ? "Guardando..." : "Guardar Partida" })
      ] })
    ] })
  ] });
}

function SquadHeader({ activePlayers }) {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: activePlayers.map((player) => {
    const isAbsent = player.status === "ausente";
    const k = player.kills || 0;
    const d = player.downs || 0;
    const a = player.assists || 0;
    const kdr = d > 0 ? k / d : k;
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
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: k })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: "D" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: d })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: "A" }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 font-semibold text-foreground text-sm", children: a })
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

const CLASSES = ["Asalto", "Soporte", "Recon", "Ingeniero"];
function SquadRoster({
  activePlayers,
  onChange,
  originalMembers,
  disabled = false
}) {
  const handleStatusChange = (slot, status) => {
    const updated = activePlayers.map((player) => {
      if (player.slot_number !== slot) {
        return player;
      }
      const original = originalMembers.find((m) => m.slot_number === slot);
      let newGamertag = player.gamertag;
      if (status === "titular" && original) {
        newGamertag = original.gamertag;
      } else if (status === "reemplazo") {
        newGamertag = "";
      } else if (status === "ausente") {
        newGamertag = "Ausente";
      }
      return {
        ...player,
        status,
        gamertag: newGamertag
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
                    className: "rounded-md border border-border bg-background px-2 py-0.5 font-normal font-sans text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-75",
                    disabled,
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
              player.user_id !== null && player.user_id !== void 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 self-start sm:self-center", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: `flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${player.status === "titular" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                    disabled,
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
                    className: `flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${player.status === "reemplazo" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                    disabled,
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
                    className: `flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${player.status === "ausente" ? "bg-destructive/15 text-destructive hover:bg-destructive/25" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                    disabled,
                    onClick: () => handleStatusChange(player.slot_number, "ausente"),
                    type: "button",
                    children: [
                      /* @__PURE__ */ jsx(UserMinus, { className: "h-3 w-3" }),
                      "Ausente"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded border border-border/30 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/60 italic", children: "Slot disponible (Invitación)" })
            ] }),
            !isAbsent && player.user_id !== null && player.user_id !== void 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 border-border/40 border-t pt-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
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
                  className: "rounded-md border border-border bg-background px-2 py-1 font-sans text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75",
                  disabled,
                  id: `class-select-${player.slot_number}`,
                  onChange: (e) => handleClassChange(player.slot_number, e.target.value),
                  value: player.active_class,
                  children: CLASSES.map((cls) => /* @__PURE__ */ jsx("option", { value: cls, children: cls }, cls))
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
  sessionMatches,
  activePlayers,
  setActivePlayers,
  isOwner
}) {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegisteringMatch, setIsRegisteringMatch] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
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
    if (!isOwner) {
      return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/20", children: /* @__PURE__ */ jsx(Calendar, { className: "h-6 w-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-bold text-foreground text-lg tracking-tight", children: "Sin Sesión Activa" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-light text-muted-foreground text-sm leading-relaxed", children: "A la espera de que el líder del escuadrón comience una sesión de juego." })
      ] }) });
    }
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
      isOwner && /* @__PURE__ */ jsxs(
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
          disabled: !isOwner,
          onChange: setActivePlayers,
          originalMembers: squad.members
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 md:col-span-2", children: isRegisteringMatch ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setIsRegisteringMatch(false),
            size: "sm",
            variant: "outline",
            children: "Volver al Listado"
          }
        ),
        /* @__PURE__ */ jsx(
          MatchForm,
          {
            activePlayers,
            onCancel: () => setIsRegisteringMatch(false),
            onSuccess: () => {
              setIsRegisteringMatch(false);
              window.location.reload();
            },
            sessionId: initialSession.id
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-border/40 border-b pb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm tracking-tight", children: "Partidas de la Sesión" }),
          isOwner && initialSession.status === "active" && /* @__PURE__ */ jsx(Button, { onClick: () => setIsRegisteringMatch(true), size: "sm", children: "+ Registrar Partida" })
        ] }),
        sessionMatches.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "⚔️" }),
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Sin Partidas Registradas" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: isOwner ? "Registra tu primera partida de la sesión usando el botón superior para empezar a acumular estadísticas." : "El líder del escuadrón aún no ha registrado ninguna partida para esta sesión." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: sessionMatches.map((match) => {
          const isExpanded = expandedMatchId === match.id;
          const matchDate = new Date(
            match.created_at
          ).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
          });
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "overflow-hidden rounded-lg border border-border/60 bg-background/30",
              children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-colors hover:bg-muted/10",
                    onClick: () => setExpandedMatchId(isExpanded ? null : match.id),
                    type: "button",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `flex h-6 w-6 items-center justify-center rounded-full font-mono font-semibold text-xs ${match.placement === 1 ? "border border-amber-500/30 bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground"}`,
                            children: match.placement
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { className: "font-bold text-foreground text-xs", children: match.placement === 1 ? "¡Victoria! 🏆" : `Lugar #${match.placement}` }),
                          /* @__PURE__ */ jsxs("p", { className: "font-light text-[10px] text-muted-foreground", children: [
                            "Drop:",
                            " ",
                            /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground/80", children: match.poi }),
                            " ",
                            "• ",
                            matchDate
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-primary text-xs hover:underline", children: isExpanded ? "Ocultar" : "Detalles" }) })
                    ]
                  }
                ),
                isExpanded && /* @__PURE__ */ jsxs("div", { className: "space-y-3 border-border/40 border-t bg-card/40 p-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-border/20 border-b pb-2 text-[10px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground/80", children: [
                        "Causa:",
                        " "
                      ] }),
                      match.elimination_cause
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground/80", children: [
                        "Loot:",
                        " "
                      ] }),
                      match.loot,
                      " •",
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground/80", children: [
                        "Hostilidad:",
                        " "
                      ] }),
                      match.hostility
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left font-sans text-xs", children: [
                    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-border/30 border-b font-mono text-[10px] text-muted-foreground uppercase", children: [
                      /* @__PURE__ */ jsx("th", { className: "py-2", children: "Operador" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Clase" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "K / D / A" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Downs / Rev" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Desp / Final" }),
                      /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Mente" })
                    ] }) }),
                    /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/20", children: match.player_match_stats?.map(
                      (stat) => {
                        const k = stat.kills || 0;
                        const d = stat.downs || 0;
                        const kdr = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);
                        const mentalColors = [
                          "text-red-500",
                          "text-amber-500",
                          "text-blue-500",
                          "text-emerald-500",
                          "text-green-500"
                        ];
                        return /* @__PURE__ */ jsxs(
                          "tr",
                          {
                            className: "hover:bg-muted/5",
                            children: [
                              /* @__PURE__ */ jsx("td", { className: "py-2 font-semibold text-foreground", children: stat.gamertag }),
                              /* @__PURE__ */ jsx("td", { className: "py-2 text-center", children: /* @__PURE__ */ jsx("span", { className: "rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary", children: stat.active_class }) }),
                              /* @__PURE__ */ jsxs("td", { className: "py-2 text-center font-mono", children: [
                                k,
                                " / ",
                                d,
                                " / ",
                                stat.assists,
                                " ",
                                /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                                  "(",
                                  kdr,
                                  ")"
                                ] })
                              ] }),
                              /* @__PURE__ */ jsxs("td", { className: "py-2 text-center font-mono", children: [
                                stat.downs,
                                " / ",
                                stat.revives
                              ] }),
                              /* @__PURE__ */ jsxs("td", { className: "py-2 text-center", children: [
                                stat.respawned ? "✅" : "❌",
                                " /",
                                " ",
                                stat.end_game ? "✅" : "❌"
                              ] }),
                              /* @__PURE__ */ jsx(
                                "td",
                                {
                                  className: `py-2 text-center font-bold ${mentalColors[stat.mental_state - 1]}`,
                                  children: stat.mental_state
                                }
                              )
                            ]
                          },
                          stat.id
                        );
                      }
                    ) })
                  ] }) })
                ] })
              ]
            },
            match.id
          );
        }) })
      ] }) })
    ] })
  ] });
}

function SessionsHistory({ squadId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(null);
  const [sessionMatches, setSessionMatches] = useState({});
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error: actionError } = await actions.session.getHistory({ squadId });
        if (actionError) {
          throw actionError;
        }
        setSessions(data || []);
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Error al cargar el historial de sesiones.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [squadId]);
  const handleToggle = async (sessionId) => {
    if (expandedId === sessionId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(sessionId);
    if (!sessionMatches[sessionId]) {
      setDetailLoading(sessionId);
      try {
        const { data, error: actionError } = await actions.session.getDetail({ sessionId });
        if (actionError) {
          throw actionError;
        }
        setSessionMatches((prev) => ({
          ...prev,
          [sessionId]: data || []
        }));
      } catch (err) {
        console.error("Error loading session detail:", err);
      } finally {
        setDetailLoading(null);
      }
    }
  };
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const formatDuration = (start, end) => {
    if (!end) {
      return "—";
    }
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(ms / 36e5);
    const minutes = Math.floor(ms % 36e5 / 6e4);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center rounded-lg border border-border bg-card p-12", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "ml-2 font-light text-muted-foreground text-sm", children: "Cargando historial..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "font-light text-destructive text-sm", children: error }) });
  }
  if (sessions.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-bold text-foreground text-sm tracking-tight", children: [
        /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-muted-foreground" }),
        "Sesiones Anteriores"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "📅" }),
        /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Sin Historial" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "Aún no hay sesiones finalizadas. Una vez que cierres tu primera sesión de juego, aparecerá aquí con todas las métricas acumuladas." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-bold text-foreground text-sm tracking-tight", children: [
        /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-muted-foreground" }),
        "Sesiones Anteriores"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "font-mono text-muted-foreground text-xs", children: [
        sessions.length,
        " sesión",
        sessions.length !== 1 ? "es" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sessions.map((session) => {
      const isExpanded = expandedId === session.id;
      const matches = sessionMatches[session.id];
      const isLoadingDetail = detailLoading === session.id;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "overflow-hidden rounded-lg border border-border bg-card transition-all duration-200",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-muted/10",
                onClick: () => handleToggle(session.id),
                type: "button",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx(Calendar, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-sm", children: session.name }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-0.5 font-light text-muted-foreground text-xs", children: [
                        formatDate(session.created_at),
                        " •",
                        " ",
                        formatTime(session.created_at),
                        session.closed_at && ` → ${formatTime(session.closed_at)}`,
                        " ",
                        "(",
                        formatDuration(session.created_at, session.closed_at),
                        ")"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-3 sm:flex", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-center", children: [
                        /* @__PURE__ */ jsx(Crosshair, { className: "h-3 w-3 text-muted-foreground" }),
                        /* @__PURE__ */ jsx("span", { className: "font-mono text-foreground text-xs", children: session.match_count }),
                        /* @__PURE__ */ jsx("span", { className: "font-light text-[10px] text-muted-foreground", children: "partidas" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-border" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-center", children: [
                        /* @__PURE__ */ jsx(Target, { className: "h-3 w-3 text-muted-foreground" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-mono text-foreground text-xs", children: [
                          "#",
                          session.avg_placement
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "font-light text-[10px] text-muted-foreground", children: "prom." })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-border" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-center", children: [
                        /* @__PURE__ */ jsx(Trophy, { className: "h-3 w-3 text-amber-500" }),
                        /* @__PURE__ */ jsxs(
                          "span",
                          {
                            className: `font-mono text-xs ${session.win_rate > 0 ? "text-amber-500" : "text-muted-foreground"}`,
                            children: [
                              session.win_rate,
                              "%"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "font-light text-[10px] text-muted-foreground", children: "WR" })
                      ] })
                    ] }),
                    isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
                  ] })
                ]
              }
            ),
            !isExpanded && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 border-border/40 border-t px-4 py-2 sm:hidden", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-muted-foreground text-xs", children: [
                session.match_count,
                " partidas"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-mono text-muted-foreground text-xs", children: [
                "Pos. #",
                session.avg_placement
              ] }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `font-mono text-xs ${session.win_rate > 0 ? "text-amber-500" : "text-muted-foreground"}`,
                  children: [
                    "WR ",
                    session.win_rate,
                    "%"
                  ]
                }
              )
            ] }),
            isExpanded && /* @__PURE__ */ jsx("div", { className: "border-border/40 border-t bg-background/30 p-4", children: isLoadingDetail ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center py-8", children: [
              /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "ml-2 font-light text-muted-foreground text-xs", children: "Cargando partidas..." })
            ] }) : !matches || matches.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "Esta sesión no tiene partidas registradas." }) }) : /* @__PURE__ */ jsx(MatchDetailList, { matches }) })
          ]
        },
        session.id
      );
    }) })
  ] });
}
function MatchDetailList({ matches }) {
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: matches.map((match, index) => {
    const isExpanded = expandedMatchId === match.id;
    const matchTime = new Date(match.created_at).toLocaleTimeString(
      "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "overflow-hidden rounded-lg border border-border/60 bg-card/50",
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "flex w-full cursor-pointer items-center justify-between p-3 text-left transition-colors hover:bg-muted/10",
              onClick: () => setExpandedMatchId(isExpanded ? null : match.id),
              type: "button",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `flex h-6 w-6 items-center justify-center rounded-full font-mono font-semibold text-xs ${match.placement === 1 ? "border border-amber-500/30 bg-amber-500/20 text-amber-500" : "bg-muted text-muted-foreground"}`,
                      children: match.placement
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("p", { className: "font-bold text-foreground text-xs", children: [
                      "Partida #",
                      index + 1,
                      " ",
                      match.placement === 1 && "🏆"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "font-light text-[10px] text-muted-foreground", children: [
                      "Drop:",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground/80", children: match.poi }),
                      " ",
                      "• ",
                      matchTime
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono text-primary text-xs hover:underline", children: isExpanded ? "Ocultar" : "Detalles" })
              ]
            }
          ),
          isExpanded && /* @__PURE__ */ jsxs("div", { className: "space-y-3 border-border/40 border-t bg-card/40 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between border-border/20 border-b pb-2 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground/80", children: [
                  "Causa:",
                  " "
                ] }),
                match.elimination_cause
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground/80", children: [
                  "Loot:",
                  " "
                ] }),
                match.loot,
                " •",
                " ",
                /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground/80", children: [
                  "Hostilidad:",
                  " "
                ] }),
                match.hostility
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left font-sans text-xs", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-border/30 border-b font-mono text-[10px] text-muted-foreground uppercase", children: [
                /* @__PURE__ */ jsx("th", { className: "py-2", children: "Operador" }),
                /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Clase" }),
                /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "K / D / A" }),
                /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Downs / Rev" }),
                /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Desp / Final" }),
                /* @__PURE__ */ jsx("th", { className: "py-2 text-center", children: "Mente" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border/20", children: match.player_match_stats?.map(
                (stat) => {
                  const k = stat.kills || 0;
                  const d = stat.downs || 0;
                  const kdr = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);
                  const mentalColors = [
                    "text-red-500",
                    "text-amber-500",
                    "text-blue-500",
                    "text-emerald-500",
                    "text-green-500"
                  ];
                  return /* @__PURE__ */ jsxs(
                    "tr",
                    {
                      className: "hover:bg-muted/5",
                      children: [
                        /* @__PURE__ */ jsx("td", { className: "py-2 font-semibold text-foreground", children: stat.gamertag }),
                        /* @__PURE__ */ jsx("td", { className: "py-2 text-center", children: /* @__PURE__ */ jsx("span", { className: "rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary", children: stat.active_class }) }),
                        /* @__PURE__ */ jsxs("td", { className: "py-2 text-center font-mono", children: [
                          k,
                          " / ",
                          d,
                          " / ",
                          stat.assists,
                          " ",
                          /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                            "(",
                            kdr,
                            ")"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("td", { className: "py-2 text-center font-mono", children: [
                          stat.downs,
                          " / ",
                          stat.revives
                        ] }),
                        /* @__PURE__ */ jsxs("td", { className: "py-2 text-center", children: [
                          stat.respawned ? "✅" : "❌",
                          " /",
                          " ",
                          stat.end_game ? "✅" : "❌"
                        ] }),
                        /* @__PURE__ */ jsx(
                          "td",
                          {
                            className: `py-2 text-center font-bold ${mentalColors[stat.mental_state - 1]}`,
                            children: stat.mental_state
                          }
                        )
                      ]
                    },
                    stat.id
                  );
                }
              ) })
            ] }) })
          ] })
        ]
      },
      match.id
    );
  }) });
}

const CLASS_BADGES = {
  Asalto: "🚀 Asalto",
  Soporte: "🛡️ Soporte",
  Recon: "👁️ Recon",
  Ingeniero: "🔧 Ingeniero"
};
function SquadSidebar({
  squad,
  allSquads,
  onNewSquadClick,
  currentUser = null
}) {
  const isOwner = squad.owner_id === currentUser?.id;
  const myMember = squad.members.find((m) => m.user_id === currentUser?.id);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editClass, setEditClass] = useState("Asalto");
  const startEditing = (member) => {
    setEditingSlot(member.slot_number);
    setEditClass(member.favorite_class);
  };
  const handleSaveClass = async (slotNumber) => {
    try {
      const { error } = await actions.squad.updateMemberClass({
        squadId: squad.id,
        slotNumber,
        favoriteClass: editClass
      });
      if (error) {
        throw error;
      }
      setEditingSlot(null);
      window.location.reload();
    } catch (err) {
      console.error("Error updating member class:", err);
      alert("Error al actualizar el rol del operador.");
    }
  };
  const handleToggleActive = async (slotNumber, currentActive) => {
    try {
      const { error } = await actions.squad.setIsActive({
        squadId: squad.id,
        slotNumber,
        isActive: !currentActive
      });
      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (err) {
      console.error("Error toggling active state:", err);
      alert("Error al cambiar el estado del operador.");
    }
  };
  const handleLeaveSquad = async () => {
    if (!myMember) {
      return;
    }
    const confirmed = confirm(
      "¿Estás seguro de que deseas salir de este escuadrón?"
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.releaseSlot({
        squadId: squad.id,
        slotNumber: myMember.slot_number
      });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error leaving squad:", err);
      alert("Error al salir del escuadrón.");
    }
  };
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
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: squad.members.map((member) => {
        const hasUser = member.user_id !== null && member.user_id !== void 0;
        const isEditingThisSlot = editingSlot === member.slot_number;
        if (isEditingThisSlot) {
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "space-y-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-[9px] text-primary uppercase", children: [
                    "Clase de ",
                    member.gamertag
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground", children: [
                    "Nivel ",
                    member.level
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                    onChange: (e) => setEditClass(e.target.value),
                    value: editClass,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "Asalto", children: "Asalto" }),
                      /* @__PURE__ */ jsx("option", { value: "Soporte", children: "Soporte" }),
                      /* @__PURE__ */ jsx("option", { value: "Recon", children: "Recon" }),
                      /* @__PURE__ */ jsx("option", { value: "Ingeniero", children: "Ingeniero" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "cursor-pointer rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground",
                      onClick: () => setEditingSlot(null),
                      type: "button",
                      children: "Cancelar"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: "cursor-pointer rounded px-1.5 py-0.5 font-semibold text-[10px] text-primary hover:underline",
                      onClick: () => handleSaveClass(member.slot_number),
                      type: "button",
                      children: "Guardar"
                    }
                  )
                ] })
              ]
            },
            member.id
          );
        }
        const canEdit = isOwner && hasUser || member.user_id === currentUser?.id;
        const canToggle = isOwner && member.slot_number !== 1 && hasUser;
        let statusBadge = null;
        if (!hasUser) {
          statusBadge = /* @__PURE__ */ jsx(
            "span",
            {
              className: "shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-amber-500 uppercase",
              title: "Slot disponible para invitar",
              children: "Invitación"
            }
          );
        } else if (member.is_active) {
          statusBadge = /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded border border-green-500/20 bg-green-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-green-500 uppercase", children: "Activo" });
        } else {
          statusBadge = /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded border border-border bg-muted px-1 py-0.2 font-mono font-semibold text-[9px] text-muted-foreground uppercase", children: "AFK" });
        }
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex flex-col gap-2 rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-bold font-mono text-foreground text-xs uppercase", children: member.gamertag.slice(0, 2) }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "truncate font-bold text-foreground text-xs", children: member.gamertag }),
                    /* @__PURE__ */ jsxs("span", { className: "shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground", children: [
                      "Nivel ",
                      member.level
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "rounded-full border border-primary/10 bg-primary/5 px-2 py-0.5 font-medium text-[10px] text-primary", children: CLASS_BADGES[member.favorite_class] || member.favorite_class }),
                    statusBadge
                  ] })
                ] })
              ] }),
              (canEdit || canToggle) && /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 border-border/40 border-t pt-2", children: [
                canEdit && /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "cursor-pointer font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground",
                    onClick: () => startEditing(member),
                    type: "button",
                    children: "Editar Rol"
                  }
                ),
                canToggle && /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: `cursor-pointer font-mono text-[10px] transition-colors ${member.is_active ? "text-destructive transition-colors hover:text-destructive/80" : "text-green-500 transition-colors hover:text-green-400"}`,
                    onClick: () => handleToggleActive(
                      member.slot_number,
                      member.is_active
                    ),
                    type: "button",
                    children: member.is_active ? "Desactivar" : "Activar"
                  }
                )
              ] })
            ]
          },
          member.id
        );
      }) })
    ] }),
    !isOwner && myMember && /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-2 border-border border-t pt-4", children: /* @__PURE__ */ jsx(
      Button,
      {
        className: "w-full text-destructive hover:bg-destructive/10",
        onClick: handleLeaveSquad,
        size: "sm",
        variant: "ghost",
        children: "Salir del Escuadrón"
      }
    ) })
  ] });
}

function DashboardContent({
  squad,
  activeSession,
  sessionMatches = [],
  allSquads,
  currentUser = null,
  profile = null
}) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState("active-session");
  const [copiedCode, setCopiedCode] = useState(false);
  const [squadName, setSquadName] = useState(squad?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [activePlayers, setActivePlayers] = useState(() => {
    if (!squad) {
      return [];
    }
    return squad.members.map((member) => {
      const hasUser = member.user_id !== null && member.user_id !== void 0;
      let kills = 0;
      let downs = 0;
      let assists = 0;
      for (const match of sessionMatches) {
        const stats = match.player_match_stats?.find(
          (p) => p.gamertag === member.gamertag
        );
        if (stats) {
          kills += stats.kills || 0;
          downs += stats.downs || 0;
          assists += stats.assists || 0;
        }
      }
      return {
        slot_number: member.slot_number,
        status: hasUser && member.is_active ? "titular" : "ausente",
        gamertag: member.gamertag,
        favorite_class: member.favorite_class,
        active_class: member.favorite_class,
        user_id: member.user_id,
        kills,
        downs,
        assists
      };
    });
  });
  const isOwner = squad?.owner_id === currentUser?.id;
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2e3);
  };
  const handleDeleteSquad = async () => {
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este escuadrón? Esta acción es irreversible."
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.delete({ squadId: squad.id });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error deleting squad:", err);
      alert("Error al eliminar el escuadrón.");
    }
  };
  if (!squad || isCreatingNew) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8", children: /* @__PURE__ */ jsx(
      SquadWizard,
      {
        onCancel: squad ? () => setIsCreatingNew(false) : void 0,
        profile
      }
    ) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background md:flex-row", children: [
    /* @__PURE__ */ jsx(
      SquadSidebar,
      {
        allSquads,
        currentUser,
        onNewSquadClick: () => setIsCreatingNew(true),
        squad
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsx(
        MainTabs,
        {
          activeTab,
          isOwner,
          onTabChange: setActiveTab
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 p-6 md:p-8", children: [
        activeTab === "active-session" && /* @__PURE__ */ jsx(
          SessionPanel,
          {
            activePlayers,
            initialSession: activeSession,
            isOwner,
            sessionMatches,
            setActivePlayers,
            squad
          }
        ),
        activeTab === "history" && /* @__PURE__ */ jsx(SessionsHistory, { squadId: squad.id }),
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
        ] }),
        activeTab === "settings" && isOwner && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-6 flex items-center gap-2 border-border border-b pb-4 font-bold text-foreground text-sm tracking-tight", children: "Ajustes del Escuadrón" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-border bg-background p-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Código de Invitación" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-xs leading-relaxed", children: "Comparte este código con tus compañeros de equipo para que puedan unirse a la escuadra y reclamar sus operadores." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 rounded-md border border-border bg-muted/40 px-3.5 py-2.5", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold font-mono text-foreground text-lg tracking-wider", children: squad.invite_code || "BS-PENDIENTE" }),
                squad.invite_code && /* @__PURE__ */ jsx(
                  Button,
                  {
                    className: "flex h-8 items-center gap-1.5 text-xs",
                    onClick: () => handleCopyCode(squad.invite_code || ""),
                    size: "sm",
                    variant: "outline",
                    children: copiedCode ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-green-500" }),
                      /* @__PURE__ */ jsx("span", { children: "Copiado" })
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsx("span", { children: "Copiar" })
                    ] })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                className: "space-y-4 rounded-lg border border-border bg-background p-5",
                onSubmit: async (e) => {
                  e.preventDefault();
                  setNameError(null);
                  if (!squad) {
                    return;
                  }
                  if (squadName.trim().length < 3) {
                    setNameError(
                      "El nombre debe tener al menos 3 caracteres."
                    );
                    return;
                  }
                  try {
                    setIsSavingName(true);
                    const { error } = await actions.squad.update({
                      squadId: squad.id,
                      name: squadName.trim()
                    });
                    if (error) {
                      throw error;
                    }
                    window.location.reload();
                  } catch (err) {
                    console.error("Error updating squad name:", err);
                    setNameError(
                      "Error al actualizar el nombre del escuadrón."
                    );
                  } finally {
                    setIsSavingName(false);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Nombre del Escuadrón" }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-xs leading-relaxed", children: "Puedes modificar el nombre que identifica a tu escuadrón directamente aquí." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        className: "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-75",
                        disabled: isSavingName,
                        onChange: (e) => setSquadName(e.target.value),
                        type: "text",
                        value: squadName
                      }
                    ),
                    nameError && /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-destructive text-xs", children: nameError }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "mt-2 self-start",
                        disabled: isSavingName || squadName.trim() === (squad?.name || ""),
                        size: "sm",
                        type: "submit",
                        children: isSavingName ? "Guardando..." : "Guardar Nombre"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5 md:col-span-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-destructive text-sm", children: "Zona de Peligro" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-xs leading-relaxed", children: "Una vez que elimines el escuadrón, no podrás recuperar sus datos ni el historial de sesiones asociadas. Todos los slots e integrantes serán desvinculados permanentemente." })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "border border-destructive/20 text-destructive hover:bg-destructive/10",
                  onClick: handleDeleteSquad,
                  size: "sm",
                  variant: "ghost",
                  children: "Eliminar Escuadrón"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

const $$Squad = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Squad;
  const { user } = Astro2.locals;
  if (!user) {
    return Astro2.redirect("/");
  }
  const { data: profile } = await Astro2.callAction(actions.profile.get, {});
  if (!profile) {
    return Astro2.redirect("/dashboard/profile");
  }
  const { data } = await Astro2.callAction(actions.squad.get, {});
  const squad = data?.activeSquad || null;
  const allSquads = data?.allSquads || [];
  if (!squad) {
    return Astro2.redirect("/dashboard");
  }
  let activeSession = null;
  let sessionMatches = [];
  const { data: sessionData } = await Astro2.callAction(
    actions.session.getActive,
    {
      squadId: squad.id
    }
  );
  activeSession = sessionData || null;
  if (activeSession) {
    const { data: matchesData } = await Astro2.callAction(actions.match.list, {
      sessionId: activeSession.id
    });
    sessionMatches = matchesData || [];
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "Panel de Escuadrón — Battle Score",
    description: "Panel principal del escuadrón en Battle Score",
    ignoreTitleTemplate: true
  } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-background text-foreground flex flex-col"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} ${renderComponent($$result2, "DashboardContent", DashboardContent, { "squad": squad, "allSquads": allSquads, "activeSession": activeSession, "sessionMatches": sessionMatches, "currentUser": user, "profile": profile, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/dashboard-content", "client:component-export": "DashboardContent" })} </div> ` })}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/dashboard/squad.astro", void 0);

const $$file = "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/dashboard/squad.astro";
const $$url = "/dashboard/squad";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Squad,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
