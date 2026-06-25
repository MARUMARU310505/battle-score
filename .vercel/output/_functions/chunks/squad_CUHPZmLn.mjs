!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"56db3e9ad57767c9084e35b480a5bf0fdb259463"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cdc59488-f87e-4c76-88ab-d853e564862b",e._sentryDebugIdIdentifier="sentry-dbid-cdc59488-f87e-4c76-88ab-d853e564862b");}catch(e){}}();import './page-ssr_QO-zlnxr.mjs';
import { c as createComponent } from './astro-component_25w9uiXD.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_DNTirdqA.mjs';
import { r as renderComponent } from './entrypoint_a20r34gx.mjs';
import { a as actions } from './server_BdzjLQMt.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Activity, Calendar, BarChart3, Sparkles, Settings, UserCheck, UserMinus, Zap, ShieldAlert, Compass, Play, Power, Loader2, Trophy, Crosshair, Target, ChevronUp, ChevronDown, TrendingUp, Heart, HelpCircle, Check, Copy } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { B as Button, N as Nav } from './nav_C-42bQRO.mjs';
import { a as createSupabaseBrowserClient } from './supabase_CIDVnutF.mjs';
import { O as OperatorAvatar, c as cleanGamertag, S as SquadWizard, a as SquadSidebar } from './squad-wizard_Di_N7UsG.mjs';
import { $ as $$BaseLayout } from './base-layout_CIaPGD8v.mjs';

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
  return /* @__PURE__ */ jsx("div", { className: "border-border border-b bg-card/30 backdrop-blur-xs", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 xl:px-6 xl:px-8", children: /* @__PURE__ */ jsx(
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

const LoaderSpinner$1 = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    "aria-label": "Cargando",
    className: "mr-2 -ml-1 inline h-3.5 w-3.5 animate-spin text-current",
    fill: "none",
    role: "img",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx("title", { children: "Cargando" }),
      /* @__PURE__ */ jsx(
        "circle",
        {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          className: "opacity-75",
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
          fill: "currentColor"
        }
      )
    ]
  }
);
const ELIMINATION_CAUSES = [
  "Ninguna (Victoria)",
  "Encuentro Directo (Gunfight)",
  "Flanqueo",
  "Sniper / Larga Distancia",
  "Tercero en Discordia (Third Party)",
  "Emboscada",
  "Falta de Rotación / Gas",
  "Ataque Aéreo / Rachas",
  "Falta de Recursos (Placas/Balas)",
  "Desconexión / AFK",
  "Otro"
];
function MatchForm({
  session,
  activePlayers,
  onCancel,
  onSuccess,
  isOwner = false,
  currentUserId = null,
  setSession
}) {
  const sessionId = session.id;
  const [loading, setLoading] = useState(false);
  const [isSavingMatch, setIsSavingMatch] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(null);
  const [error, setError] = useState(null);
  const draft = session.match_registration_draft || {
    poi: "Desconocido",
    placement: 1,
    hostility: "Media",
    loot: "Normal",
    eliminationCause: "Ninguna",
    playerStats: []
  };
  const [poi, setPoi] = useState(draft.poi || "Desconocido");
  const [placement, setPlacement] = useState(draft.placement || 1);
  const [hostility, setHostility] = useState(
    draft.hostility || "Media"
  );
  const [loot, setLoot] = useState(
    draft.loot || "Normal"
  );
  const [eliminationCause, setEliminationCause] = useState(
    draft.eliminationCause || "Ninguna"
  );
  const currentUserGamertag = activePlayers.find((p) => p.user_id === currentUserId)?.gamertag || null;
  const [playerStats, setPlayerStats] = useState(() => {
    const dbStats = draft.playerStats || [];
    const linkedGamertags = activePlayers.filter((p) => p.user_id !== null && p.user_id !== void 0).map((p) => p.gamertag);
    if (dbStats.length > 0) {
      return dbStats.filter(
        // biome-ignore lint/suspicious/noExplicitAny: db stats type
        (stat) => linkedGamertags.includes(stat.gamertag)
      );
    }
    const playingMembers = activePlayers.filter(
      (p) => p.status !== "ausente" && p.user_id !== null && p.user_id !== void 0
    );
    return playingMembers.map((p) => ({
      userId: p.user_id || null,
      gamertag: p.gamertag,
      activeClass: p.active_class,
      downs: 0,
      kills: 0,
      assists: 0,
      revives: 0,
      respawned: false,
      endGame: false,
      mentalState: 3,
      avatarSeed: p.avatar_seed || null
    }));
  });
  useEffect(() => {
    const activeDraft = session.match_registration_draft;
    if (!activeDraft) {
      return;
    }
    setPoi(activeDraft.poi || "Desconocido");
    setPlacement(activeDraft.placement || 1);
    setHostility(activeDraft.hostility || "Media");
    setLoot(activeDraft.loot || "Normal");
    setEliminationCause(activeDraft.eliminationCause || "Ninguna");
    setPlayerStats((prev) => {
      const dbStats = activeDraft.playerStats || [];
      const linkedGamertags = activePlayers.filter((p) => p.user_id !== null && p.user_id !== void 0).map((p) => p.gamertag);
      return dbStats.filter((stat) => linkedGamertags.includes(stat.gamertag)).map((dbStat) => {
        const isCurrentUser = dbStat.userId === currentUserId || dbStat.gamertag === currentUserGamertag;
        const isReadyInDb = session.ready_players?.includes(
          dbStat.gamertag
        );
        if (isCurrentUser && !isReadyInDb) {
          const localMatch = prev.find(
            (p) => p.gamertag === dbStat.gamertag
          );
          return localMatch || dbStat;
        }
        if (isOwner && !isReadyInDb) {
          const localMatch = prev.find(
            (p) => p.gamertag === dbStat.gamertag
          );
          return localMatch || dbStat;
        }
        return dbStat;
      });
    });
  }, [
    session.match_registration_draft,
    session.ready_players,
    currentUserId,
    currentUserGamertag,
    isOwner,
    activePlayers
  ]);
  const handleGeneralInfoChange = async (field, value) => {
    if (!isOwner) {
      return;
    }
    const updatedDraft = {
      poi,
      placement,
      hostility,
      loot,
      eliminationCause,
      playerStats,
      [field]: value
    };
    if (field === "placement") {
      updatedDraft.placement = value;
      if (value === 1) {
        setEliminationCause("Ninguna (Victoria)");
        updatedDraft.eliminationCause = "Ninguna (Victoria)";
      } else if (eliminationCause === "Ninguna" || eliminationCause === "Ninguna (Victoria)" || eliminationCause === "Victoria") {
        setEliminationCause("Encuentro Directo (Gunfight)");
        updatedDraft.eliminationCause = "Encuentro Directo (Gunfight)";
      }
    }
    if (field === "poi") {
      setPoi(value);
    }
    if (field === "placement") {
      setPlacement(value);
    }
    if (field === "hostility") {
      setHostility(value);
    }
    if (field === "loot") {
      setLoot(value);
    }
    if (field === "eliminationCause") {
      setEliminationCause(value);
    }
    try {
      const { data, error: actionError } = await actions.session.updateMatchRegistrationDraft({
        sessionId,
        draft: updatedDraft
      });
      if (actionError) {
        throw actionError;
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error updating draft general info:", err);
    }
  };
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
  const handleToggleReady = async (gamertag, currentStat) => {
    const isCurrentlyReady = session.ready_players?.includes(gamertag);
    setLoadingPlayer(gamertag);
    setLoading(true);
    setError(null);
    try {
      const { data, error: actionError } = await actions.session.togglePlayerReady({
        sessionId,
        userId: currentStat.userId || null,
        gamertag,
        isReady: !isCurrentlyReady,
        playerStats: isCurrentlyReady ? void 0 : currentStat
      });
      if (actionError) {
        throw new Error(actionError.message || "Error al actualizar estado.");
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error toggling ready status:", err);
      setError(
        err instanceof Error ? err.message : "Error al cambiar el estado de listo."
      );
    } finally {
      setLoading(false);
      setLoadingPlayer(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (placement < 1) {
      setError("La posición debe ser mayor o igual a 1.");
      return;
    }
    setError(null);
    setLoading(true);
    setIsSavingMatch(true);
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
    } finally {
      setLoading(false);
      setIsSavingMatch(false);
    }
  };
  const allReady = playerStats.every(
    (p) => session.ready_players?.includes(p.gamertag)
  );
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm", children: [
    isSavingMatch && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/85 backdrop-blur-[2px]", children: /* @__PURE__ */ jsxs("div", { className: "fade-in zoom-in-95 flex max-w-xs animate-in flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-lg duration-200", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          className: "h-8 w-8 animate-spin text-primary",
          fill: "none",
          viewBox: "0 0 24 24",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            /* @__PURE__ */ jsx(
              "circle",
              {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                className: "opacity-75",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                fill: "currentColor"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-foreground text-sm tracking-tight", children: "Guardando Partida" }),
        /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "Guardando partida y estadísticas..." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 border-border/40 border-b pb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm tracking-tight", children: "Registrar Partida" }),
      /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "Completa los datos de la partida y las estadísticas de los operadores en una sola vista" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-xs", children: error }),
    /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-border/50 bg-background/20 p-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "border-border/20 border-b pb-2 font-bold text-foreground text-xs uppercase tracking-wider", children: [
          "1. Información General de la Partida",
          " ",
          !isOwner && /* @__PURE__ */ jsx("span", { className: "font-normal text-[10px] text-amber-500 lowercase italic", children: "(solo lectura para invitados)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3", children: [
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
                className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                disabled: !isOwner,
                id: "match-poi",
                onChange: (e) => handleGeneralInfoChange("poi", e.target.value),
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
                className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                disabled: !isOwner,
                id: "match-placement",
                min: "1",
                onChange: (e) => {
                  const val = Number.parseInt(e.target.value, 10) || 1;
                  handleGeneralInfoChange("placement", val);
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
                className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                disabled: !isOwner,
                id: "match-hostility",
                onChange: (e) => handleGeneralInfoChange("hostility", e.target.value),
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
                className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                disabled: !isOwner,
                id: "match-loot",
                onChange: (e) => handleGeneralInfoChange("loot", e.target.value),
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
              "select",
              {
                className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                disabled: !isOwner || placement === 1,
                id: "match-cause",
                onChange: (e) => handleGeneralInfoChange("eliminationCause", e.target.value),
                value: placement === 1 ? "Ninguna (Victoria)" : eliminationCause,
                children: placement === 1 ? /* @__PURE__ */ jsx("option", { value: "Ninguna (Victoria)", children: "Ninguna (Victoria)" }) : ELIMINATION_CAUSES.filter(
                  (c) => c !== "Ninguna (Victoria)"
                ).map((cause) => /* @__PURE__ */ jsx("option", { value: cause, children: cause }, cause))
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-border/50 bg-background/20 p-4", children: [
        /* @__PURE__ */ jsxs("h4", { className: "border-border/20 border-b pb-2 font-bold text-foreground text-xs uppercase tracking-wider", children: [
          "2. Estadísticas de los Operadores",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-normal text-[10px] text-amber-500 lowercase italic", children: "(solo puedes modificar tu propio slot)" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[50vh] space-y-4 overflow-y-auto pr-1", children: playerStats.map((stat, idx) => {
          const isCurrentUser = stat.userId === currentUserId || stat.gamertag === currentUserGamertag;
          const isPlayerReady = session.ready_players?.includes(
            stat.gamertag
          );
          const canEditPlayer = (isOwner || isCurrentUser) && !isPlayerReady;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `relative space-y-3 overflow-hidden rounded-lg border p-4 transition-colors duration-200 ${isPlayerReady ? "border-green-500/20 bg-green-500/5 opacity-90" : canEditPlayer ? "border-primary/20 bg-primary/5" : "border-border/60 bg-background/30 opacity-70"}`,
              children: [
                loadingPlayer === stat.gamertag && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]", children: /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    "aria-label": "Cargando",
                    className: "h-6 w-6 animate-spin text-primary",
                    fill: "none",
                    role: "img",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: [
                      /* @__PURE__ */ jsx("title", { children: "Cargando" }),
                      /* @__PURE__ */ jsx(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          className: "opacity-75",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                          fill: "currentColor"
                        }
                      )
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-border/40 border-b pb-2 sm:flex-row sm:items-center sm:justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(
                        OperatorAvatar,
                        {
                          avatarSeed: stat.avatarSeed,
                          className: "h-5 w-5",
                          gamertag: stat.gamertag
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `font-bold text-xs ${isCurrentUser ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                          children: cleanGamertag(stat.gamertag)
                        }
                      )
                    ] }),
                    isCurrentUser && /* @__PURE__ */ jsx("span", { className: "rounded bg-emerald-500 px-1.5 py-0.5 font-semibold text-[8px] text-white uppercase dark:bg-emerald-600", children: "Tú" }),
                    /* @__PURE__ */ jsx(
                      "select",
                      {
                        className: "rounded border border-border bg-background px-2 py-0.5 font-mono font-sans text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                        disabled: !canEditPlayer,
                        onChange: (e) => handleStatChange(idx, "activeClass", e.target.value),
                        value: stat.activeClass,
                        children: ["Asalto", "Soporte", "Recon", "Ingeniero"].map(
                          (cls) => /* @__PURE__ */ jsx("option", { value: cls, children: cls }, cls)
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:justify-end", children: [
                    isPlayerReady ? /* @__PURE__ */ jsx("span", { className: "rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-semibold text-[9px] text-green-500", children: "Listo 🎯" }) : /* @__PURE__ */ jsx("span", { className: "rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-semibold text-[9px] text-amber-500", children: "Llenando..." }),
                    (isOwner || isCurrentUser) && /* @__PURE__ */ jsxs(
                      Button,
                      {
                        className: `flex h-6 items-center gap-1 px-2 font-medium text-[10px] transition-all ${isPlayerReady ? "border-amber-500/30 text-amber-500 hover:bg-amber-500/10" : "bg-green-600 text-white hover:bg-green-700"}`,
                        disabled: loading,
                        onClick: () => handleToggleReady(stat.gamertag, stat),
                        size: "sm",
                        type: "button",
                        variant: isPlayerReady ? "outline" : "default",
                        children: [
                          loadingPlayer === stat.gamertag && /* @__PURE__ */ jsx(LoaderSpinner$1, {}),
                          isPlayerReady ? "Modificar" : "Marcar Listo"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 xl:grid-cols-4", children: [
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
                        className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                        disabled: !canEditPlayer,
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
                        className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                        disabled: !canEditPlayer,
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
                        className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                        disabled: !canEditPlayer,
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
                        className: "w-full rounded border border-border bg-background px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                        disabled: !canEditPlayer,
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
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-end", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 py-1", children: [
                    /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          checked: stat.respawned,
                          className: "rounded border-border bg-background text-primary focus:ring-primary disabled:opacity-50",
                          disabled: !canEditPlayer,
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
                          className: "rounded border-border bg-background text-primary focus:ring-primary disabled:opacity-50",
                          disabled: !canEditPlayer,
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
                              className: `flex-1 cursor-pointer rounded border py-1 text-center font-mono text-[9px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? activeColor : colors[lvl - 1]}`,
                              disabled: !canEditPlayer,
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
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-2 border-border/40 border-t pt-4", children: [
        !allReady && isOwner && /* @__PURE__ */ jsx("p", { className: "text-amber-500 text-xs", children: 'Esperando a que todos los operadores marquen "Listo" para registrar la partida.' }),
        /* @__PURE__ */ jsx("div", { className: "flex w-full justify-end gap-3", children: isOwner ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { onClick: onCancel, type: "button", variant: "outline", children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { disabled: loading || !allReady, type: "submit", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(LoaderSpinner$1, {}),
            "Guardando..."
          ] }) : "Guardar Partida" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "w-full py-2 text-center text-muted-foreground text-xs italic", children: 'Completa tus estadísticas y haz clic en "Marcar Listo" para que el líder de la escuadra pueda guardar la partida.' }) })
      ] })
    ] })
  ] });
}

function SquadHeader({
  activePlayers,
  currentUserId = null,
  isOwner = false,
  squadId,
  setSquadState
}) {
  const [loadingSlot, setLoadingSlot] = useState(null);
  const activePlaying = activePlayers.filter((p) => p.status !== "ausente");
  const hasAnyStats = activePlaying.some(
    (p) => (p.kills || 0) > 0 || (p.downs || 0) > 0 || (p.assists || 0) > 0
  );
  let mvpSlot = null;
  let mochilaSlot = null;
  if (hasAnyStats && activePlaying.length >= 2) {
    const getKDR = (p) => {
      const k = p.kills || 0;
      const d = p.downs || 0;
      return d > 0 ? k / d : k;
    };
    const sortedForMvp = [...activePlaying].sort((a, b) => {
      const kdrA = getKDR(a);
      const kdrB = getKDR(b);
      if (kdrB !== kdrA) {
        return kdrB - kdrA;
      }
      const killsA = a.kills || 0;
      const killsB = b.kills || 0;
      if (killsB !== killsA) {
        return killsB - killsA;
      }
      const assistsA = a.assists || 0;
      const assistsB = b.assists || 0;
      if (assistsB !== assistsA) {
        return assistsB - assistsA;
      }
      const downsA = a.downs || 0;
      const downsB = b.downs || 0;
      return downsA - downsB;
    });
    const sortedForMochila = [...activePlaying].sort((a, b) => {
      const kdrA = getKDR(a);
      const kdrB = getKDR(b);
      if (kdrA !== kdrB) {
        return kdrA - kdrB;
      }
      const killsA = a.kills || 0;
      const killsB = b.kills || 0;
      if (killsA !== killsB) {
        return killsA - killsB;
      }
      const assistsA = a.assists || 0;
      const assistsB = b.assists || 0;
      if (assistsA !== assistsB) {
        return assistsA - assistsB;
      }
      const downsA = a.downs || 0;
      const downsB = b.downs || 0;
      return downsB - downsA;
    });
    const firstMvp = sortedForMvp[0];
    const firstMochila = sortedForMochila[0];
    if (firstMvp && firstMochila && firstMvp.slot_number !== firstMochila.slot_number) {
      mvpSlot = firstMvp.slot_number;
      mochilaSlot = firstMochila.slot_number;
    }
  }
  const handleStatusChange = async (slot, status) => {
    if (!squadId) return;
    const player = activePlayers.find((p) => p.slot_number === slot);
    if (!player) return;
    setLoadingSlot(slot);
    try {
      const { error } = await actions.squad.updateMemberStatus({
        squadId,
        slotNumber: slot,
        status,
        gamertag: player.gamertag
      });
      if (error) {
        throw error;
      }
      if (setSquadState) {
        setSquadState((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            // biome-ignore lint/suspicious/noExplicitAny: m mapper uses any
            members: prev.members.map(
              (m) => m.slot_number === slot ? { ...m, status } : m
            )
          };
        });
      }
    } catch (err) {
      console.error("Error updating member status in DB:", err);
      alert("Error al cambiar el estado del operador.");
    } finally {
      setLoadingSlot(null);
    }
  };
  const showStatusControls = isOwner && !!squadId;
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: activePlayers.map((player) => {
    const isAbsent = player.status === "ausente";
    const isMe = !isAbsent && player.user_id === currentUserId;
    const isSlotLoading = loadingSlot === player.slot_number;
    const hasUser = player.user_id !== null && player.user_id !== void 0;
    const k = player.kills || 0;
    const d = player.downs || 0;
    const a = player.assists || 0;
    const kdr = d > 0 ? k / d : k;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative overflow-hidden rounded-lg border p-4 transition-all duration-200 ${isAbsent ? "border-border/40 bg-card/10 opacity-50" : "border-border bg-card shadow-xs hover:border-border/80"}`,
        children: [
          isSlotLoading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px]", children: /* @__PURE__ */ jsxs(
            "svg",
            {
              "aria-label": "Cargando",
              className: "h-5 w-5 animate-spin text-primary",
              fill: "none",
              role: "img",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsx("title", { children: "Cargando" }),
                /* @__PURE__ */ jsx(
                  "circle",
                  {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    className: "opacity-75",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                    fill: "currentColor"
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: [
                "Operador #",
                player.slot_number
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-0.5 flex items-center gap-2", children: [
                !isAbsent && /* @__PURE__ */ jsx(
                  OperatorAvatar,
                  {
                    avatarSeed: player.avatar_seed,
                    className: "h-6 w-6",
                    gamertag: player.gamertag
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "h3",
                  {
                    className: `truncate font-bold text-sm ${isMe ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                    children: [
                      isAbsent ? "Ausente" : cleanGamertag(player.gamertag),
                      " ",
                      isMe && "(Tú)"
                    ]
                  }
                )
              ] }),
              !isAbsent && player.slot_number === mvpSlot && /* @__PURE__ */ jsx("span", { className: "mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 font-bold font-mono text-[9px] text-amber-500 uppercase tracking-wider", children: "🏆 MVP" }),
              !isAbsent && player.slot_number === mochilaSlot && /* @__PURE__ */ jsx("span", { className: "mt-1.5 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/15 px-2 py-0.5 font-bold font-mono text-[9px] text-red-500 uppercase tracking-wider", children: "🎒 Mochila" })
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
          ] }),
          showStatusControls && /* @__PURE__ */ jsx("div", { className: "mt-3 flex items-center gap-1.5 border-border/30 border-t pt-3", children: hasUser ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: `flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${player.status === "titular" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                disabled: isSlotLoading,
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
                className: `flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 font-medium text-[10px] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${player.status === "ausente" ? "bg-destructive/15 text-destructive hover:bg-destructive/25" : "border border-border bg-background text-muted-foreground hover:bg-muted"}`,
                disabled: isSlotLoading,
                onClick: () => handleStatusChange(player.slot_number, "ausente"),
                type: "button",
                children: [
                  /* @__PURE__ */ jsx(UserMinus, { className: "h-3 w-3" }),
                  "Ausente"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsx("span", { className: "w-full text-center rounded border border-border/30 bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground/60 italic", children: "Slot disponible (Invitación)" }) })
        ]
      },
      player.slot_number
    );
  }) });
}

function SessionLiveStats({
  sessionMatches,
  activePlayers,
  currentUserId
}) {
  if (sessionMatches.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-4 text-3xl", children: "📊" }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Aún no hay datos para esta sesión" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "Registra al menos una partida para visualizar el rendimiento en vivo del escuadrón." })
    ] });
  }
  let totalKills = 0;
  let totalDowns = 0;
  let totalAssists = 0;
  let totalRevives = 0;
  let totalMatches = sessionMatches.length;
  let totalPlacements = 0;
  let totalWins = 0;
  for (const m of sessionMatches) {
    totalPlacements += m.placement || 0;
    if (m.placement === 1) {
      totalWins++;
    }
    if (m.player_match_stats) {
      for (const p of m.player_match_stats) {
        totalKills += p.kills || 0;
        totalDowns += p.downs || 0;
        totalAssists += p.assists || 0;
        totalRevives += p.revives || 0;
      }
    }
  }
  const sessionKdr = totalDowns > 0 ? (totalKills / totalDowns).toFixed(2) : totalKills.toFixed(2);
  const avgPlacement = (totalPlacements / totalMatches).toFixed(1);
  const winRate = (totalWins / totalMatches * 100).toFixed(0);
  for (const m of sessionMatches) {
    if (m.player_match_stats) {
      for (const p of m.player_match_stats) {
        p.active_class || "Asalto";
      }
    }
  }
  const poiStats = {};
  for (const m of sessionMatches) {
    const poi = m.poi || "Desconocido";
    if (!poiStats[poi]) {
      poiStats[poi] = { count: 0, totalPlacement: 0, wins: 0 };
    }
    poiStats[poi].count++;
    poiStats[poi].totalPlacement += m.placement || 0;
    if (m.placement === 1) {
      poiStats[poi].wins++;
    }
  }
  const sortedPois = Object.entries(poiStats).map(([name, stat]) => ({
    name,
    count: stat.count,
    avgPlacement: stat.totalPlacement / stat.count,
    winRate: stat.wins / stat.count * 100
  })).sort((a, b) => a.avgPlacement - b.avgPlacement);
  const alerts = [];
  const suggestions = [];
  if (totalMatches >= 5) {
    alerts.push(`🔋 Sesión Prolongada: Han completado ${totalMatches} partidas.`);
    suggestions.push("Recomendación: Estiren las piernas, hidratación rápida y un descanso de 5 minutos antes del próximo despliegue.");
  }
  const lastMatch = sessionMatches[sessionMatches.length - 1];
  if (lastMatch && lastMatch.player_match_stats && lastMatch.player_match_stats.length > 0) {
    const mentalStates = lastMatch.player_match_stats.map((p) => p.mental_state || 3);
    const avgMental = mentalStates.reduce((a, b) => a + b, 0) / mentalStates.length;
    if (avgMental < 3) {
      alerts.push("⚠️ Alerta de Tilt / Frustración: El estado de ánimo promedio del equipo bajó de la media tras la última partida.");
      suggestions.push("Estrategia Táctica: Cambiar a estilo defensivo. Evitar drop zones congestionadas (Hot Drops) y enfocarse en control periférico.");
    }
  }
  const worstPlacements = sessionMatches.filter((m) => m.placement >= 10).length;
  if (worstPlacements >= 3) {
    alerts.push("📉 Mala Racha: Tienen 3 o más partidas con rendimiento en Top 10+.");
    suggestions.push("Ajuste de Composición: Revisen los roles. Aseguren al menos un Soporte (Médico) e Ingeniero para control de vehículos.");
  }
  return /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-5 animate-in fade-in-50 duration-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/20 p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase", children: "KDR " }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-bold text-xl text-primary font-sans", children: sessionKdr })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/20 p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase", children: "Partidas" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-bold text-xl text-foreground font-sans", children: totalMatches })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/20 p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase", children: "Prom. Puesto" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 font-bold text-xl text-foreground font-sans", children: [
          "#",
          avgPlacement
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/20 p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[9px] text-muted-foreground uppercase", children: "Win Rate" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 font-bold text-xl text-emerald-500 font-sans", children: [
          winRate,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card/40 p-4", children: [
      /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-1.5 font-bold text-foreground text-xs uppercase tracking-wider mb-3", children: [
        /* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5 text-primary" }),
        " Combate en la Sesión"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: activePlayers.map((player) => {
        const isMe = player.user_id === currentUserId;
        let kills = 0;
        let downs = 0;
        let assists = 0;
        let revives = 0;
        for (const m of sessionMatches) {
          const stat = m.player_match_stats?.find((p) => p.gamertag === player.gamertag);
          if (stat) {
            kills += stat.kills || 0;
            downs += stat.downs || 0;
            assists += stat.assists || 0;
            revives += stat.revives || 0;
          }
        }
        const kdr = downs > 0 ? (kills / downs).toFixed(2) : kills.toFixed(2);
        return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between rounded-md p-2 text-xs border ${isMe ? "bg-primary/5 border-primary/20" : "bg-background/20 border-border/40"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("span", { className: `font-bold ${isMe ? "text-emerald-400" : "text-foreground"}`, children: [
              cleanGamertag(player.gamertag),
              " ",
              isMe && "(Tú)"
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
              "Clase activa: ",
              /* @__PURE__ */ jsx("span", { className: "font-mono text-foreground", children: player.active_class })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-right font-mono shrink-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-[10px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "K/D/A:" }),
              " ",
              kills,
              "/",
              downs,
              "/",
              assists
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] border-l border-border/30 pl-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "KDR:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: kdr })
            ] })
          ] })
        ] }, player.slot_number);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-4", children: [
      /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-1.5 font-bold text-primary text-xs uppercase tracking-wider mb-2.5", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4" }),
        " Coach Táctico (Fatiga & Tilt)"
      ] }),
      alerts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "🟢 Escuadrón estable. Concentración óptima. Sigan comunicando y rotando de forma limpia." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: alerts.map((alert, idx) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-primary text-xs", children: alert }),
        suggestions[idx] && /* @__PURE__ */ jsx("p", { className: "font-light text-foreground text-xs leading-relaxed pl-4 border-l-2 border-border/60", children: suggestions[idx] })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card/40 p-4", children: [
      /* @__PURE__ */ jsxs("h4", { className: "flex items-center gap-1.5 font-bold text-foreground text-xs uppercase tracking-wider mb-3", children: [
        /* @__PURE__ */ jsx(Compass, { className: "h-3.5 w-3.5 text-muted-foreground" }),
        " Drop Zones Hoy"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: sortedPois.slice(0, 3).map((poi) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs border-border/20 border-b pb-2 last:border-0 last:pb-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: poi.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
            "Sembrado ",
            poi.count,
            " ",
            poi.count === 1 ? "vez" : "veces"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right font-mono", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Puesto Promedio:" }),
          " ",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-primary", children: [
            "#",
            poi.avgPlacement.toFixed(1)
          ] })
        ] })
      ] }, poi.name)) })
    ] })
  ] });
}

