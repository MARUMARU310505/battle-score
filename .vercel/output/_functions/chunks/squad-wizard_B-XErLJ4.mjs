!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"9c4acfc3e20988b98dc995e1b76f520c831dcaf0"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a99a3a1f-9bda-4710-bb2d-d769a084db4c",e._sentryDebugIdIdentifier="sentry-dbid-a99a3a1f-9bda-4710-bb2d-d769a084db4c");}catch(e){}}();import { jsxs, jsx } from 'react/jsx-runtime';
import { a as actions } from './server_CjNBxXCh.mjs';
import { useState } from 'react';
import { B as Button } from './nav_3AXwXjL2.mjs';

function cleanGamertag(gamertag) {
  if (!gamertag) {
    return "";
  }
  return gamertag.split("||")[0];
}
function OperatorAvatar({
  gamertag,
  className = "h-8 w-8"
}) {
  const [error, setError] = useState(false);
  const parts = gamertag.split("||");
  const cleanName = parts[0] || "";
  const seed = parts[1] || cleanName;
  const initials = cleanName.slice(0, 2).toUpperCase();
  if (error) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex shrink-0 items-center justify-center rounded-full border border-border bg-muted font-bold font-mono text-foreground text-xs uppercase ${className}`,
        children: initials
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      alt: cleanName,
      className: `shrink-0 rounded-full border border-border bg-muted ${className}`,
      height: 32,
      onError: () => setError(true),
      src: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`,
      width: 32
    }
  );
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
  currentUser = null,
  setSquadState
}) {
  const isOwner = squad.owner_id === currentUser?.id;
  const myMember = squad.members.find((m) => m.user_id === currentUser?.id);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editClass, setEditClass] = useState("Asalto");
  const [loadingSlot, setLoadingSlot] = useState(null);
  const startEditing = (member) => {
    setEditingSlot(member.slot_number);
    setEditClass(member.favorite_class);
  };
  const handleSaveClass = async (slotNumber) => {
    setLoadingSlot(slotNumber);
    try {
      const { error } = await actions.squad.updateMemberClass({
        squadId: squad.id,
        slotNumber,
        favoriteClass: editClass
      });
      if (error) {
        throw error;
      }
      if (setSquadState) {
        setSquadState((prev) => {
          if (!prev) {
            return null;
          }
          return {
            ...prev,
            // biome-ignore lint/suspicious/noExplicitAny: m mapper uses any
            members: prev.members.map(
              (m) => m.slot_number === slotNumber ? { ...m, favorite_class: editClass } : m
            )
          };
        });
      }
      setEditingSlot(null);
    } catch (err) {
      console.error("Error updating member class:", err);
      alert("Error al actualizar el rol del operador.");
    } finally {
      setLoadingSlot(null);
    }
  };
  const handleToggleActive = async (slotNumber, currentActive) => {
    setLoadingSlot(slotNumber);
    try {
      const { error } = await actions.squad.setIsActive({
        squadId: squad.id,
        slotNumber,
        isActive: !currentActive
      });
      if (error) {
        throw error;
      }
      if (setSquadState) {
        setSquadState((prev) => {
          if (!prev) {
            return null;
          }
          return {
            ...prev,
            // biome-ignore lint/suspicious/noExplicitAny: m mapper uses any
            members: prev.members.map(
              (m) => m.slot_number === slotNumber ? { ...m, is_active: !currentActive } : m
            )
          };
        });
      }
    } catch (err) {
      console.error("Error toggling active state:", err);
      alert("Error al cambiar el estado del operador.");
    } finally {
      setLoadingSlot(null);
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
  return /* @__PURE__ */ jsxs("aside", { className: "flex min-h-0 w-full flex-col justify-between border-border border-r bg-card p-4 xl:min-h-[calc(100vh-4rem)] xl:w-64", children: [
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
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({ length: 4 }, (_, i) => i + 1).map((slotNumber) => {
        const member = squad.members.find(
          (m) => m.slot_number === slotNumber
        );
        if (!member) {
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex flex-col gap-2 rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30",
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border border-dashed bg-muted font-mono text-muted-foreground text-xs uppercase", children: slotNumber }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-1", children: /* @__PURE__ */ jsx("p", { className: "truncate font-bold text-muted-foreground text-xs italic", children: "Slot disponible" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border bg-muted/40 px-2 py-0.5 font-medium text-[10px] text-muted-foreground", children: "Asalto" }),
                    /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded border border-amber-500/20 bg-amber-500/10 px-1 py-0.2 font-mono font-semibold text-[9px] text-amber-500 uppercase", children: "Invitación" })
                  ] })
                ] })
              ] })
            },
            `empty-${slotNumber}`
          );
        }
        const hasUser = member.user_id !== null && member.user_id !== void 0;
        const isEditingThisSlot = editingSlot === member.slot_number;
        if (isEditingThisSlot) {
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative space-y-2.5 overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-3",
              children: [
                loadingSlot === member.slot_number && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px]", children: /* @__PURE__ */ jsxs(
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
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-[9px] text-primary uppercase", children: [
                    "Clase de ",
                    cleanGamertag(member.gamertag)
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
            className: "relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border/40 bg-background/50 p-2.5 transition-colors hover:bg-muted/30",
            children: [
              loadingSlot === member.slot_number && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px]", children: /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  OperatorAvatar,
                  {
                    className: "h-8 w-8",
                    gamertag: member.gamertag
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                    /* @__PURE__ */ jsxs(
                      "p",
                      {
                        className: `truncate font-bold text-xs ${member.user_id === currentUser?.id ? "font-extrabold text-emerald-500 dark:text-emerald-400" : "text-foreground"}`,
                        children: [
                          cleanGamertag(member.gamertag),
                          " ",
                          member.user_id === currentUser?.id && "(Tú)"
                        ]
                      }
                    ),
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

const CLASSES = ["Asalto", "Soporte", "Recon", "Ingeniero"];
function validateMembers(members) {
  const m = members.find((x) => x.slot_number === 1);
  if (!m) {
    return "El integrante principal es requerido.";
  }
  if (!m.gamertag.trim()) {
    return "El Gamertag del Jugador #1 (Líder) es requerido.";
  }
  if (m.level < 1) {
    return "El nivel del Jugador #1 (Líder) debe ser mayor o igual a 1.";
  }
  return null;
}
function MemberRow({
  member,
  originalIndex,
  isDisabled,
  disableGamertagAndLevel,
  handleMemberChange
}) {
  const isLeader = member.slot_number === 1;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 rounded-md border border-border/60 bg-background/50 p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-border/40 border-b pb-2", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-muted-foreground text-xs uppercase", children: [
        "Operador #",
        member.slot_number,
        " ",
        isLeader && "(Líder)"
      ] }),
      isDisabled && /* @__PURE__ */ jsx("span", { className: "rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-500 uppercase", children: "Invitación Pendiente (No se puede editar)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-2", children: [
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
            className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
            disabled: disableGamertagAndLevel,
            id: `gamertag-${member.slot_number}`,
            onChange: (e) => handleMemberChange(originalIndex, "gamertag", e.target.value),
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
            htmlFor: `level-${member.slot_number}`,
            children: "Nivel"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
            disabled: disableGamertagAndLevel,
            id: `level-${member.slot_number}`,
            min: "1",
            onChange: (e) => handleMemberChange(
              originalIndex,
              "level",
              Number.parseInt(e.target.value, 10) || 1
            ),
            type: "number",
            value: member.level
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "xl:col-span-2", children: [
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
            className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
            disabled: isDisabled,
            id: `favorite_class-${member.slot_number}`,
            onChange: (e) => handleMemberChange(
              originalIndex,
              "favorite_class",
              e.target.value
            ),
            value: member.favorite_class,
            children: CLASSES.map((cls) => /* @__PURE__ */ jsx("option", { value: cls, children: cls }, cls))
          }
        )
      ] })
    ] })
  ] });
}
function SquadWizard({
  initialSquad = null,
  profile = null,
  onCancel
}) {
  const showOnlySlot1 = !initialSquad;
  const [step, setStep] = useState(1);
  const [squadName, setSquadName] = useState(initialSquad?.name || "");
  const [members, setMembers] = useState(
    initialSquad?.members.map((m) => ({
      id: m.id,
      gamertag: m.gamertag,
      level: m.level,
      favorite_class: m.favorite_class,
      slot_number: m.slot_number,
      user_id: m.user_id
    })) || [
      {
        gamertag: profile?.gamertag || "",
        level: profile?.level || 1,
        favorite_class: profile?.favorite_class || "Asalto",
        slot_number: 1
      },
      {
        gamertag: "",
        level: 1,
        favorite_class: "Soporte",
        slot_number: 2
      },
      {
        gamertag: "",
        level: 1,
        favorite_class: "Recon",
        slot_number: 3
      },
      {
        gamertag: "",
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
    if (!initialSquad) {
      const validationError = validateMembers(members);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    const membersToSubmit = members.map((m) => {
      if (m.slot_number === 1) {
        return m;
      }
      return {
        ...m,
        gamertag: m.gamertag.trim() || `Operador ${m.slot_number}`,
        level: m.level || 1
      };
    });
    setLoading(false);
    try {
      setLoading(true);
      if (initialSquad) {
        const { error: actionError } = await actions.squad.update({
          squadId: initialSquad.id,
          name: squadName
        });
        if (actionError) {
          throw actionError;
        }
      } else {
        const { error: actionError } = await actions.squad.create({
          name: squadName,
          members: membersToSubmit
        });
        if (actionError) {
          throw actionError;
        }
      }
      window.location.href = "/dashboard/squad";
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Ocurrió un error inesperado al guardar el escuadrón.";
      setError(message);
      setLoading(false);
    }
  };
  let subtitle = "Paso 2: Registrar integrantes (4 operadores)";
  if (initialSquad) {
    subtitle = "Modifica el nombre de tu escuadrón";
  } else if (step === 1) {
    subtitle = "Paso 1: Nombre de tu equipo";
  }
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm xl:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-foreground text-xl tracking-tight", children: initialSquad ? "Editar Escuadrón" : "Configuración del Escuadrón" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 font-light text-muted-foreground text-sm", children: subtitle })
      ] }),
      !initialSquad && /* @__PURE__ */ jsxs("div", { className: "font-mono text-muted-foreground text-xs", children: [
        "Paso ",
        step,
        " de 2"
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-md bg-destructive/10 p-3 font-light text-destructive text-sm", children: error }),
    initialSquad && /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
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
        /* @__PURE__ */ jsx(Button, { disabled: loading, type: "submit", children: loading ? "Guardando..." : "Guardar Cambios" })
      ] })
    ] }),
    !initialSquad && step === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
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
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleNext();
              }
            },
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
    ] }),
    !initialSquad && step === 2 && /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: members.filter((m) => !showOnlySlot1 || m.slot_number === 1).map((member) => {
        const originalIndex = members.findIndex(
          (x) => x.slot_number === member.slot_number
        );
        const isLeader = member.slot_number === 1;
        const hasUser = member.user_id !== null && member.user_id !== void 0;
        const isDisabled = !(isLeader || hasUser);
        const disableGamertagAndLevel = isDisabled || isLeader;
        return /* @__PURE__ */ jsx(
          MemberRow,
          {
            disableGamertagAndLevel,
            handleMemberChange,
            isDisabled,
            member,
            originalIndex
          },
          member.slot_number
        );
      }) }),
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

export { OperatorAvatar as O, SquadWizard as S, SquadSidebar as a, cleanGamertag as c };
