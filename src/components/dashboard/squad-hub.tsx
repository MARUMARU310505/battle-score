import { actions } from "astro:actions";
import {
  Check,
  Copy,
  LogIn,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { SquadWizard } from "./squad-wizard";

export interface SquadMember {
  favorite_class: string;
  gamertag: string;
  id: string;
  is_active: boolean;
  level: number;
  slot_number: number;
  user_id: string | null;
}

export interface Squad {
  created_at: string;
  id: string;
  invite_code: string;
  name: string;
  owner_id: string;
  squad_members: SquadMember[];
}

interface Profile {
  gamertag: string;
  level: number;
}

interface SquadHubProps {
  currentUser: { email?: string; id: string };
  onNewSquadClick: () => void;
  profile: Profile | null;
  squads: Squad[];
}

export function SquadHubContainer({
  squads,
  currentUser,
  profile,
}: {
  squads: Squad[];
  currentUser: { email?: string; id: string };
  profile: Profile | null;
}) {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background p-8">
        <SquadWizard onCancel={() => setIsCreating(false)} profile={profile} />
      </div>
    );
  }

  return (
    <SquadHub
      currentUser={currentUser}
      onNewSquadClick={() => setIsCreating(true)}
      profile={profile}
      squads={squads}
    />
  );
}