const LoaderSpinner = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    "aria-label": "Cargando",
    className: "mr-2 -ml-1 inline h-3.5 w-3.5 animate-spin text-current",
    fill: "none",
    role: "img",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx("title", { children: "Cargando" }),
      /* @__PURE__ */ jsx(
        "circle",
        {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          className: "opacity-75",
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
          fill: "currentColor"
        }
      )
    ]
  }
);
function SessionPanel({
  squad,
  initialSession,
  sessionMatches,
  activePlayers,
  setActivePlayers,
  isOwner,
  currentUser = null,
  setSession,
  setSquadState
}) {
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const [subTab, setSubTab] = useState("list");
  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError("El nombre de la sesión es requerido.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data, error: actionError } = await actions.session.create({
        name: sessionName,
        squadId: squad.id
      });
      if (actionError) {
        throw actionError;
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión de juego"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCloseSession = async () => {
    if (!initialSession) {
      return;
    }
    setError(null);
    setLoading(true);
    setIsClosing(true);
    try {
      const { error: actionError } = await actions.session.close({
        sessionId: initialSession.id
      });
      if (actionError) {
        throw actionError;
      }
      if (setSession) {
        setSession(null);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al cerrar sesión de juego"
      );
    } finally {
      setLoading(false);
      setIsClosing(false);
    }
  };
  const handleStartRegistration = async () => {
    if (!initialSession) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const playersForDraft = activePlayers.filter(
        (p) => p.status !== "ausente" && p.user_id !== null && p.user_id !== void 0
      ).map((p) => ({
        userId: p.user_id || null,
        gamertag: p.gamertag,
        activeClass: p.active_class,
        avatarSeed: p.avatar_seed || null
      }));
      const { data, error: actionError } = await actions.session.startMatchRegistration({
        sessionId: initialSession.id,
        players: playersForDraft
      });
      if (actionError) {
        throw new Error(actionError.message || "Error al iniciar el registro.");
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error starting match registration:", err);
      setError(
        err instanceof Error ? err.message : "Error al iniciar el registro de partida."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancelRegistration = async () => {
    if (!initialSession) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: actionError } = await actions.session.cancelMatchRegistration({
        sessionId: initialSession.id
      });
      if (actionError) {
        throw new Error(
          actionError.message || "Error al cancelar el registro."
        );
      }
      if (setSession && data) {
        setSession(data);
      }
    } catch (err) {
      console.error("Error cancelling match registration:", err);
      setError(
        err instanceof Error ? err.message : "Error al cancelar el registro de partida."
      );
    } finally {
      setLoading(false);
    }
  };
  if (!initialSession) {
    if (!isOwner) {
      return /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm xl:p-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/20", children: /* @__PURE__ */ jsx(Calendar, { className: "h-6 w-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 font-bold text-foreground text-lg tracking-tight", children: "Sin Sesión Activa" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-light text-muted-foreground text-sm leading-relaxed", children: "A la espera de que el líder del escuadrón comience una sesión de juego." })
      ] }) });
    }
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm xl:p-8", children: [
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
        /* @__PURE__ */ jsx(Button, { className: "w-full", disabled: loading, type: "submit", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(LoaderSpinner, {}),
          "Creando..."
        ] }) : "Crear Sesión Activa" })
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
  return /* @__PURE__ */ jsxs("div", { className: "relative space-y-6", children: [
    isClosing && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-30 flex flex-col items-center justify-center rounded-lg bg-background/75 backdrop-blur-[2px]", children: /* @__PURE__ */ jsxs("div", { className: "fade-in zoom-in-95 flex max-w-xs animate-in flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-lg duration-200", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          className: "h-8 w-8 animate-spin text-primary",
          fill: "none",
          viewBox: "0 0 24 24",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            /* @__PURE__ */ jsx(
              "circle",
              {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                className: "opacity-75",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                fill: "currentColor"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-foreground text-sm tracking-tight", children: "Finalizando Sesión" }),
        /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "Guardando datos de la sesión..." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-4 xl:flex-row xl:items-center", children: [
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
      isOwner && /* @__PURE__ */ jsx(
        Button,
        {
          className: "flex h-auto items-center gap-1.5 px-4 py-2",
          disabled: loading,
          onClick: handleCloseSession,
          size: "sm",
          variant: "destructive",
          children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(LoaderSpinner, {}),
            "Cerrando..."
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" }),
            "Finalizar Sesión"
          ] })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-destructive/10 p-3 text-destructive text-xs", children: error }),
    /* @__PURE__ */ jsx(
      SquadHeader,
      {
        activePlayers,
        currentUserId: currentUser?.id,
        isOwner,
        squadId: squad.id,
        setSquadState
      }
    ),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: initialSession.is_registering_match ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      isOwner ? /* @__PURE__ */ jsxs(
        Button,
        {
          disabled: loading,
          onClick: handleCancelRegistration,
          size: "sm",
          variant: "outline",
          children: [
            loading && /* @__PURE__ */ jsx(LoaderSpinner, {}),
            "Volver al Listado (Cancelar)"
          ]
        }
      ) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/10 p-3 font-medium text-amber-500 text-xs", children: /* @__PURE__ */ jsx("span", { children: "El líder de la escuadra está registrando una partida. Completa tus estadísticas." }) }),
      /* @__PURE__ */ jsx(
        MatchForm,
        {
          activePlayers,
          currentUserId: currentUser?.id,
          isOwner,
          onCancel: handleCancelRegistration,
          onSuccess: () => {
            handleCancelRegistration();
          },
          session: initialSession,
          setSession
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-border/40 border-b pb-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSubTab("list"),
              className: `font-bold text-xs uppercase tracking-wider pb-1 border-b-2 transition-all cursor-pointer ${subTab === "list" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
              children: [
                "Partidas (",
                sessionMatches.length,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSubTab("stats"),
              className: `font-bold text-xs uppercase tracking-wider pb-1 border-b-2 transition-all cursor-pointer ${subTab === "stats" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
              children: "Rendimiento en Vivo"
            }
          )
        ] }),
        isOwner && initialSession && /* @__PURE__ */ jsxs(
          Button,
          {
            className: "h-auto px-4 py-2 shrink-0",
            disabled: loading,
            onClick: handleStartRegistration,
            size: "sm",
            children: [
              loading && /* @__PURE__ */ jsx(LoaderSpinner, {}),
              "+ Registrar Partida"
            ]
          }
        )
      ] }),
      subTab === "stats" ? /* @__PURE__ */ jsx(
        SessionLiveStats,
        {
          sessionMatches,
          activePlayers,
          currentUserId: currentUser?.id
        }
      ) : sessionMatches.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-12 text-center", children: [
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
                          className: `flex h-6 w-6 items-center justify-center rounded-full font-mono font-semibold text-xs ${match.placement === 1 ? "border border-amber-500/30 bg-amber-500/20 text-amber-500" : match.placement === 2 ? "border border-slate-300/40 bg-slate-300/20 text-slate-400 dark:text-slate-300" : match.placement === 3 ? "border border-amber-700/30 bg-amber-700/20 text-amber-700 dark:text-amber-600" : match.placement === 4 || match.placement === 5 ? "border border-blue-500/30 bg-blue-500/20 text-blue-500" : "bg-muted text-muted-foreground"}`,
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
                /* @__PURE__ */ jsx("div", { className: "hidden overflow-x-auto xl:block", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left font-sans text-xs", children: [
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
                            /* @__PURE__ */ jsx(
                              "td",
                              {
                                className: `py-2 font-semibold ${stat.user_id === currentUser?.id ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                                  /* @__PURE__ */ jsx(
                                    OperatorAvatar,
                                    {
                                      avatarSeed: stat.avatar_seed,
                                      className: "h-5 w-5",
                                      gamertag: stat.gamertag
                                    }
                                  ),
                                  /* @__PURE__ */ jsxs("span", { children: [
                                    cleanGamertag(stat.gamertag),
                                    " ",
                                    stat.user_id === currentUser?.id && "(Tú)"
                                  ] })
                                ] })
                              }
                            ),
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
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "block space-y-2.5 xl:hidden", children: match.player_match_stats?.map(
                  (stat) => {
                    const k = stat.kills || 0;
                    const d = stat.downs || 0;
                    const kdr = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);
                    const mentalColors = [
                      "text-red-500 bg-red-500/10 border-red-500/20",
                      "text-amber-500 bg-amber-500/10 border-amber-500/20",
                      "text-blue-500 bg-blue-500/10 border-blue-500/20",
                      "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                      "text-green-500 bg-green-500/10 border-green-500/20"
                    ];
                    const mentalLabels = [
                      "Tilt 😡",
                      "Fatiga 🥱",
                      "Normal 😐",
                      "Concentrado 🎯",
                      "Excelente 🔥"
                    ];
                    const mentalLabel = mentalLabels[stat.mental_state - 1] || `${stat.mental_state}`;
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "rounded-lg border border-border/50 bg-background/20 p-3 text-xs",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-border/20 border-b pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsx(
                                OperatorAvatar,
                                {
                                  avatarSeed: stat.avatar_seed,
                                  className: "h-5 w-5",
                                  gamertag: stat.gamertag
                                }
                              ),
                              /* @__PURE__ */ jsxs(
                                "span",
                                {
                                  className: `font-bold ${stat.user_id === currentUser?.id ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                                  children: [
                                    cleanGamertag(stat.gamertag),
                                    " ",
                                    stat.user_id === currentUser?.id && "(Tú)"
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary", children: stat.active_class })
                          ] }) }),
                          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-[11px]", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-light text-muted-foreground", children: "K/D/A (KDR):" }),
                              /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                                k,
                                "/",
                                d,
                                "/",
                                stat.assists,
                                " ",
                                /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-muted-foreground", children: [
                                  "(",
                                  kdr,
                                  ")"
                                ] })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-light text-muted-foreground", children: "Reanimaciones:" }),
                              /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-foreground", children: stat.revives })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-light font-sans text-muted-foreground", children: "Reaparecido:" }),
                              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: stat.respawned ? "Sí ✅" : "No ❌" })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-light font-sans text-muted-foreground", children: "Fase Final:" }),
                              /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: stat.end_game ? "Sí ✅" : "No ❌" })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "col-span-2 mt-1 flex items-center justify-between border-border/10 border-t pt-2", children: [
                              /* @__PURE__ */ jsx("span", { className: "font-light font-sans text-muted-foreground", children: "Estado Mental:" }),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `rounded border px-1.5 py-0.5 font-sans font-semibold text-[10px] ${mentalColors[stat.mental_state - 1]}`,
                                  children: mentalLabel
                                }
                              )
                            ] })
                          ] })
                        ]
                      },
                      stat.id
                    );
                  }
                ) })
              ] })
            ]
          },
          match.id
        );
      }) })
    ] }) }) })
  ] });
}

