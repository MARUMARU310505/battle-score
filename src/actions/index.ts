import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { render } from "@react-email/render";
import { captureException } from "@sentry/astro";
import { Resend } from "resend";
import {
  EmailContact,
  type IFormContactData,
} from "@/components/email-template";
import { BUSINESS_CONFIG } from "@/config/business";
import { truncate } from "@/lib/truncate";

interface IEmailData {
  email: string;
  message?: string;
  name: string;
  phone: string;
}

const BCC_EMAIL = Array.isArray(BUSINESS_CONFIG.settings?.bccEmail)
  ? BUSINESS_CONFIG.settings?.bccEmail
  : [];
const EMAIL_SENDER = BUSINESS_CONFIG.settings.emailSender;
const resend = new Resend(
  import.meta.env.RESEND_API_KEY || "re_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
);

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z
        .string({
          required_error: "El nombre es requeridoo",
          invalid_type_error: "El nombre es requerido",
        })
        .min(3, {
          message: "El nombre debe tener al menos 3 caracteres",
        }),

      email: z
        .string({
          required_error: "Correo electrónico requerido",
          invalid_type_error: "Correo electrónico requerido",
        })
        .email({ message: "El correo electrónico no es válido." }),

      phone: z
        .string({
          required_error: "El número de teléfono es requerido",
          invalid_type_error: "El número de teléfono es requerido",
        })
        .min(8, {
          message: "El número de teléfono debe tener exactamente 8 caracteres",
        })
        .max(8, {
          message: "El número de teléfono debe tener exactamente 8 caracteres",
        })
        .regex(/^\d+$/, { message: "Solo se permiten números" }),

      message: z
        .string({
          invalid_type_error: "Mensaje no valido",
        })
        .max(300, {
          message: "El mensaje no puede exceder los 300 caracteres",
        })
        .nullable(),
    }),
    handler: async (contact: IEmailData) => {
      try {
        const { name, message, email, phone } = contact;
        const DATA_STRUCTURE: IFormContactData[] = [
          { name: "Nombre", value: name },
          { name: "Correo Electronico", value: email },
          { name: "Teléfono", value: phone },
          { name: "Mensaje", value: message },
        ];

        const preview: string = message
          ? truncate(message, 30)
          : "Datos del formulario de contacto";
        const isDev = import.meta.env.MODE === "development";
        const bcc = isDev
          ? []
          : BUSINESS_CONFIG.settings.resendToCompany
            ? [...BCC_EMAIL, BUSINESS_CONFIG.contact.email.trim()]
            : [...BCC_EMAIL];

        const resResend = await resend.emails.send({
          from: `${BUSINESS_CONFIG.name} <${EMAIL_SENDER}>`,
          to: contact.email.trim(),
          bcc,
          replyTo: BUSINESS_CONFIG.contact.email.trim(),
          subject: `Formulario de contacto - ${BUSINESS_CONFIG.name}`,
          html: await render(
            EmailContact({
              preview,
              business: {
                contactEmail: BUSINESS_CONFIG.contact.email.trim(),
                name: BUSINESS_CONFIG.name,
                website: BUSINESS_CONFIG.site,
              },
              logo: {
                src: "",
                width: 0,
              },
              data: DATA_STRUCTURE,
            })
          ),
        });

        if (resResend?.data?.id === undefined) {
          captureException(resResend.error, {
            level: "error",
            extra: { contact },
          });
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Error al enviar el correo electrónico",
          });
        }

        return { status: true, message: "Correo enviado exitosamente" };
      } catch (error) {
        captureException(error, { level: "error", extra: { contact } });
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Error al enviar el correo electrónico",
        });
      }
    },
  }),
  profile: {
    get: defineAction({
      accept: "json",
      handler: async (_, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para continuar",
          });
        }
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al obtener el perfil",
          });
        }
        return profile;
      },
    }),
    save: defineAction({
      accept: "json",
      input: z.object({
        gamertag: z.string().min(2),
        level: z.number().min(1),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para guardar tu perfil",
          });
        }
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            gamertag: input.gamertag,
            level: input.level,
          },
          {
            onConflict: "id",
          }
        );

        if (error) {
          console.error("Error saving profile:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al guardar el perfil: ${error.message}`,
          });
        }

        // Sync with squad_members slots where this user is linked
        const { error: syncError } = await supabase
          .from("squad_members")
          .update({
            gamertag: input.gamertag,
            level: input.level,
          })
          .eq("user_id", user.id);

        if (syncError) {
          console.error("Error syncing profile with squad members:", syncError);
        }

        return { success: true };
      },
    }),
  },
  squad: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(3),
        members: z
          .array(
            z.object({
              favorite_class: z.string(),
              slot_number: z.number().min(1).max(4),
            })
          )
          .length(4),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para crear un escuadrón",
          });
        }

        // Fetch creator's profile first
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("gamertag, level")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          throw new ActionError({
            code: "NOT_FOUND",
            message:
              "Por favor configura tu perfil de operador primero antes de crear una escuadra",
          });
        }

        // Generate a random 6-character code (BS-XXXXXX)
        const generateInviteCode = () => {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let code = "BS-";
          for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return code;
        };

        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .insert({
            name: input.name,
            owner_id: user.id,
            invite_code: generateInviteCode(),
          })
          .select()
          .single();

        if (squadError) {
          console.error("Error creating squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear el escuadrón: ${squadError.message}`,
          });
        }

        const membersToInsert = input.members.map((m) => {
          const isLeader = m.slot_number === 1;
          return {
            squad_id: squad.id,
            gamertag: isLeader ? profile.gamertag : `Operador ${m.slot_number}`,
            level: isLeader ? profile.level : 1,
            favorite_class: m.favorite_class,
            slot_number: m.slot_number,
            user_id: isLeader ? user.id : null,
            is_active: isLeader,
          };
        });

        const { error: membersError } = await supabase
          .from("squad_members")
          .insert(membersToInsert);

        if (membersError) {
          console.error("Error creating members:", membersError);
          await supabase.from("squads").delete().eq("id", squad.id);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al registrar integrantes: ${membersError.message}`,
          });
        }

        // Set as active squad in cookies
        context.cookies.set("active_squad_id", squad.id, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
        });

        return { success: true, squad };
      },
    }),
    get: defineAction({
      accept: "json",
      handler: async (_, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver su escuadrón",
          });
        }

        // 1. Get squads owned by user
        const { data: ownedSquads, error: ownedError } = await supabase
          .from("squads")
          .select("id, name")
          .eq("owner_id", user.id);

        if (ownedError) {
          console.error("Error fetching owned squads:", ownedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar los escuadrones del creador",
          });
        }

        // 2. Get squads joined by user
        const { data: joinedMembers, error: joinedError } = await supabase
          .from("squad_members")
          .select("squad_id")
          .eq("user_id", user.id);

        if (joinedError) {
          console.error("Error fetching joined squad IDs:", joinedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar las escuadras asociadas",
          });
        }

        const joinedSquadIds = (joinedMembers || [])
          .map((m) => m.squad_id)
          .filter((id) => !ownedSquads?.some((s) => s.id === id));

        let joinedSquads: { id: string; name: string }[] = [];
        if (joinedSquadIds.length > 0) {
          const { data, error: fetchJoinedError } = await supabase
            .from("squads")
            .select("id, name")
            .in("id", joinedSquadIds);

          if (fetchJoinedError) {
            console.error("Error fetching joined squads:", fetchJoinedError);
            throw new ActionError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al consultar los escuadrones asociados",
            });
          }
          joinedSquads = data || [];
        }

        const squads = [...(ownedSquads || []), ...joinedSquads];

        if (squads.length === 0) {
          return { activeSquad: null, allSquads: [] };
        }

        // Determine active squad ID from cookie
        const activeSquadId = context.cookies.get("active_squad_id")?.value;
        let activeSquad = squads.find((s) => s.id === activeSquadId);

        // Default to first squad if no cookie or cookie squad is not in user's squads
        if (!activeSquad) {
          activeSquad = squads[0];
          // Update cookie to keep it in sync
          context.cookies.set("active_squad_id", activeSquad.id, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365,
          });
        }

        // Fetch full squad details for active squad
        const { data: squadDetails, error: squadError } = await supabase
          .from("squads")
          .select("*")
          .eq("id", activeSquad.id)
          .single();

        if (squadError) {
          console.error("Error fetching active squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el escuadrón activo",
          });
        }

        const { data: members, error: membersError } = await supabase
          .from("squad_members")
          .select("*")
          .eq("squad_id", activeSquad.id)
          .order("slot_number", { ascending: true });

        if (membersError) {
          console.error("Error fetching members:", membersError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar integrantes del escuadrón",
          });
        }

        return {
          activeSquad: {
            ...squadDetails,
            members,
          },
          allSquads: squads,
        };
      },
    }),
    update: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        name: z.string().min(3),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para modificar el escuadrón",
          });
        }

        const { error: squadError } = await supabase
          .from("squads")
          .update({ name: input.name })
          .eq("id", input.squadId)
          .eq("owner_id", user.id);

        if (squadError) {
          console.error("Error updating squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al actualizar el escuadrón",
          });
        }

        return { success: true };
      },
    }),
    setActive: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para seleccionar un escuadrón",
          });
        }

        // Check if user is owner
        const { data: ownedSquad } = await supabase
          .from("squads")
          .select("id")
          .eq("id", input.squadId)
          .eq("owner_id", user.id)
          .maybeSingle();

        let canAccess = !!ownedSquad;

        if (!canAccess) {
          // Check if user is member
          const { data: joinedMember } = await supabase
            .from("squad_members")
            .select("id")
            .eq("squad_id", input.squadId)
            .eq("user_id", user.id)
            .maybeSingle();

          if (joinedMember) {
            canAccess = true;
          }
        }

        if (!canAccess) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "El escuadrón no existe o no perteneces a él",
          });
        }

        context.cookies.set("active_squad_id", input.squadId, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
        });

        return { success: true };
      },
    }),
    getHubData: defineAction({
      accept: "json",
      handler: async (_, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver sus escuadrones",
          });
        }

        // 1. Fetch squads owned by user
        const { data: ownedSquads, error: ownedError } = await supabase
          .from("squads")
          .select(`
            id,
            name,
            owner_id,
            invite_code,
            created_at,
            squad_members (
              id,
              gamertag,
              level,
              favorite_class,
              slot_number,
              user_id,
              is_active
            )
          `)
          .eq("owner_id", user.id);

        if (ownedError) {
          console.error("Error fetching owned squads:", ownedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar los escuadrones del creador",
          });
        }

        // 2. Fetch squads joined by user
        const { data: joinedMembers, error: joinedError } = await supabase
          .from("squad_members")
          .select("squad_id")
          .eq("user_id", user.id);

        if (joinedError) {
          console.error("Error fetching joined squad IDs:", joinedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar las escuadras asociadas",
          });
        }

        const joinedSquadIds = (joinedMembers || [])
          .map((m) => m.squad_id)
          .filter((id) => !ownedSquads?.some((s) => s.id === id));

        let joinedSquads: {
          id: string;
          name: string;
          owner_id: string;
          invite_code: string;
          created_at: string;
          squad_members: {
            id: string;
            gamertag: string;
            level: number;
            favorite_class: string;
            slot_number: number;
            user_id: string | null;
            is_active: boolean;
          }[];
        }[] = [];
        if (joinedSquadIds.length > 0) {
          const { data, error: fetchJoinedError } = await supabase
            .from("squads")
            .select(`
              id,
              name,
              owner_id,
              invite_code,
              created_at,
              squad_members (
                id,
                gamertag,
                level,
                favorite_class,
                slot_number,
                user_id,
                is_active
              )
            `)
            .in("id", joinedSquadIds);

          if (fetchJoinedError) {
            console.error("Error fetching joined squads:", fetchJoinedError);
            throw new ActionError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al consultar los escuadrones asociados",
            });
          }
          joinedSquads = data || [];
        }

        // Combine and sort by created_at desc
        const allSquads = [...(ownedSquads || []), ...joinedSquads].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return allSquads;
      },
    }),
    getSquadByCode: defineAction({
      accept: "json",
      input: z.object({
        inviteCode: z.string().min(4),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para buscar el escuadrón",
          });
        }

        const { data: squad, error } = await supabase
          .from("squads")
          .select(`
            id,
            name,
            owner_id,
            invite_code,
            squad_members (
              id,
              gamertag,
              level,
              favorite_class,
              slot_number,
              user_id,
              is_active
            )
          `)
          .eq("invite_code", input.inviteCode.trim().toUpperCase())
          .maybeSingle();

        if (error) {
          console.error("Error searching squad by code:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al buscar el escuadrón",
          });
        }

        if (!squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Código de invitación no válido o escuadrón no encontrado",
          });
        }

        return squad;
      },
    }),
    claimSlot: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
        favoriteClass: z.string(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para unirte al escuadrón",
          });
        }

        // Fetch user's profile first
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("gamertag, level")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Por favor configura tu perfil de operador primero",
          });
        }

        // Verify if slot is already claimed
        const { data: existingMember, error: fetchError } = await supabase
          .from("squad_members")
          .select("id, user_id")
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber)
          .maybeSingle();

        if (fetchError || !existingMember) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "El slot seleccionado no es válido",
          });
        }

        if (existingMember.user_id) {
          throw new ActionError({
            code: "CONFLICT",
            message: "Este slot ya ha sido reclamado por otro jugador",
          });
        }

        // Link the user to the member slot and update their info using profile values
        const { error: claimError } = await supabase
          .from("squad_members")
          .update({
            user_id: user.id,
            gamertag: profile.gamertag,
            level: profile.level,
            favorite_class: input.favoriteClass,
            is_active: true,
          })
          .eq("id", existingMember.id);

        if (claimError) {
          console.error("Error claiming slot:", claimError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al reclamar el slot de operador",
          });
        }

        // Set as active squad in cookies
        context.cookies.set("active_squad_id", input.squadId, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365,
        });

        return { success: true };
      },
    }),
    releaseSlot: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para salir del escuadrón",
          });
        }

        // Fetch squad owner and slot details
        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .select("owner_id")
          .eq("id", input.squadId)
          .maybeSingle();

        if (squadError || !squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Escuadrón no encontrado",
          });
        }

        const { data: member, error: memberError } = await supabase
          .from("squad_members")
          .select("user_id")
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber)
          .maybeSingle();

        if (memberError || !member) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Operador no encontrado",
          });
        }

        const isOwner = squad.owner_id === user.id;
        const isSelf = member.user_id === user.id;

        if (!(isOwner || isSelf)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "No tienes permiso para liberar este slot",
          });
        }

        // Unlink and reset to placeholder
        const { error } = await supabase
          .from("squad_members")
          .update({
            user_id: null,
            gamertag: `Operador ${input.slotNumber}`,
            level: 1,
            is_active: false,
          })
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber);

        if (error) {
          console.error("Error releasing slot:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al desvincular el rol de operador",
          });
        }

        // Clear active squad cookie if it matches
        const activeSquadId = context.cookies.get("active_squad_id")?.value;
        if (activeSquadId === input.squadId) {
          context.cookies.delete("active_squad_id", { path: "/" });
        }

        return { success: true };
      },
    }),
    setIsActive: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
        isActive: z.boolean(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para realizar esta acción",
          });
        }

        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .select("owner_id")
          .eq("id", input.squadId)
          .maybeSingle();

        if (squadError || !squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Escuadrón no encontrado",
          });
        }

        if (squad.owner_id !== user.id) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message:
              "Solo el líder del escuadrón puede cambiar el estado de los integrantes",
          });
        }

        const { error } = await supabase
          .from("squad_members")
          .update({ is_active: input.isActive })
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber);

        if (error) {
          console.error("Error setting member active state:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al cambiar el estado del integrante",
          });
        }

        return { success: true };
      },
    }),
    delete: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para eliminar el escuadrón",
          });
        }

        const { error } = await supabase
          .from("squads")
          .delete()
          .eq("id", input.squadId)
          .eq("owner_id", user.id);

        if (error) {
          console.error("Error deleting squad:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al eliminar el escuadrón: ${error.message}`,
          });
        }

        const activeSquadId = context.cookies.get("active_squad_id")?.value;
        if (activeSquadId === input.squadId) {
          context.cookies.delete("active_squad_id", { path: "/" });
        }

        return { success: true };
      },
    }),
  },
  session: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(1),
        squadId: z.string().uuid(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para crear una sesión",
          });
        }

        // Deactivate any existing active session for this squad first
        const { error: deactivateError } = await supabase
          .from("game_sessions")
          .update({ status: "completed", closed_at: new Date().toISOString() })
          .eq("squad_id", input.squadId)
          .eq("status", "active");

        if (deactivateError) {
          console.error("Error deactivating sessions:", deactivateError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al preparar sesiones anteriores",
          });
        }

        const { data: session, error: createError } = await supabase
          .from("game_sessions")
          .insert({
            squad_id: input.squadId,
            name: input.name,
            status: "active",
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating session:", createError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear la sesión: ${createError.message}`,
          });
        }

        return session;
      },
    }),
    getActive: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver sesiones",
          });
        }

        const { data: session, error: getError } = await supabase
          .from("game_sessions")
          .select("*")
          .eq("squad_id", input.squadId)
          .eq("status", "active")
          .maybeSingle();

        if (getError) {
          console.error("Error getting active session:", getError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar la sesión activa",
          });
        }

        return session;
      },
    }),
    close: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para cerrar la sesión",
          });
        }

        const { data: session, error: closeError } = await supabase
          .from("game_sessions")
          .update({
            status: "completed",
            closed_at: new Date().toISOString(),
          })
          .eq("id", input.sessionId)
          .select()
          .single();

        if (closeError) {
          console.error("Error closing session:", closeError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al cerrar la sesión",
          });
        }

        return session;
      },
    }),
  },
};
