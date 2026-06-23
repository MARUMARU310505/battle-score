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
  squad: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(3),
        members: z
          .array(
            z.object({
              gamertag: z.string().min(2),
              real_name: z.string().min(2),
              level: z.number().min(1),
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

        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .insert({ name: input.name, owner_id: user.id })
          .select()
          .single();

        if (squadError) {
          console.error("Error creating squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear el escuadrón: ${squadError.message}`,
          });
        }

        const membersToInsert = input.members.map((m) => ({
          squad_id: squad.id,
          gamertag: m.gamertag,
          real_name: m.real_name,
          level: m.level,
          favorite_class: m.favorite_class,
          slot_number: m.slot_number,
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

        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .select("*")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (squadError) {
          console.error("Error fetching squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el escuadrón",
          });
        }

        if (!squad) {
          return null;
        }

        const { data: members, error: membersError } = await supabase
          .from("squad_members")
          .select("*")
          .eq("squad_id", squad.id)
          .order("slot_number", { ascending: true });

        if (membersError) {
          console.error("Error fetching members:", membersError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar integrantes del escuadrón",
          });
        }

        return {
          ...squad,
          members,
        };
      },
    }),
    update: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        name: z.string().min(3),
        members: z
          .array(
            z.object({
              id: z.string().uuid().optional(),
              gamertag: z.string().min(2),
              real_name: z.string().min(2),
              level: z.number().min(1),
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

        for (const m of input.members) {
          const { error: memberError } = await supabase
            .from("squad_members")
            .upsert(
              {
                id: m.id,
                squad_id: input.squadId,
                gamertag: m.gamertag,
                real_name: m.real_name,
                level: m.level,
                favorite_class: m.favorite_class,
                slot_number: m.slot_number,
              },
              {
                onConflict: "squad_id,slot_number",
              }
            );

          if (memberError) {
            console.error("Error upserting member:", memberError);
            throw new ActionError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Error al actualizar integrantes: ${memberError.message}`,
            });
          }
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