function SessionsHistory({
  squadId,
  currentUserId = null
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(null);
  const [sessionMatches, setSessionMatches] = useState(
    {}
  );
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error: actionError } = await actions.session.getHistory({
          squadId
        });
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
        const { data, error: actionError } = await actions.session.getDetail({
          sessionId
        });
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
        sessions.length === 1 ? "" : "es"
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
                    /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-3 xl:flex", children: [
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
            !isExpanded && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 border-border/40 border-t px-4 py-2 xl:hidden", children: [
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
            ] }) : !matches || matches.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs", children: "Esta sesión no tiene partidas registradas." }) }) : /* @__PURE__ */ jsx(
              MatchDetailList,
              {
                currentUserId,
                matches
              }
            ) })
          ]
        },
        session.id
      );
    }) })
  ] });
}
function MatchDetailList({
  matches,
  currentUserId
}) {
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
                      className: `flex h-6 w-6 items-center justify-center rounded-full font-mono font-semibold text-xs ${match.placement === 1 ? "border border-amber-500/30 bg-amber-500/20 text-amber-500" : match.placement === 2 ? "border border-slate-300/40 bg-slate-300/20 text-slate-400 dark:text-slate-300" : match.placement === 3 ? "border border-amber-700/30 bg-amber-700/20 text-amber-700 dark:text-amber-600" : match.placement === 4 || match.placement === 5 ? "border border-blue-500/30 bg-blue-500/20 text-blue-500" : "bg-muted text-muted-foreground"}`,
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
            /* @__PURE__ */ jsx("div", { className: "hidden overflow-x-auto xl:block", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left font-sans text-xs", children: [
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
                  return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/5", children: [
                    /* @__PURE__ */ jsx(
                      "td",
                      {
                        className: `py-2 font-semibold ${stat.user_id === currentUserId ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsx(
                            OperatorAvatar,
                            {
                              avatarSeed: stat.avatar_seed,
                              className: "h-5 w-5",
                              gamertag: stat.gamertag
                            }
                          ),
                          /* @__PURE__ */ jsxs("span", { children: [
                            cleanGamertag(stat.gamertag),
                            " ",
                            stat.user_id === currentUserId && "(Tú)"
                          ] })
                        ] })
                      }
                    ),
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
                  ] }, stat.id);
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "block space-y-2.5 xl:hidden", children: match.player_match_stats?.map((stat) => {
              const k = stat.kills || 0;
              const d = stat.downs || 0;
              const kdr = d > 0 ? (k / d).toFixed(2) : k.toFixed(2);
              const mentalColors = [
                "text-red-500 bg-red-500/10 border-red-500/20",
                "text-amber-500 bg-amber-500/10 border-amber-500/20",
                "text-blue-500 bg-blue-500/10 border-blue-500/20",
                "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                "text-green-500 bg-green-500/10 border-green-500/20"
              ];
              const mentalLabels = [
                "Tilt 😡",
                "Fatiga 🥱",
                "Normal 😐",
                "Concentrado 🎯",
                "Excelente 🔥"
              ];
              const mentalLabel = mentalLabels[stat.mental_state - 1] || `${stat.mental_state}`;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "rounded-lg border border-border/50 bg-background/20 p-3 text-xs",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-border/20 border-b pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsx(
                          OperatorAvatar,
                          {
                            avatarSeed: stat.avatar_seed,
                            className: "h-5 w-5",
                            gamertag: stat.gamertag
                          }
                        ),
                        /* @__PURE__ */ jsxs(
                          "span",
                          {
                            className: `font-bold ${stat.user_id === currentUserId ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                            children: [
                              cleanGamertag(stat.gamertag),
                              " ",
                              stat.user_id === currentUserId && "(Tú)"
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary", children: stat.active_class })
                    ] }) }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 pt-2 text-[11px]", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-light text-muted-foreground", children: "K/D/A (KDR):" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                          k,
                          "/",
                          d,
                          "/",
                          stat.assists,
                          " ",
                          /* @__PURE__ */ jsxs("span", { className: "text-[9px] text-muted-foreground", children: [
                            "(",
                            kdr,
                            ")"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-light text-muted-foreground", children: "Reanimaciones:" }),
                        /* @__PURE__ */ jsx("span", { className: "font-mono font-semibold text-foreground", children: stat.revives })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-light font-sans text-muted-foreground", children: "Reaparecido:" }),
                        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: stat.respawned ? "Sí ✅" : "No ❌" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-light font-sans text-muted-foreground", children: "Fase Final:" }),
                        /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: stat.end_game ? "Sí ✅" : "No ❌" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "col-span-2 mt-1 flex items-center justify-between border-border/10 border-t pt-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-light font-sans text-muted-foreground", children: "Estado Mental:" }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `rounded border px-1.5 py-0.5 font-sans font-semibold text-[10px] ${mentalColors[stat.mental_state - 1]}`,
                            children: mentalLabel
                          }
                        )
                      ] })
                    ] })
                  ]
                },
                stat.id
              );
            }) })
          ] })
        ]
      },
      match.id
    );
  }) });
}

