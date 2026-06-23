!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"c9cd6b3575bdb60f9b32c7442b601090456e57f9"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4b089760-0518-44fa-af93-2b9ce33143bf",e._sentryDebugIdIdentifier="sentry-dbid-4b089760-0518-44fa-af93-2b9ce33143bf");}catch(e){}}();import { jsxs, jsx } from 'react/jsx-runtime';
import { a as actions } from './server_68CCipZW.mjs';
import { useState } from 'react';
import { B as Button } from './nav_Bdhz0dcO.mjs';

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
    const validationError = validateMembers(members);
    if (validationError) {
      setError(validationError);
      return;
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
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: members.filter((m) => !showOnlySlot1 || m.slot_number === 1).map((member) => {
        const originalIndex = members.findIndex(
          (x) => x.slot_number === member.slot_number
        );
        const isLeader = member.slot_number === 1;
        const hasUser = member.user_id !== null && member.user_id !== void 0;
        const isDisabled = !(isLeader || hasUser);
        const disableGamertagAndLevel = isDisabled || isLeader;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "space-y-4 rounded-md border border-border/60 bg-background/50 p-4",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-border/40 border-b pb-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-muted-foreground text-xs uppercase", children: [
                  "Operador #",
                  member.slot_number,
                  " ",
                  isLeader && "(Líder)"
                ] }),
                isDisabled && /* @__PURE__ */ jsx("span", { className: "rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-500 uppercase", children: "Invitación Pendiente (No se puede editar)" })
              ] }),
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
                      className: "w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50",
                      disabled: disableGamertagAndLevel,
                      id: `gamertag-${member.slot_number}`,
                      onChange: (e) => handleMemberChange(
                        originalIndex,
                        "gamertag",
                        e.target.value
                      ),
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
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
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
            ]
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

export { SquadWizard as S };
