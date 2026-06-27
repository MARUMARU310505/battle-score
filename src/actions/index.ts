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
        favoriteClass: z.string(),
        avatarSeed: z.string().optional().nullable(),
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
            favorite_class: input.favoriteClass,
            avatar_seed: input.avatarSeed || null,
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
            favorite_class: input.favoriteClass,
            avatar_seed: input.avatarSeed || null,
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
              gamertag: z.string().optional().default(""),
              level: z.number().optional().default(1),
              favorite_class: z.string(),
              slot_number: z.number().min(1).max(8),
            })
          )
          .min(1)
          .max(8),
        slotCount: z.number().min(1).max(8).default(4),
        accessCode: z.string().optional(),
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
          .select("gamertag, level, avatar_seed")
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
            slot_count: input.slotCount,
            access_code: input.accessCode ?? null,
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

        const membersToInsert = input.members
          .filter((m) => m.slot_number === 1)
          .map((m) => ({
            squad_id: squad.id,
            gamertag: profile.gamertag,
            level: profile.level,
            favorite_class: m.favorite_class,
            avatar_seed: profile.avatar_seed || null,
            slot_number: 1,
            user_id: user.id,
            is_active: true,
          }));

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
        // Empty slots are tracked via squads.slot_count only.
        // Players join empty slots later via the claimSlot action.

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
            slot_count,
            squad_members (
              id,
              gamertag,
              level,
              favorite_class,
              slot_number,
              user_id,
              is_active,
              avatar_seed
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
          slot_count?: number | null;
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
              slot_count,
              squad_members (
                id,
                gamertag,
                level,
                favorite_class,
                slot_number,
                user_id,
                is_active,
                avatar_seed
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
            slot_count,
            access_code,
            squad_members (
              id,
              gamertag,
              level,
              favorite_class,
              slot_number,
              user_id,
              is_active,
              avatar_seed
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

        // Ensure slot_count is present
        if (!squad.slot_count) {
          squad.slot_count = 4;
        }

        return squad;
      },
    }),
    claimSlot: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(8),
        favoriteClass: z.string(),
        accessCode: z.string().optional(),
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
          .select("gamertag, level, avatar_seed")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Por favor configura tu perfil de operador primero",
          });
        }
        // Fetch squad details for slot count and access code
        const { data: squadInfo, error: squadInfoError } = await supabase
          .from("squads")
          .select("slot_count, access_code")
          .eq("id", input.squadId)
          .single();
        if (squadInfoError) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al obtener información del escuadrón: ${squadInfoError.message}`,
          });
        }
        // Verify access code if required
        if (
          squadInfo.access_code &&
          input.accessCode !== squadInfo.access_code
        ) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Código de acceso incorrecto para este escuadrón",
          });
        }

        // Check if user is already a member of this squad in any slot
        const { data: alreadyMember, error: membershipError } = await supabase
          .from("squad_members")
          .select("id")
          .eq("squad_id", input.squadId)
          .eq("user_id", user.id)
          .maybeSingle();

        // Verify slot number does not exceed squad's slot count
        if (squadInfo && input.slotNumber > squadInfo.slot_count) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: `El número de slot (${input.slotNumber}) excede el límite del escuadrón (${squadInfo.slot_count})`,
          });
        }

        if (membershipError) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Error al verificar membresía de escuadra",
          });
        }

        if (alreadyMember) {
          throw new ActionError({
            code: "CONFLICT",
            message: "Ya estás dentro de la patrulla",
          });
        }

        // Verify if slot is already claimed
        const { data: existingMember, error: fetchError } = await supabase
          .from("squad_members")
          .select("id, user_id")
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber)
          .maybeSingle();

        if (fetchError) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Error al verificar el slot de operador",
          });
        }

        if (existingMember?.user_id) {
          throw new ActionError({
            code: "CONFLICT",
            message: "Este slot ya ha sido reclamado por otro jugador",
          });
        }

        let claimError;
        if (existingMember) {
          // Link the user to the existing member slot and update their info using profile values
          const { error } = await supabase
            .from("squad_members")
            .update({
              user_id: user.id,
              gamertag: profile.gamertag,
              level: profile.level,
              favorite_class: input.favoriteClass,
              avatar_seed: profile.avatar_seed || null,
              is_active: true,
            })
            .eq("id", existingMember.id);
          claimError = error;
        } else {
          // Insert a new member slot since it doesn't exist
          const { error } = await supabase.from("squad_members").insert({
            squad_id: input.squadId,
            slot_number: input.slotNumber,
            user_id: user.id,
            gamertag: profile.gamertag,
            level: profile.level,
            favorite_class: input.favoriteClass,
            avatar_seed: profile.avatar_seed || null,
            is_active: true,
          });
          claimError = error;
        }

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

        // Delete the member slot completely since it is released/unlinked
        const { error } = await supabase
          .from("squad_members")
          .delete()
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
    updateMemberStatus: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
        status: z.enum(["titular", "ausente"]),
        gamertag: z.string().optional(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión",
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
            message: "Solo el líder del escuadrón puede cambiar el estado",
          });
        }

        const isActive = input.status !== "ausente";

        const { error } = await supabase
          .from("squad_members")
          .update({
            status: input.status,
            is_active: isActive,
          })
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber);

        if (error) {
          console.error("Error updating member status in DB:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al cambiar el estado en base de datos",
          });
        }

        return { success: true };
      },
    }),
    updateMemberClass: defineAction({
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
            message: "Inicie sesión para continuar",
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
            message: "No tienes permiso para editar este operador",
          });
        }

        const { error } = await supabase
          .from("squad_members")
          .update({ favorite_class: input.favoriteClass })
          .eq("squad_id", input.squadId)
          .eq("slot_number", input.slotNumber);

        if (error) {
          console.error("Error updating member class:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al actualizar la clase favorita",
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
    getHistoricalStats: defineAction({
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
            message: "Inicie sesión para continuar",
          });
        }

        // 1. Fetch all session IDs for this squad
        const { data: sessions, error: sessionsError } = await supabase
          .from("game_sessions")
          .select("id, name, created_at")
          .eq("squad_id", input.squadId)
          .order("created_at", { ascending: true });

        if (sessionsError) {
          console.error("Error fetching sessions:", sessionsError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar las sesiones del escuadrón",
          });
        }

        const sessionIds = sessions?.map((s) => s.id) || [];
        if (sessionIds.length === 0) {
          return { matches: [], sessions: [] };
        }

        // 2. Fetch all matches with their player stats
        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select(`
            *,
            player_match_stats (*)
          `)
          .in("session_id", sessionIds)
          .order("created_at", { ascending: false });

        if (matchesError) {
          console.error("Error fetching historical matches:", matchesError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el historial de partidas",
          });
        }

        return { matches: matches || [], sessions: sessions || [] };
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
    startMatchRegistration: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid(),
        players: z.array(
          z.object({
            userId: z.string().uuid().nullable().optional(),
            gamertag: z.string(),
            activeClass: z.string(),
            avatarSeed: z.string().optional().nullable(),
          })
        ),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión",
          });
        }

        const initialDraft = {
          poi: "Desconocido",
          placement: 1,
          hostility: "Media",
          loot: "Normal",
          eliminationCause: "Ninguna",
          playerStats: input.players.map((p) => ({
            userId: p.userId || null,
            gamertag: p.gamertag,
            activeClass: p.activeClass,
            downs: 0,
            kills: 0,
            assists: 0,
            points: 0,
            respawned: false,
            endGame: false,
            mentalState: 3,
            avatarSeed: p.avatarSeed || null,
          })),
        };

        const { data, error } = await supabase
          .from("game_sessions")
          .update({
            is_registering_match: true,
            ready_players: [],
            match_registration_draft: initialDraft,
          })
          .eq("id", input.sessionId)
          .select()
          .single();

        if (error) {
          console.error("Error starting match registration:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        return data;
      },
    }),
    cancelMatchRegistration: defineAction({
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
            message: "Inicie sesión",
          });
        }

        const { data, error } = await supabase
          .from("game_sessions")
          .update({
            is_registering_match: false,
            ready_players: [],
            match_registration_draft: null,
          })
          .eq("id", input.sessionId)
          .select()
          .single();

        if (error) {
          console.error("Error cancelling match registration:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        return data;
      },
    }),
    updateMatchRegistrationDraft: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid(),
        draft: z.any(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión",
          });
        }

        const { data, error } = await supabase
          .from("game_sessions")
          .update({
            match_registration_draft: input.draft,
          })
          .eq("id", input.sessionId)
          .select()
          .single();

        if (error) {
          console.error("Error updating match registration draft:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        return data;
      },
    }),
    togglePlayerReady: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid(),
        userId: z.string().nullable().optional(),
        gamertag: z.string(),
        isReady: z.boolean(),
        playerStats: z.any().optional(),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión",
          });
        }

        const { data: session, error: getError } = await supabase
          .from("game_sessions")
          .select("ready_players, match_registration_draft")
          .eq("id", input.sessionId)
          .single();

        if (getError || !session) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Sesión no encontrada",
          });
        }

        let readyPlayers: string[] = [];
        try {
          readyPlayers = Array.isArray(session.ready_players)
            ? session.ready_players
            : typeof session.ready_players === "string"
              ? JSON.parse(session.ready_players)
              : [];
        } catch {
          readyPlayers = [];
        }

        const playerKey = input.gamertag;
        if (input.isReady) {
          if (!readyPlayers.includes(playerKey)) {
            readyPlayers.push(playerKey);
          }
        } else {
          readyPlayers = readyPlayers.filter((k) => k !== playerKey);
        }

        let updatedDraft = session.match_registration_draft;
        if (input.playerStats && updatedDraft?.playerStats) {
          const statsList = [...updatedDraft.playerStats];
          const playerIndex = statsList.findIndex(
            (p: any) => p.gamertag === input.gamertag
          );
          if (playerIndex !== -1) {
            statsList[playerIndex] = {
              ...statsList[playerIndex],
              ...input.playerStats,
            };
            updatedDraft = {
              ...updatedDraft,
              playerStats: statsList,
            };
          }
        }

        const { data, error } = await supabase
          .from("game_sessions")
          .update({
            ready_players: readyPlayers,
            match_registration_draft: updatedDraft,
          })
          .eq("id", input.sessionId)
          .select()
          .single();

        if (error) {
          console.error("Error toggling player ready:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        return data;
      },
    }),
    getHistory: defineAction({
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
            message: "Inicie sesión para ver el historial",
          });
        }

        // Fetch all completed sessions for this squad
        const { data: sessions, error: sessionsError } = await supabase
          .from("game_sessions")
          .select("*")
          .eq("squad_id", input.squadId)
          .eq("status", "completed")
          .order("closed_at", { ascending: false });

        if (sessionsError) {
          console.error("Error fetching session history:", sessionsError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el historial de sesiones",
          });
        }

        if (!sessions || sessions.length === 0) {
          return [];
        }

        // For each session, fetch match count and aggregated stats
        const enrichedSessions = await Promise.all(
          sessions.map(async (session) => {
            const { data: matches, error: matchesError } = await supabase
              .from("matches")
              .select("id, placement")
              .eq("session_id", session.id);

            if (matchesError) {
              console.error(
                "Error fetching matches for session:",
                matchesError
              );
              return {
                ...session,
                match_count: 0,
                avg_placement: 0,
                win_rate: 0,
              };
            }

            const matchCount = matches?.length || 0;
            const wins = matches?.filter((m) => m.placement === 1).length || 0;
            const avgPlacement =
              matchCount > 0
                ? matches.reduce((sum, m) => sum + m.placement, 0) / matchCount
                : 0;
            const winRate = matchCount > 0 ? (wins / matchCount) * 100 : 0;

            return {
              ...session,
              match_count: matchCount,
              avg_placement: Math.round(avgPlacement * 10) / 10,
              win_rate: Math.round(winRate),
            };
          })
        );

        return enrichedSessions;
      },
    }),
    getDetail: defineAction({
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
            message: "Inicie sesión para ver el detalle de la sesión",
          });
        }

        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select(`
            *,
            player_match_stats (*)
          `)
          .eq("session_id", input.sessionId)
          .order("created_at", { ascending: true });

        if (matchesError) {
          console.error("Error fetching session detail:", matchesError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el detalle de la sesión",
          });
        }

        return matches || [];
      },
    }),
  },
  match: {
    create: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid(),
        poi: z.string(),
        placement: z.number().min(1),
        hostility: z.string(),
        loot: z.string(),
        eliminationCause: z.string(),
        circleZone: z.string().nullable().optional(),
        deathZone: z.string().nullable().optional(),
        secondDeployZone: z.string().nullable().optional(),
        playerStats: z.array(
          z.object({
            userId: z.string().uuid().nullable().optional(),
            gamertag: z.string().min(1),
            activeClass: z.string(),
            downs: z.number().min(0),
            kills: z.number().min(0),
            assists: z.number().min(0),
            points: z.number().min(0),
            respawned: z.boolean(),
            endGame: z.boolean(),
            mentalState: z.number().min(1).max(5),
            avatarSeed: z.string().optional().nullable(),
          })
        ),
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para registrar una partida",
          });
        }

        const { data: match, error: matchError } = await supabase
          .from("matches")
          .insert({
            session_id: input.sessionId,
            poi: input.poi,
            placement: input.placement,
            hostility: input.hostility,
            loot: input.loot,
            elimination_cause: input.eliminationCause,
            circle_zone: input.circleZone || null,
            death_zone: input.deathZone || null,
            second_deploy_zone: input.secondDeployZone || null,
          })
          .select()
          .single();

        if (matchError) {
          console.error("Error creating match:", matchError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al registrar la partida: ${matchError.message}`,
          });
        }

        const statsToInsert = input.playerStats.map((ps) => ({
          match_id: match.id,
          user_id: ps.userId || null,
          gamertag: ps.gamertag,
          active_class: ps.activeClass,
          downs: ps.downs,
          kills: ps.kills,
          assists: ps.assists,
          points: ps.points,
          respawned: ps.respawned,
          end_game: ps.endGame,
          mental_state: ps.mentalState,
          avatar_seed: ps.avatarSeed || null,
        }));

        const { error: statsError } = await supabase
          .from("player_match_stats")
          .insert(statsToInsert);

        if (statsError) {
          console.error("Error creating player stats:", statsError);
          await supabase.from("matches").delete().eq("id", match.id);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al registrar estadísticas de jugadores: ${statsError.message}`,
          });
        }

        return { success: true, matchId: match.id };
      },
    }),
    list: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid(),
      }),
      handler: async (input, context: any) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver partidas",
          });
        }

        const { data: matches, error: matchesError } = await supabase
          .from("matches")
          .select(`
            *,
            player_match_stats (*)
          `)
          .eq("session_id", input.sessionId)
          .order("created_at", { ascending: true });

        if (matchesError) {
          console.error("Error listing matches:", matchesError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar las partidas",
          });
        }

        return matches;
      },
    }),
  },
};