export function SquadHub({
  squads,
  currentUser,
  onNewSquadClick,
  profile,
}: SquadHubProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundSquad, setFoundSquad] = useState<Squad | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [operatorClass, setOperatorClass] = useState("Asalto");

  const handleSelectSlot = (slotNum: number) => {
    setSelectedSlot(slotNum);
    const slotMember = foundSquad?.squad_members.find(
      (m) => m.slot_number === slotNum
    );
    if (slotMember) {
      setOperatorClass(slotMember.favorite_class || "Asalto");
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSearchCode = async (e: React.FormEvent) => {
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
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      if (error) {
        throw error;
      }

      setFoundSquad(data as unknown as Squad);
    } catch (err) {
      console.error(err);
      setSearchError(
        err instanceof Error ? err.message : "Código de invitación no válido"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSquad = async (e: React.FormEvent) => {
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
        favoriteClass: operatorClass,
      });

      if (error) {
        throw error;
      }

      // Success - redirect to squad dashboard
      window.location.href = "/dashboard/squad";
    } catch (err) {
      console.error(err);
      setSearchError(
        err instanceof Error ? err.message : "Error al unirse al escuadrón"
      );
      setLoading(false);
    }
  };

  const handleEnterSquad = async (squadId: string) => {
    try {
      const { error } = await actions.squad.setActive({ squadId });
      if (error) {
        throw error;
      }
      window.location.href = "/dashboard/squad";
    } catch (err) {
      console.error("Error setting active squad:", err);
    }
  };

  const handleLeaveSquad = async (squadId: string, slotNumber: number) => {
    // biome-ignore lint/suspicious/noAlert: standard web confirm is fine for simplicity here
    if (!confirm("¿Estás seguro de que deseas salir de este escuadrón?")) {
      return;
    }
    try {
      const { error } = await actions.squad.releaseSlot({
        squadId,
        slotNumber,
      });
      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (err) {
      console.error("Error leaving squad:", err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-border border-b pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight">
            Hub de Escuadrones
          </h1>
          <p className="mt-1 font-light text-muted-foreground text-sm">
            Elige un escuadrón activo, únete a uno existente usando un código, o
            crea uno nuevo.
          </p>
        </div>
        <Button
          className="flex items-center gap-1.5 self-start sm:self-center"
          onClick={onNewSquadClick}
        >
          <Plus className="h-4 w-4" />
          Crear Escuadrón
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left/Center: Your Squads list */}
        <div className="space-y-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold text-foreground text-lg tracking-tight">
            <Users className="h-5 w-5 text-muted-foreground" />
            Tus Escuadras
          </h2>

          {squads.length === 0 ? (
            <div className="rounded-xl border border-border border-dashed bg-card/10 p-12 text-center">
              <span className="mb-4 inline-block text-3xl">👥</span>
              <h3 className="font-semibold text-foreground text-sm">
                Aún no tienes escuadrones
              </h3>
              <p className="mx-auto mt-2 max-w-sm font-light text-muted-foreground text-xs">
                Crea uno nuevo usando el botón superior o pídele a un amigo su
                código de invitación para unirte a su escuadra.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {squads.map((squad) => {
                const isOwner = squad.owner_id === currentUser.id;
                const myMemberSlot = squad.squad_members.find(
                  (m) => m.user_id === currentUser.id
                );

                return (
                  <div
                    className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-xs transition-colors hover:border-border/80"
                    key={squad.id}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-bold text-foreground text-sm">
                          {squad.name}
                        </h3>
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 font-medium font-mono text-[10px] uppercase ${
                            isOwner
                              ? "border border-primary/20 bg-primary/10 text-primary"
                              : "border border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {isOwner ? "Creador" : "Miembro"}
                        </span>
                      </div>

                      {/* Members slots summary */}
                      <div className="mt-4 space-y-2 border-border/40 border-t pt-3">
                        {squad.squad_members
                          .sort((a, b) => a.slot_number - b.slot_number)
                          .map((member) => {
                            const isMe = member.user_id === currentUser.id;

                            return (
                              <div
                                className={`flex items-center justify-between rounded-md px-2 py-1 text-xs ${
                                  isMe
                                    ? "border border-primary/10 bg-primary/5 font-medium"
                                    : "bg-background/40"
                                }`}
                                key={member.id}
                              >
                                <span className="max-w-[120px] truncate text-muted-foreground">
                                  {member.slot_number === 1 ? "👑 " : "👤 "}
                                  {member.gamertag}
                                </span>
                                <div className="flex shrink-0 items-center gap-1.5">
                                  <span className="text-[10px] text-muted-foreground/80">
                                    Nivel {member.level}
                                  </span>
                                  <span className="rounded-sm bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
                                    {member.favorite_class}
                                  </span>
                                  {isMe && (
                                    <span className="font-bold text-[9px] text-primary uppercase">
                                      Tú
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {/* Invite code for owner */}
                      {isOwner && squad.invite_code && (
                        <div className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/50 px-2.5 py-1.5">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            Código:{" "}
                            <strong className="text-foreground tracking-wide">
                              {squad.invite_code}
                            </strong>
                          </span>
                          <button
                            className="cursor-pointer p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() =>
                              handleCopyCode(squad.invite_code, squad.id)
                            }
                            title="Copiar código de invitación"
                            type="button"
                          >
                            {copiedId === squad.id ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Entry buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 text-xs"
                          onClick={() => handleEnterSquad(squad.id)}
                          size="sm"
                        >
                          <LogIn className="mr-1.5 h-3.5 w-3.5" />
                          Entrar al Panel
                        </Button>
                        {!isOwner && myMemberSlot && (
                          <Button
                            className="px-2.5 text-destructive text-xs hover:bg-destructive/10"
                            onClick={() =>
                              handleLeaveSquad(
                                squad.id,
                                myMemberSlot.slot_number
                              )
                            }
                            size="sm"
                            title="Salir del escuadrón"
                            variant="ghost"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Join Squad by invite code card */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2 font-bold text-foreground text-lg tracking-tight">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            Unirse a Escuadra
          </h2>

          <div className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-xs">
            <p className="font-light text-muted-foreground text-xs leading-relaxed">
              Ingresa el código de invitación de tu líder de equipo para unirte
              como operador y reclamar un rol disponible.
            </p>

            {searchError && (
              <div className="rounded-md bg-destructive/10 p-3 text-destructive text-xs">
                {searchError}
              </div>
            )}

            <form className="flex gap-2" onSubmit={handleSearchCode}>
              <input
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-foreground text-sm uppercase placeholder:font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={loading}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Ej. BS-A9B8C7"
                type="text"
                value={inviteCode}
              />
              <Button disabled={loading} size="sm" type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Found Squad detail & Slot Claiming options */}
            {foundSquad && (
              <div className="mt-4 space-y-4 border-border border-t pt-4">
                <div>
                  <span className="font-mono text-[9px] text-muted-foreground uppercase">
                    Escuadrón Encontrado
                  </span>
                  <h3 className="font-bold text-foreground text-md">
                    {foundSquad.name}
                  </h3>
                </div>

                <div className="space-y-2">
                  <span className="block font-medium text-foreground text-xs">
                    Reclamar Rol Disponible:
                  </span>

                  {foundSquad.squad_members.filter((m) => m.user_id === null)
                    .length === 0 ? (
                    <p className="font-light text-destructive text-xs italic">
                      Este escuadrón ya no tiene slots libres disponibles.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {foundSquad.squad_members
                        .sort((a, b) => a.slot_number - b.slot_number)
                        .map((member) => {
                          const isClaimed = member.user_id !== null;
                          const isSelected =
                            selectedSlot === member.slot_number;
                          let buttonStyle =
                            "border-border bg-background/50 hover:border-border/80";
                          if (isClaimed) {
                            buttonStyle =
                              "cursor-not-allowed border-border bg-muted/30 opacity-40";
                          } else if (isSelected) {
                            buttonStyle = "border-primary bg-primary/5";
                          }

                          return (
                            <button
                              className={`flex w-full cursor-pointer items-center justify-between rounded-md border p-2 text-left text-xs transition-colors ${buttonStyle}`}
                              disabled={isClaimed}
                              key={member.id}
                              onClick={() =>
                                !isClaimed &&
                                handleSelectSlot(member.slot_number)
                              }
                              type="button"
                            >
                              <div>
                                <span className="font-semibold text-foreground">
                                  {member.slot_number === 1 ? "👑 " : "👤 "}
                                  Operador #{member.slot_number}
                                </span>
                                <p className="mt-0.5 text-[10px] text-muted-foreground">
                                  Gamertag predeterminado: {member.gamertag}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground uppercase">
                                {member.favorite_class}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>

                {selectedSlot !== null && (
                  <form
                    className="space-y-4 border-border border-t pt-4"
                    onSubmit={handleJoinSquad}
                  >
                    <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                      Datos de tu Operador (Slot #{selectedSlot})
                    </h4>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          className="mb-1 block font-medium text-[10px] text-muted-foreground"
                          htmlFor="hub-gamertag"
                        >
                          Gamertag
                        </label>
                        <input
                          className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled
                          id="hub-gamertag"
                          type="text"
                          value={profile?.gamertag || ""}
                        />
                      </div>

                      <div>
                        <label
                          className="mb-1 block font-medium text-[10px] text-muted-foreground"
                          htmlFor="hub-level"
                        >
                          Nivel
                        </label>
                        <input
                          className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:opacity-50"
                          disabled
                          id="hub-level"
                          type="number"
                          value={profile?.level || 1}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          className="mb-1 block font-medium text-[10px] text-muted-foreground"
                          htmlFor="hub-class"
                        >
                          Clase Favorita
                        </label>
                        <select
                          className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          id="hub-class"
                          onChange={(e) => setOperatorClass(e.target.value)}
                          value={operatorClass}
                        >
                          <option value="Asalto">Asalto</option>
                          <option value="Soporte">Soporte</option>
                          <option value="Recon">Recon</option>
                          <option value="Ingeniero">Ingeniero</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      className="w-full text-xs"
                      disabled={loading}
                      type="submit"
                    >
                      {loading
                        ? "Uniéndose..."
                        : `Unirse como Operador #${selectedSlot}`}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