function StatsView({ matches, squad, currentUserId }) {
  if (!matches || matches.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-background/50 p-16 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-4 text-4xl", children: "📈" }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Aún no hay estadísticas acumuladas" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm font-light text-muted-foreground text-xs leading-relaxed", children: "Las estadísticas históricas y análisis tácticos del escuadrón se generarán automáticamente conforme jueguen y registren partidas en sus sesiones." })
    ] });
  }
  const summary = useMemo(() => {
    let totalKills = 0;
    let totalDowns = 0;
    let totalAssists = 0;
    let totalRevives = 0;
    const totalMatches = matches.length;
    let totalWins = 0;
    let sumPlacement = 0;
    for (const m of matches) {
      sumPlacement += m.placement || 0;
      if (m.placement === 1) {
        totalWins++;
      }
      if (m.player_match_stats) {
        for (const p of m.player_match_stats) {
          totalKills += p.kills || 0;
          totalDowns += p.downs || 0;
          totalAssists += p.assists || 0;
          totalRevives += p.revives || 0;
        }
      }
    }
    const globalKdr = totalDowns > 0 ? totalKills / totalDowns : totalKills;
    const avgPlacement = sumPlacement / totalMatches;
    const winRate = totalWins / totalMatches * 100;
    return {
      totalKills,
      totalDowns,
      totalAssists,
      totalRevives,
      totalMatches,
      totalWins,
      globalKdr: globalKdr.toFixed(2),
      avgPlacement: avgPlacement.toFixed(1),
      winRate: winRate.toFixed(0)
    };
  }, [matches]);
  const dropZones = useMemo(() => {
    const pois = {};
    for (const m of matches) {
      const poi = m.poi || "Desconocido";
      if (!pois[poi]) {
        pois[poi] = { count: 0, totalPlacement: 0, wins: 0 };
      }
      pois[poi].count++;
      pois[poi].totalPlacement += m.placement || 0;
      if (m.placement === 1) {
        pois[poi].wins++;
      }
    }
    const calculated = Object.entries(pois).map(([name, stat]) => ({
      name,
      count: stat.count,
      avgPlacement: stat.totalPlacement / stat.count,
      winRate: stat.wins / stat.count * 100
    }));
    const sortedByPlacement = [...calculated].sort((a, b) => a.avgPlacement - b.avgPlacement);
    const dropGanador = sortedByPlacement[0] || null;
    const rutaMuerte = sortedByPlacement[sortedByPlacement.length - 1] || null;
    return {
      all: sortedByPlacement,
      dropGanador,
      rutaMuerte
    };
  }, [matches]);
  const defeatCauses = useMemo(() => {
    const causes = {};
    let totalDefeats = 0;
    for (const m of matches) {
      if (m.placement !== 1) {
        const cause = m.elimination_cause || "Desconocida";
        causes[cause] = (causes[cause] || 0) + 1;
        totalDefeats++;
      }
    }
    const sorted = Object.entries(causes).map(([name, count]) => ({
      name,
      count,
      percentage: totalDefeats > 0 ? count / totalDefeats * 100 : 0
    })).sort((a, b) => b.count - a.count);
    return {
      list: sorted,
      totalDefeats
    };
  }, [matches]);
  const fatigueData = useMemo(() => {
    const sessionsGroup = {};
    for (const m of matches) {
      const sId = m.session_id;
      if (!sessionsGroup[sId]) {
        sessionsGroup[sId] = [];
      }
      sessionsGroup[sId].push(m);
    }
    const matchIndexStats = {};
    for (const sessionMatchesList of Object.values(sessionsGroup)) {
      const sorted = [...sessionMatchesList].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      sorted.forEach((m, idx) => {
        const matchNum = idx + 1;
        const groupKey = matchNum >= 5 ? 5 : matchNum;
        if (!matchIndexStats[groupKey]) {
          matchIndexStats[groupKey] = { count: 0, totalPlacement: 0, totalMental: 0, mentalCount: 0 };
        }
        matchIndexStats[groupKey].count++;
        matchIndexStats[groupKey].totalPlacement += m.placement || 0;
        if (m.player_match_stats) {
          for (const p of m.player_match_stats) {
            if (p.mental_state) {
              matchIndexStats[groupKey].totalMental += p.mental_state;
              matchIndexStats[groupKey].mentalCount++;
            }
          }
        }
      });
    }
    const result = Object.entries(matchIndexStats).map(([key, stat]) => ({
      matchNum: Number(key) === 5 ? "Partida 5+" : `Partida ${key}`,
      avgPlacement: stat.totalPlacement / stat.count,
      avgMental: stat.mentalCount > 0 ? stat.totalMental / stat.mentalCount : 3,
      count: stat.count
    })).sort((a, b) => a.matchNum.localeCompare(b.matchNum));
    return result;
  }, [matches]);
  const classStats = useMemo(() => {
    const classes = {};
    for (const m of matches) {
      const isWin = m.placement === 1;
      if (m.player_match_stats) {
        for (const p of m.player_match_stats) {
          const cls = p.active_class || "Asalto";
          if (!classes[cls]) {
            classes[cls] = { count: 0, kills: 0, downs: 0, assists: 0, wins: 0 };
          }
          classes[cls].count++;
          classes[cls].kills += p.kills || 0;
          classes[cls].downs += p.downs || 0;
          classes[cls].assists += p.assists || 0;
          if (isWin) {
            classes[cls].wins++;
          }
        }
      }
    }
    return Object.entries(classes).map(([name, stat]) => ({
      name,
      count: stat.count,
      kdr: stat.downs > 0 ? (stat.kills / stat.downs).toFixed(2) : stat.kills.toFixed(2),
      winRate: (stat.wins / stat.count * 100).toFixed(0),
      avgKills: (stat.kills / stat.count).toFixed(1)
    }));
  }, [matches]);
  const operatorStats = useMemo(() => {
    const players = {};
    for (const m of matches) {
      if (m.player_match_stats) {
        for (const p of m.player_match_stats) {
          const tag = p.gamertag;
          if (!players[tag]) {
            players[tag] = {
              count: 0,
              kills: 0,
              downs: 0,
              assists: 0,
              revives: 0,
              totalMental: 0,
              avatarSeed: p.avatar_seed || null,
              userId: p.user_id || null
            };
          }
          players[tag].count++;
          players[tag].kills += p.kills || 0;
          players[tag].downs += p.downs || 0;
          players[tag].assists += p.assists || 0;
          players[tag].revives += p.revives || 0;
          players[tag].totalMental += p.mental_state || 3;
          if (p.avatar_seed && !players[tag].avatarSeed) {
            players[tag].avatarSeed = p.avatar_seed;
          }
          if (p.user_id && !players[tag].userId) {
            players[tag].userId = p.user_id;
          }
        }
      }
    }
    return Object.entries(players).map(([gamertag, stat]) => ({
      gamertag,
      count: stat.count,
      kdr: stat.downs > 0 ? (stat.kills / stat.downs).toFixed(2) : stat.kills.toFixed(2),
      kills: stat.kills,
      downs: stat.downs,
      assists: stat.assists,
      revives: stat.revives,
      avgMental: (stat.totalMental / stat.count).toFixed(1),
      avatarSeed: stat.avatarSeed,
      userId: stat.userId
    })).sort((a, b) => Number(b.kdr) - Number(a.kdr));
  }, [matches]);
  const mentalLabel = (val) => {
    if (val >= 4.5) return "🔥 Concentrado";
    if (val >= 3.5) return "🟢 Estable";
    if (val >= 2.5) return "🟡 Cansado";
    return "🔴 Tilt / Frustrado";
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in-50 duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 opacity-15", children: /* @__PURE__ */ jsx(Zap, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: "KDR Global" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-bold text-2xl text-primary font-sans", children: summary.globalKdr }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground mt-1", children: [
          "Bajas totales: ",
          summary.totalKills
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 opacity-15", children: /* @__PURE__ */ jsx(BarChart3, { className: "h-6 w-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: "Partidas" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-bold text-2xl text-foreground font-sans", children: summary.totalMatches }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Sesiones de juego" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 opacity-15", children: /* @__PURE__ */ jsx(Compass, { className: "h-6 w-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: "Puesto Promedio" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 font-bold text-2xl text-foreground font-sans", children: [
          "#",
          summary.avgPlacement
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Efectividad de zona" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 shadow-sm relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-3 opacity-15", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6 text-emerald-500" }) }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-wider", children: "Tasa de Victorias" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 font-bold text-2xl text-emerald-500 font-sans", children: [
          summary.winRate,
          "%"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-muted-foreground mt-1", children: [
          "Victorias totales: ",
          summary.totalWins
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
      dropZones.dropGanador && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-xs relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-4 bg-emerald-500/10 rounded-full p-2", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-emerald-400 animate-pulse" }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-emerald-400 text-xs uppercase tracking-widest font-mono", children: "🚀 El Drop Ganador" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-bold text-lg text-foreground", children: dropZones.dropGanador.name }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-xs font-mono", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Puesto Prom.:" }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-emerald-400", children: [
              "#",
              dropZones.dropGanador.avgPlacement.toFixed(1)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Despliegues:" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: dropZones.dropGanador.count })
          ] })
        ] })
      ] }),
      dropZones.rutaMuerte && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-destructive/20 bg-destructive/5 p-5 shadow-xs relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-4 bg-destructive/10 rounded-full p-2", children: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-5 w-5 text-destructive" }) }),
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-destructive text-xs uppercase tracking-widest font-mono", children: "💀 Ruta de la Muerte" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-bold text-lg text-foreground", children: dropZones.rutaMuerte.name }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-xs font-mono", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Puesto Prom.:" }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-destructive", children: [
              "#",
              dropZones.rutaMuerte.avgPlacement.toFixed(1)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Despliegues:" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: dropZones.rutaMuerte.count })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4", children: "Anatomía de la Derrota (Causas)" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3.5", children: defeatCauses.list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground font-light py-6 text-center", children: "No hay derrotas registradas todavía." }) : defeatCauses.list.map((cause) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs mb-1.5 font-mono", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: cause.name }),
            /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
              cause.count,
              " (",
              cause.percentage.toFixed(0),
              "%)"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full bg-primary/80 rounded-full transition-all duration-500",
              style: { width: `${cause.percentage}%` }
            }
          ) })
        ] }, cause.name)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4", children: "Curva de Fatiga y Desempeño" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: fatigueData.map((data) => {
          const placementPct = Math.max(0, 100 - (data.avgPlacement - 1) * 5);
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs mb-1.5 font-mono", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: data.matchNum }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px]", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Puesto Prom.: ",
                  /* @__PURE__ */ jsxs("span", { className: "text-primary font-bold", children: [
                    "#",
                    data.avgPlacement.toFixed(1)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Estado Mental: ",
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-400 font-bold", children: mentalLabel(data.avgMental) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-muted rounded-full overflow-hidden relative", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary rounded-full transition-all duration-500",
                style: { width: `${placementPct}%` }
              }
            ) })
          ] }, data.matchNum);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-5 lg:col-span-1", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4", children: "Matriz de Especialidades" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs font-mono", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-muted-foreground border-border/20 border-b pb-2", children: [
            /* @__PURE__ */ jsx("th", { className: "font-medium pb-2", children: "Clase" }),
            /* @__PURE__ */ jsx("th", { className: "font-medium text-center pb-2", children: "KDR" }),
            /* @__PURE__ */ jsx("th", { className: "font-medium text-center pb-2", children: "Win %" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: classStats.map((cls) => /* @__PURE__ */ jsxs("tr", { className: "border-border/10 border-b hover:bg-muted/5", children: [
            /* @__PURE__ */ jsx("td", { className: "py-2.5 font-bold text-foreground", children: cls.name }),
            /* @__PURE__ */ jsx("td", { className: "py-2.5 text-center text-primary font-bold", children: cls.kdr }),
            /* @__PURE__ */ jsxs("td", { className: "py-2.5 text-center font-bold", children: [
              cls.winRate,
              "%"
            ] })
          ] }, cls.name)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-5 lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs uppercase tracking-wider border-border/40 border-b pb-3 mb-4", children: "Comparador de Operadores" }),
        /* @__PURE__ */ jsx("div", { className: "block sm:hidden space-y-3", children: operatorStats.map((op) => {
          const isMe = op.userId === currentUserId;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `rounded-lg border p-4 bg-muted/10 relative overflow-hidden transition-all hover:bg-muted/15 ${isMe ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-border"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      OperatorAvatar,
                      {
                        className: "h-6 w-6",
                        gamertag: op.gamertag,
                        avatarSeed: op.avatarSeed
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { className: `text-sm font-bold ${isMe ? "text-emerald-500 dark:text-emerald-400" : "text-foreground"}`, children: [
                      cleanGamertag(op.gamertag),
                      isMe && /* @__PURE__ */ jsx("span", { className: "text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono ml-1.5", children: "Tú" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-muted-foreground uppercase font-mono tracking-wider", children: "KDR" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-extrabold text-primary font-mono", children: op.kdr })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 border-t border-border/30 pt-3 text-center", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground font-mono uppercase", children: "Partidas" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-foreground font-mono mt-0.5", children: op.count })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[9px] text-muted-foreground font-mono uppercase", children: "K/D/A" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-bold text-foreground font-mono mt-0.5", children: [
                      op.kills,
                      "/",
                      op.downs,
                      "/",
                      op.assists
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-muted-foreground font-mono uppercase flex items-center justify-center gap-0.5", children: [
                      /* @__PURE__ */ jsx(Heart, { className: "h-2 w-2 text-red-500 fill-red-500" }),
                      " Reanim."
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-emerald-400 font-mono mt-0.5", children: op.revives })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-border/30 pt-3 text-[10px] font-mono", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Estado Mental Prom.:" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: mentalLabel(Number(op.avgMental)) })
                ] })
              ]
            },
            op.gamertag
          );
        }) }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-muted-foreground font-mono border-border/20 border-b pb-2 text-[10px] uppercase", children: [
            /* @__PURE__ */ jsx("th", { className: "font-medium pb-2", children: "Operador" }),
            /* @__PURE__ */ jsx("th", { className: "font-medium text-center pb-2", children: "Partidas" }),
            /* @__PURE__ */ jsx("th", { className: "font-medium text-center pb-2", children: "K/D/A" }),
            /* @__PURE__ */ jsx("th", { className: "font-medium text-center pb-2", children: "KDR" }),
            /* @__PURE__ */ jsxs("th", { className: "font-medium text-center pb-2 flex items-center justify-center gap-1", children: [
              /* @__PURE__ */ jsx(Heart, { className: "h-3 w-3 text-red-500" }),
              " Reanim."
            ] }),
            /* @__PURE__ */ jsx("th", { className: "font-medium text-center pb-2", children: "Estado Prom." })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: operatorStats.map((op) => {
            const isMe = op.userId === currentUserId;
            return /* @__PURE__ */ jsxs("tr", { className: "border-border/10 border-b hover:bg-muted/5 font-sans", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 font-semibold", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  OperatorAvatar,
                  {
                    className: "h-5 w-5",
                    gamertag: op.gamertag,
                    avatarSeed: op.avatarSeed
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: isMe ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground", children: [
                  cleanGamertag(op.gamertag),
                  " ",
                  isMe && "(Tú)"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-center font-mono", children: op.count }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 text-center font-mono text-[10px]", children: [
                op.kills,
                "/",
                op.downs,
                "/",
                op.assists
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-center font-mono font-bold text-primary", children: op.kdr }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-center font-mono text-emerald-400 font-semibold", children: op.revives }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-center font-mono text-[10px]", children: mentalLabel(Number(op.avgMental)) })
            ] }, op.gamertag);
          }) })
        ] }) })
      ] })
    ] })
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
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTab, setActiveTab] = useState("active-session");
  const [copiedCode, setCopiedCode] = useState(false);
  const [squadName, setSquadName] = useState(squad?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [squadState, setSquadState] = useState(squad);
  const [session, setSession] = useState(activeSession);
  const [matches, setMatches] = useState(sessionMatches);
  const [historicalMatches, setHistoricalMatches] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [activePlayers, setActivePlayers] = useState(() => {
    if (!squad) {
      return [];
    }
    const players = [];
    for (let slot = 1; slot <= 4; slot++) {
      const member = squad.members.find((m) => m.slot_number === slot);
      if (member) {
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
        players.push({
          slot_number: member.slot_number,
          status: member.status || (hasUser && member.is_active ? "titular" : "ausente"),
          gamertag: member.gamertag,
          favorite_class: member.favorite_class,
          active_class: member.favorite_class,
          user_id: member.user_id,
          avatar_seed: member.avatar_seed || null,
          kills,
          downs,
          assists
        });
      } else {
        players.push({
          slot_number: slot,
          status: "ausente",
          gamertag: "Invitado",
          favorite_class: "Asalto",
          active_class: "Asalto",
          user_id: null,
          kills: 0,
          downs: 0,
          assists: 0
        });
      }
    }
    return players;
  });
  useEffect(() => {
    if (!squadState) {
      return;
    }
    setActivePlayers(() => {
      const players = [];
      for (let slot = 1; slot <= 4; slot++) {
        const member = squadState.members.find((m) => m.slot_number === slot);
        if (member) {
          const hasUser = member.user_id !== null && member.user_id !== void 0;
          let kills = 0;
          let downs = 0;
          let assists = 0;
          for (const match of matches) {
            const stats = match.player_match_stats?.find(
              (p) => p.gamertag === member.gamertag
            );
            if (stats) {
              kills += stats.kills || 0;
              downs += stats.downs || 0;
              assists += stats.assists || 0;
            }
          }
          players.push({
            slot_number: member.slot_number,
            status: member.status || (hasUser && member.is_active ? "titular" : "ausente"),
            gamertag: member.gamertag,
            favorite_class: member.favorite_class,
            active_class: member.favorite_class,
            user_id: member.user_id,
            avatar_seed: member.avatar_seed || null,
            kills,
            downs,
            assists
          });
        } else {
          players.push({
            slot_number: slot,
            status: "ausente",
            gamertag: "Invitado",
            favorite_class: "Asalto",
            active_class: "Asalto",
            user_id: null,
            kills: 0,
            downs: 0,
            assists: 0
          });
        }
      }
      return players;
    });
  }, [squadState, matches]);
  useEffect(() => {
    if (!squadState) {
      return;
    }
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const { data, error } = await actions.squad.getHistoricalStats({
          squadId: squadState.id
        });
        if (error) {
          console.error("Error loading historical stats:", error);
        } else if (data) {
          setHistoricalMatches(data.matches);
        }
      } catch (err) {
        console.error("Failed to load historical stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [squadState, matches]);
  useEffect(() => {
    if (!squadState) {
      return;
    }
    const sessionsChannel = supabase.channel("sessions_realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "game_sessions",
        filter: `squad_id=eq.${squadState.id}`
      },
      async () => {
        const { data: activeSessionData } = await actions.session.getActive({
          squadId: squadState.id
        });
        setSession(activeSessionData || null);
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(sessionsChannel);
    };
  }, [squadState?.id, supabase, squadState]);
  useEffect(() => {
    if (!session?.id) {
      setMatches([]);
      return;
    }
    const fetchLatestMatches = async () => {
      const { data: matchesData } = await actions.match.list({
        sessionId: session.id
      });
      setMatches(matchesData || []);
    };
    const matchesChannel = supabase.channel("matches_realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "matches",
        filter: `session_id=eq.${session.id}`
      },
      () => {
        fetchLatestMatches();
      }
    ).subscribe();
    const statsChannel = supabase.channel("stats_realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "player_match_stats"
      },
      () => {
        fetchLatestMatches();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(statsChannel);
    };
  }, [session?.id, supabase]);
  useEffect(() => {
    if (!squadState) {
      return;
    }
    const membersChannel = supabase.channel("members_realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "squad_members",
        filter: `squad_id=eq.${squadState.id}`
      },
      async () => {
        const { data: squadData } = await actions.squad.get();
        if (squadData?.activeSquad) {
          setSquadState(squadData.activeSquad);
        }
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(membersChannel);
    };
  }, [squadState?.id, supabase, squadState]);
  const isOwner = !!(currentUser?.id && squadState?.owner_id && squadState.owner_id === currentUser.id);
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2e3);
  };
  const handleDeleteSquad = async () => {
    if (!squadState) {
      return;
    }
    const confirmed = confirm(
      "¿Estás seguro de que deseas eliminar este escuadrón? Esta acción es irreversible."
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.delete({ squadId: squadState.id });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error deleting squad:", err);
      alert("Error al eliminar el escuadrón.");
    }
  };
  if (!squadState || isCreatingNew) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8", children: /* @__PURE__ */ jsx(
      SquadWizard,
      {
        onCancel: squadState ? () => setIsCreatingNew(false) : void 0,
        profile
      }
    ) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 flex-col bg-background xl:flex-row", children: [
    /* @__PURE__ */ jsx(
      SquadSidebar,
      {
        allSquads,
        currentUser,
        onNewSquadClick: () => setIsCreatingNew(true),
        setSquadState,
        squad: squadState
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
      /* @__PURE__ */ jsxs("main", { className: "flex-1 p-6 pb-16 xl:p-8", children: [
        activeTab === "active-session" && /* @__PURE__ */ jsx(
          SessionPanel,
          {
            activePlayers,
            currentUser,
            initialSession: session,
            isOwner,
            sessionMatches: matches,
            setActivePlayers,
            setSession,
            setSquadState,
            squad: squadState
          }
        ),
        activeTab === "history" && /* @__PURE__ */ jsx(
          SessionsHistory,
          {
            currentUserId: currentUser?.id,
            squadId: squadState.id
          }
        ),
        activeTab === "stats" && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-border/40 border-b pb-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-bold text-foreground text-sm tracking-tight", children: [
              /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" }),
              "Estadísticas Globales"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs mt-0.5", children: "Historial de rendimiento acumulado y análisis de supervivencia del escuadrón." })
          ] }) }),
          loadingStats ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxs(
              "svg",
              {
                "aria-label": "Cargando",
                className: "h-8 w-8 animate-spin text-primary mb-3",
                fill: "none",
                role: "img",
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                  /* @__PURE__ */ jsx("title", { children: "Cargando" }),
                  /* @__PURE__ */ jsx(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      className: "opacity-75",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                      fill: "currentColor"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Cargando análisis tácticos del escuadrón..." })
          ] }) : /* @__PURE__ */ jsx(
            StatsView,
            {
              matches: historicalMatches,
              squad: squadState,
              currentUserId: currentUser?.id
            }
          )
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
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-border bg-background p-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-foreground text-sm", children: "Código de Invitación" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-xs leading-relaxed", children: "Comparte este código con tus compañeros de equipo para que puedan unirse a la escuadra y reclamar sus operadores." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 rounded-md border border-border bg-muted/40 px-3.5 py-2.5", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold font-mono text-foreground text-lg tracking-wider", children: squadState.invite_code || "BS-PENDIENTE" }),
                squadState.invite_code && /* @__PURE__ */ jsx(
                  Button,
                  {
                    className: "flex h-auto items-center gap-1.5 px-3 py-1.5 text-xs",
                    onClick: () => handleCopyCode(squadState.invite_code || ""),
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
                    setSquadState(
                      (prev) => prev ? { ...prev, name: squadName.trim() } : null
                    );
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
                        className: "mt-2 h-auto self-start px-4 py-2",
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
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-destructive/30 bg-destructive/5 p-5 xl:col-span-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-destructive text-sm", children: "Zona de Peligro" }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-xs leading-relaxed", children: "Una vez que elimines el escuadrón, no podrás recuperar sus datos ni el historial de sesiones asociadas. Todos los slots e integrantes serán desvinculados permanentemente." })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "h-auto border border-destructive/20 px-4 py-2 text-destructive hover:bg-destructive/10",
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
  } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-1 flex-col"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} ${renderComponent($$result2, "DashboardContent", DashboardContent, { "squad": squad, "allSquads": allSquads, "activeSession": activeSession, "sessionMatches": sessionMatches, "currentUser": user, "profile": profile, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/dashboard-content", "client:component-export": "DashboardContent" })} </div> ` })}`;
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
