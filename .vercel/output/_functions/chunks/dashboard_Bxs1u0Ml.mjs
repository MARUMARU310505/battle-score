!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"71a7833a24c9bc964b1bfcd179f378a3e26605ac"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0253f1a4-258f-48f1-93e6-e24430d085f6",e._sentryDebugIdIdentifier="sentry-dbid-0253f1a4-258f-48f1-93e6-e24430d085f6");}catch(e){}}();import './page-ssr_CHRI393N.mjs';
import { c as createComponent } from './astro-component_anW73TDG.mjs';
import 'piccolore';
import { Q as renderTemplate, T as maybeRenderHead } from './params-and-props_BOwWm_4U.mjs';
import { r as renderComponent } from './entrypoint_GKLamRve.mjs';
import { a as actions } from './server_DPXFZvOc.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Plus, Users, Check, Copy, Loader2, ArrowRight, LogOut, ShieldCheck, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { B as Button, N as Nav } from './nav_B0rYCviu.mjs';
import { S as SquadWizard, N as NotificationProvider, u as useNotification, O as OperatorAvatar, c as cleanGamertag } from './squad-wizard_DaH-wgcN.mjs';
import { $ as $$BaseLayout } from './base-layout_BMzA7kH-.mjs';

function SquadHubContainer({
  squads,
  currentUser,
  profile
}) {
  const [isCreating, setIsCreating] = useState(false);
  if (isCreating) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8", children: /* @__PURE__ */ jsx(SquadWizard, { onCancel: () => setIsCreating(false), profile }) });
  }
  return /* @__PURE__ */ jsx(NotificationProvider, { children: /* @__PURE__ */ jsx(
    SquadHub,
    {
      currentUser,
      onNewSquadClick: () => setIsCreating(true),
      profile,
      squads
    }
  ) });
}
function SquadHub({
  squads,
  currentUser,
  onNewSquadClick,
  profile
}) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enteringSquadId, setEnteringSquadId] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [foundSquad, setFoundSquad] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const { confirm: confirmAction, notify } = useNotification();
  const [operatorClass, setOperatorClass] = useState(
    profile?.favorite_class || "Asalto"
  );
  const handleSelectSlot = (slotNum) => {
    setSelectedSlot(slotNum);
    const slotMember = foundSquad?.squad_members.find(
      (m) => m.slot_number === slotNum
    );
    if (slotMember) {
      setOperatorClass(
        profile?.favorite_class || slotMember.favorite_class || "Asalto"
      );
    }
  };
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const handleSearchCode = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      return;
    }
    setLoading(true);
    setSearchError(null);
    setFoundSquad(null);
    setSelectedSlot(null);
    try {
      const { data, error } = await actions.squad.getSquadByCode({
        inviteCode: inviteCode.trim().toUpperCase()
      });
      if (error) {
        throw error;
      }
      setFoundSquad(data);
    } catch (err) {
      console.error(err);
      setSearchError(
        err instanceof Error ? err.message : "Código de invitación no válido"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleJoinSquad = async (e) => {
    e.preventDefault();
    if (!foundSquad || selectedSlot === null) {
      return;
    }
    setLoading(true);
    setSearchError(null);
    try {
      const { error } = await actions.squad.claimSlot({
        squadId: foundSquad.id,
        slotNumber: selectedSlot,
        favoriteClass: operatorClass
      });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard/squad";
    } catch (err) {
      console.error(err);
      setSearchError(
        err instanceof Error ? err.message : "Error al unirse al escuadrón"
      );
      setLoading(false);
    }
  };
  const handleEnterSquad = async (squadId) => {
    setEnteringSquadId(squadId);
    try {
      const { error } = await actions.squad.setActive({ squadId });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard/squad";
    } catch (err) {
      console.error("Error setting active squad:", err);
      setEnteringSquadId(null);
    }
  };
  const handleLeaveSquad = async (squadId, slotNumber) => {
    const confirmed = await confirmAction(
      "¿Salir del escuadrón?",
      "Perderás tu slot y tendrás que usar un código de invitación para volver a unirte."
    );
    if (!confirmed) {
      return;
    }
    try {
      const { error } = await actions.squad.releaseSlot({
        squadId,
        slotNumber
      });
      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (err) {
      console.error("Error leaving squad:", err);
      notify("error", "Error al salir del escuadrón.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8 xl:px-6 xl:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 border-border border-b pb-6 xl:flex-row xl:items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-bold text-2xl text-foreground tracking-tight", children: "Hub de Escuadrones" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-sm", children: "Elige un escuadrón activo, únete a uno existente usando un código, o crea uno nuevo." })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: "flex items-center gap-1.5 self-start xl:self-center",
          onClick: onNewSquadClick,
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            "Crear Escuadrón"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-1 gap-6 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6 xl:col-span-2", children: [
        /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 font-bold text-foreground text-lg tracking-tight", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-muted-foreground" }),
          "Tus Escuadras"
        ] }),
        squads.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border border-dashed bg-card/10 p-12 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-4 inline-block text-3xl", children: "👥" }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Aún no tienes escuadrones" }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mt-2 max-w-sm font-light text-muted-foreground text-xs", children: "Crea uno nuevo usando el botón superior o pídele a un amigo su código de invitación para unirte a su escuadra." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: squads.map((squad) => {
          const isOwner = squad.owner_id === currentUser.id;
          const myMemberSlot = squad.squad_members.find(
            (m) => m.user_id === currentUser.id
          );
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-xs transition-colors hover:border-border/80",
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("h3", { className: "truncate font-bold text-foreground text-sm", children: squad.name }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `shrink-0 rounded-md px-2 py-0.5 font-medium font-mono text-[10px] uppercase ${isOwner ? "border border-primary/20 bg-primary/10 text-primary" : "border border-border bg-muted text-muted-foreground"}`,
                        children: isOwner ? "Creador" : "Miembro"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2 border-border/40 border-t pt-3", children: squad.squad_members.sort((a, b) => a.slot_number - b.slot_number).map((member) => {
                    const isMe = member.user_id === currentUser.id;
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `flex items-center justify-between rounded-md px-2 py-1 text-xs ${isMe ? "border border-primary/10 bg-primary/5 font-medium" : "bg-background/40"}`,
                        children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
                            member.slot_number === 1 ? /* @__PURE__ */ jsx("span", { className: "shrink-0", title: "Creador", children: "👑" }) : /* @__PURE__ */ jsx(
                              OperatorAvatar,
                              {
                                avatarSeed: member.avatar_seed,
                                className: "h-4.5 w-4.5",
                                gamertag: member.gamertag
                              }
                            ),
                            /* @__PURE__ */ jsxs(
                              "span",
                              {
                                className: `truncate ${isMe ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-muted-foreground"}`,
                                children: [
                                  cleanGamertag(member.gamertag),
                                  " ",
                                  isMe && "(Tú)"
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
                            /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-muted-foreground/80", children: [
                              "Nivel ",
                              member.level
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "rounded-sm bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground", children: member.favorite_class }),
                            isMe && /* @__PURE__ */ jsx("span", { className: "font-bold text-[9px] text-primary uppercase", children: "Tú" })
                          ] })
                        ]
                      },
                      member.id
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
                  isOwner && squad.invite_code && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/50 px-2.5 py-1.5", children: [
                    /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                      "Código:",
                      " ",
                      /* @__PURE__ */ jsx("strong", { className: "text-foreground tracking-wide", children: squad.invite_code })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "cursor-pointer p-0.5 text-muted-foreground transition-colors hover:text-foreground",
                        onClick: () => handleCopyCode(squad.invite_code, squad.id),
                        title: "Copiar código de invitación",
                        type: "button",
                        children: copiedId === squad.id ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-green-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      Button,
                      {
                        className: "h-auto flex-1 px-4 py-2 text-xs",
                        disabled: enteringSquadId !== null,
                        onClick: () => handleEnterSquad(squad.id),
                        size: "sm",
                        children: [
                          enteringSquadId === squad.id ? /* @__PURE__ */ jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(ArrowRight, { className: "mr-1.5 h-3.5 w-3.5" }),
                          "Entrar al Panel"
                        ]
                      }
                    ),
                    !isOwner && myMemberSlot && /* @__PURE__ */ jsx(
                      Button,
                      {
                        className: "px-2.5 text-destructive text-xs hover:bg-destructive/10",
                        onClick: () => handleLeaveSquad(
                          squad.id,
                          myMemberSlot.slot_number
                        ),
                        size: "sm",
                        title: "Salir del escuadrón",
                        variant: "ghost",
                        children: /* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] })
              ]
            },
            squad.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 font-bold text-foreground text-lg tracking-tight", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-muted-foreground" }),
          "Unirse a Escuadra"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-lg border border-border bg-card p-5 shadow-xs", children: [
          /* @__PURE__ */ jsx("p", { className: "font-light text-muted-foreground text-xs leading-relaxed", children: "Ingresa el código de invitación de tu líder de equipo para unirte como operador y reclamar un rol disponible." }),
          searchError && /* @__PURE__ */ jsx("div", { className: "rounded-md bg-destructive/10 p-3 text-destructive text-xs", children: searchError }),
          /* @__PURE__ */ jsxs("form", { className: "flex gap-2", onSubmit: handleSearchCode, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "flex-1 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-foreground text-sm uppercase placeholder:font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary",
                disabled: loading,
                onChange: (e) => setInviteCode(e.target.value),
                placeholder: "Ej. BS-A9B8C7",
                type: "text",
                value: inviteCode
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "px-4",
                disabled: loading,
                size: "sm",
                type: "submit",
                children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" })
              }
            )
          ] }),
          foundSquad && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4 border-border border-t pt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono text-[9px] text-muted-foreground uppercase", children: "Escuadrón Encontrado" }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-md", children: foundSquad.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("span", { className: "block font-medium text-foreground text-xs", children: "Reclamar Rol Disponible:" }),
              (() => {
                const slots = Array.from({ length: 4 }, (_, i) => {
                  const slotNum = i + 1;
                  const member = foundSquad.squad_members.find(
                    (m) => m.slot_number === slotNum
                  );
                  return {
                    slot_number: slotNum,
                    member,
                    isClaimed: member ? member.user_id !== null : false
                  };
                });
                const freeSlots = slots.filter((s) => !s.isClaimed);
                if (freeSlots.length === 0) {
                  return /* @__PURE__ */ jsx("p", { className: "font-light text-destructive text-xs italic", children: "Este escuadrón ya no tiene slots libres disponibles." });
                }
                return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: slots.map((slotInfo) => {
                  const isClaimed = slotInfo.isClaimed;
                  const isSelected = selectedSlot === slotInfo.slot_number;
                  let buttonStyle = "border-border bg-background/50 hover:border-border/80";
                  if (isClaimed) {
                    buttonStyle = "cursor-not-allowed border-border bg-muted/30 opacity-40";
                  } else if (isSelected) {
                    buttonStyle = "border-primary bg-primary/5";
                  }
                  const displayGamertag = slotInfo.member ? cleanGamertag(slotInfo.member.gamertag) : "Disponible";
                  const displayClass = slotInfo.member ? slotInfo.member.favorite_class : "Asalto";
                  return /* @__PURE__ */ jsxs(
                    "button",
                    {
                      className: `flex w-full cursor-pointer items-center justify-between rounded-md border p-2 text-left text-xs transition-colors ${buttonStyle}`,
                      disabled: isClaimed,
                      onClick: () => !isClaimed && handleSelectSlot(slotInfo.slot_number),
                      type: "button",
                      children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
                            slotInfo.slot_number === 1 ? "👑 " : "👤 ",
                            "Operador #",
                            slotInfo.slot_number
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: isClaimed ? `Reclamado por: ${displayGamertag}` : `Slot disponible: ${displayGamertag}` })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground uppercase", children: displayClass })
                      ]
                    },
                    slotInfo.slot_number
                  );
                }) });
              })()
            ] }),
            selectedSlot !== null && /* @__PURE__ */ jsxs(
              "form",
              {
                className: "space-y-4 border-border border-t pt-4",
                onSubmit: handleJoinSquad,
                children: [
                  /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-foreground text-xs uppercase tracking-wider", children: [
                    "Datos de tu Operador (Slot #",
                    selectedSlot,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 xl:grid-cols-2", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          className: "mb-1 block font-medium text-[10px] text-muted-foreground",
                          htmlFor: "hub-gamertag",
                          children: "Gamertag"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                          disabled: true,
                          id: "hub-gamertag",
                          type: "text",
                          value: profile?.gamertag || ""
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          className: "mb-1 block font-medium text-[10px] text-muted-foreground",
                          htmlFor: "hub-level",
                          children: "Nivel"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                          disabled: true,
                          id: "hub-level",
                          type: "number",
                          value: profile?.level || 1
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2", children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          className: "mb-1 block font-medium text-[10px] text-muted-foreground",
                          htmlFor: "hub-class",
                          children: "Clase Favorita"
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary",
                          id: "hub-class",
                          onChange: (e) => setOperatorClass(e.target.value),
                          value: operatorClass,
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "Asalto", children: "Asalto" }),
                            /* @__PURE__ */ jsx("option", { value: "Soporte", children: "Soporte" }),
                            /* @__PURE__ */ jsx("option", { value: "Recon", children: "Recon" }),
                            /* @__PURE__ */ jsx("option", { value: "Ingeniero", children: "Ingeniero" })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      className: "w-full text-xs",
                      disabled: loading,
                      type: "submit",
                      children: loading ? "Uniéndose..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(UserPlus, { className: "mr-1.5 h-3.5 w-3.5" }),
                        "Unirse como Operador #",
                        selectedSlot
                      ] })
                    }
                  )
                ]
              }
            )
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
  const { data: profile } = await Astro2.callAction(actions.profile.get, {});
  if (!profile) {
    return Astro2.redirect("/dashboard/profile");
  }
  const { data } = await Astro2.callAction(actions.squad.getHubData, {});
  const squadsList = data || [];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "metadata": {
    title: "Hub de Escuadrones — Battle Score",
    description: "Hub de escuadrones de Battle Score",
    ignoreTitleTemplate: true
  } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-1 flex-col"> ${renderComponent($$result2, "Nav", Nav, { "user": user, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/landing/nav", "client:component-export": "Nav" })} ${renderComponent($$result2, "SquadHubContainer", SquadHubContainer, { "squads": squadsList, "currentUser": user, "profile": profile, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/dashboard/squad-hub", "client:component-export": "SquadHubContainer" })} </div> ` })}`;
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
