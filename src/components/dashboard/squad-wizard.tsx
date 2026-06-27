import { actions } from "astro:actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MemberInput {
  favorite_class: string;
  gamertag: string;
  id?: string;
  level: number;
  slot_number: number;
  user_id?: string | null;
}

interface SquadWizardProps {
  initialSquad?: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      gamertag: string;
      level: number;
      favorite_class: string;
      slot_number: number;
      user_id?: string | null;
    }>;
  } | null;
  onCancel?: () => void;
  profile?: {
    favorite_class?: string;
    gamertag: string;
    level: number;
  } | null;
}

const CLASSES = ["Asalto", "Soporte", "Recon", "Ingeniero"];

function validateMembers(members: MemberInput[]): string | null {
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

interface MemberRowProps {
  disableGamertagAndLevel: boolean;
  handleMemberChange: (
    index: number,
    field: keyof MemberInput,
    value: string | number
  ) => void;
  isDisabled: boolean;
  member: MemberInput;
  originalIndex: number;
}

function MemberRow({
  member,
  originalIndex,
  isDisabled,
  disableGamertagAndLevel,
  handleMemberChange,
}: MemberRowProps) {
  const isLeader = member.slot_number === 1;

  return (
    <div className="space-y-4 rounded-md border border-border/60 bg-background/50 p-4">
      <div className="flex items-center justify-between border-border/40 border-b pb-2">
        <span className="font-mono font-semibold text-muted-foreground text-xs uppercase">
          Operador #{member.slot_number} {isLeader && "(Líder)"}
        </span>
        {isDisabled && (
          <span className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-500 uppercase">
            Invitación Pendiente (No se puede editar)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-xs"
            htmlFor={`gamertag-${member.slot_number}`}
          >
            Gamertag
          </label>
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
            disabled={disableGamertagAndLevel}
            id={`gamertag-${member.slot_number}`}
            onChange={(e) =>
              handleMemberChange(originalIndex, "gamertag", e.target.value)
            }
            placeholder="Ej. Ghost"
            type="text"
            value={member.gamertag}
          />
        </div>
        <div>
          <label
            className="mb-1 block font-medium text-muted-foreground text-xs"
            htmlFor={`level-${member.slot_number}`}
          >
            Nivel
          </label>
          <input
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
            disabled={disableGamertagAndLevel}
            id={`level-${member.slot_number}`}
            min="1"
            onChange={(e) =>
              handleMemberChange(
                originalIndex,
                "level",
                Number.parseInt(e.target.value, 10) || 1
              )
            }
            type="number"
            value={member.level}
          />
        </div>
        <div className="xl:col-span-2">
          <label
            className="mb-1 block font-medium text-muted-foreground text-xs"
            htmlFor={`favorite_class-${member.slot_number}`}
          >
            Clase Favorita
          </label>
          <select
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
            disabled={isDisabled}
            id={`favorite_class-${member.slot_number}`}
            onChange={(e) =>
              handleMemberChange(
                originalIndex,
                "favorite_class",
                e.target.value
              )
            }
            value={member.favorite_class}
          >
            {CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function SquadWizard({
  initialSquad = null,
  profile = null,
  onCancel,
}: SquadWizardProps) {
  const showOnlySlot1 = !initialSquad;
  const [step, setStep] = useState(1);
  const [squadName, setSquadName] = useState(initialSquad?.name || "");
  const [slotCount, setSlotCount] = useState(initialSquad?.slot_count || 4);
  const [accessCode, setAccessCode] = useState(initialSquad?.access_code || "");
  const [members, setMembers] = useState<MemberInput[]>(
    initialSquad?.members.map((m) => ({
      id: m.id,
      gamertag: m.gamertag,
      level: m.level,
      favorite_class: m.favorite_class,
      slot_number: m.slot_number,
      user_id: m.user_id,
    })) ||
      (() => {
        const baseMember = {
          gamertag: profile?.gamertag || "",
          level: profile?.level || 1,
          favorite_class: profile?.favorite_class || "Asalto",
          slot_number: 1,
        };
        const otherMembers = Array.from({ length: slotCount - 1 }).map(
          (_, i) => ({
            gamertag: "",
            level: 1,
            favorite_class: CLASSES[i % CLASSES.length] || "Asalto",
            slot_number: i + 2,
          })
        );
        return [baseMember, ...otherMembers];
      })()
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMemberChange = (
    index: number,
    field: keyof MemberInput,
    value: string | number
  ) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleNext = () => {
    if (squadName.trim().length < 3) {
      setError("El nombre del escuadrón debe tener al menos 3 caracteres.");
      return;
    }
    if (slotCount < 1 || slotCount > 8) {
      setError("El número de slots debe estar entre 1 y 8.");
      return;
    }
    // Only keep the leader (slot 1) — empty slots are just a count, not real members
    setMembers((prev) => {
      const baseMember = prev[0] || {
        gamertag: profile?.gamertag || "",
        level: profile?.level || 1,
        favorite_class: profile?.favorite_class || "Asalto",
        slot_number: 1,
      };
      return [baseMember];
    });
    setError(null);
    setStep(2);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!initialSquad) {
      const validationError = validateMembers(members);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Only submit the leader (slot 1) — empty slots are tracked via slotCount only
    const membersToSubmit = members.filter((m) => m.slot_number === 1);

    setLoading(false);
    try {
      setLoading(true);
      if (initialSquad) {
        // Edit mode
        const { error: actionError } = await actions.squad.update({
          squadId: initialSquad.id,
          name: squadName,
        });
        if (actionError) {
          throw actionError;
        }
      } else {
        // Create mode
        const { error: actionError } = await actions.squad.create({
          name: squadName,
          members: membersToSubmit,
          slotCount,
          accessCode,
        });
        if (actionError) {
          throw actionError;
        }
      }

      // Success - Redirect to active squad dashboard
      window.location.href = "/dashboard/squad";
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al guardar el escuadrón.";
      setError(message);
      setLoading(false);
    }
  };

  let subtitle = "Paso 2: Registrar integrantes";
  if (initialSquad) {
    subtitle = "Modifica el nombre de tu escuadrón";
  } else if (step === 1) {
    subtitle = "Paso 1: Información básica";
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm xl:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-foreground text-xl tracking-tight">
            {initialSquad ? "Editar Escuadrón" : "Configuración del Escuadrón"}
          </h2>
          <p className="mt-1 font-light text-muted-foreground text-sm">
            {subtitle}
          </p>
        </div>
        {!initialSquad && (
          <div className="font-mono text-muted-foreground text-xs">
            Paso {step} de 2
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-3 font-light text-destructive text-sm">
          {error}
        </div>
      )}

      {initialSquad && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block font-medium text-foreground text-sm"
              htmlFor="squadName"
            >
              Nombre del Escuadrón
            </label>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              id="squadName"
              onChange={(e) => setSquadName(e.target.value)}
              placeholder="Ej. Alpha Team, Battle Score BR, etc."
              type="text"
              value={squadName}
            />
          </div>
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button onClick={onCancel} type="button" variant="outline">
                Cancelar
              </Button>
            )}
            <Button disabled={loading} type="submit">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      )}

      {!initialSquad && step === 1 && (
        <div className="space-y-6">
          <div>
            <label
              className="mb-2 block font-medium text-foreground text-sm"
              htmlFor="squadName"
            >
              Nombre del Escuadrón
            </label>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              id="squadName"
              onChange={(e) => setSquadName(e.target.value)}
              placeholder="Ej. Alpha Team, Battle Score BR, etc."
              type="text"
              value={squadName}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium text-foreground text-sm">
                Número de integrantes
              </label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
                onChange={(e) => setSlotCount(Number(e.target.value))}
                value={slotCount}
              >
                <option value={1}>1 Operador (Solo)</option>
                <option value={2}>2 Operadores (Dúo)</option>
                <option value={4}>4 Operadores (Cuarteto)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium text-foreground text-sm">
                Código de acceso
              </label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground text-sm"
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Opcional"
                value={accessCode}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button onClick={onCancel} type="button" variant="outline">
                Cancelar
              </Button>
            )}
            <Button onClick={handleNext} type="button">
              Siguiente Paso
            </Button>
          </div>
        </div>
      )}

      {!initialSquad && step === 2 && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {members
              .filter((m) => !showOnlySlot1 || m.slot_number === 1)
              .map((member) => {
                const originalIndex = members.findIndex(
                  (x) => x.slot_number === member.slot_number
                );
                const isLeader = member.slot_number === 1;
                const hasUser =
                  member.user_id !== null && member.user_id !== undefined;
                const isDisabled = !(isLeader || hasUser);

                // Disable Gamertag/Level inputs for Leader since they come from the global profile,
                // and disable completely for placeholder/invitation slots.
                const disableGamertagAndLevel = isDisabled || isLeader;

                return (
                  <MemberRow
                    disableGamertagAndLevel={disableGamertagAndLevel}
                    handleMemberChange={handleMemberChange}
                    isDisabled={isDisabled}
                    key={member.slot_number}
                    member={member}
                    originalIndex={originalIndex}
                  />
                );
              })}
          </div>

          <div className="flex justify-between gap-3">
            <Button
              disabled={loading}
              onClick={() => setStep(1)}
              type="button"
              variant="outline"
            >
              Atrás
            </Button>
            <div className="flex gap-3">
              {onCancel && (
                <Button
                  disabled={loading}
                  onClick={onCancel}
                  type="button"
                  variant="outline"
                >
                  Cancelar
                </Button>
              )}
              <Button disabled={loading} type="submit">
                {loading ? "Guardando..." : "Guardar Escuadrón"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
