!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"9aa1f11240b5d340e4026a0e80081cd252d2d44d"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="eca0974e-eaad-446a-9d6b-91d96fa590f9",e._sentryDebugIdIdentifier="sentry-dbid-eca0974e-eaad-446a-9d6b-91d96fa590f9");}catch(e){}}();import './server_DO_UlrIg.mjs';
import * as z from 'zod/v4';
import { render } from '@react-email/render';
import { captureException } from '@sentry/astro';
import { Resend } from 'resend';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Html, Head, Preview, Tailwind, Body, Container, Section, Link, Img, Text, Row, Column, Hr } from '@react-email/components';
import { twMerge } from 'tailwind-merge';
import { B as BUSINESS_CONFIG } from './business_Dj_wr3Kz.mjs';
import { d as defineAction, A as ActionError } from './entrypoint_Det9JS8i.mjs';

const resetText = { margin: 0 };
const translations = {
  es: {
    consultant: "Un consultor se pondrá en contacto con usted en breve.",
    moreInfo: "Para más información, contacta a:",
    poweredBy: "Powered by",
    socialLinks: {
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      helpCenter: "Centro de ayuda"
    },
    contactUs: "Contacta a nosotros si tienes alguna pregunta.",
    copyright: "Todos los derechos reservados."
  },
  en: {
    consultant: "A consultant will contact you shortly.",
    moreInfo: "For more information, contact:",
    poweredBy: "Powered by",
    socialLinks: {
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
      helpCenter: "Help Center"
    },
    contactUs: "Contact us if you have any questions.",
    copyright: "All rights reserved."
  }
};
const EmailContact = ({
  preview,
  title,
  subtitle,
  logo,
  business,
  data,
  lang = "es"
}) => {
  const t = translations[lang];
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: preview }),
    /* @__PURE__ */ jsx(Tailwind, { children: /* @__PURE__ */ jsx(
      Body,
      {
        className: "bg-white",
        style: {
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
        },
        children: /* @__PURE__ */ jsxs(Container, { className: "mx-auto my-[40px] w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]", children: [
          /* @__PURE__ */ jsx(Section, { className: "mt-[32px] max-w-[600px]", children: /* @__PURE__ */ jsx(Link, { className: "no-underline", href: business.website, children: /* @__PURE__ */ jsx(
            Img,
            {
              alt: logo?.alt ?? business.name,
              className: twMerge(
                "mx-auto my-0 h-auto",
                logo?.className ?? ""
              ),
              src: logo.src,
              style: {
                maxWidth: `${logo?.width}px`,
                width: `${logo?.width}px`
              }
            }
          ) }) }),
          /* @__PURE__ */ jsxs(Section, { className: "max-w-[600px]", children: [
            /* @__PURE__ */ jsx(Text, { className: "mx-0 my-[20px] p-0 text-center font-bold text-[24px] text-black", children: title }),
            subtitle !== null && /* @__PURE__ */ jsx(Text, { className: "text-[14px] text-black leading-[24px]", children: subtitle })
          ] }),
          /* @__PURE__ */ jsx(Section, { className: "max-w-[600px]", children: data.map((input) => {
            if (!(input?.showEmpty || input?.value)) {
              return null;
            }
            if (!input?.colSpan) {
              return /* @__PURE__ */ jsxs(Row, { children: [
                /* @__PURE__ */ jsxs(Column, { className: "w-[50%] py-2 pr-6 align-top font-bold text-[14px] text-black leading-[18px]", children: [
                  input.name,
                  ":"
                ] }),
                /* @__PURE__ */ jsx(Column, { className: "w-[50%] py-2 align-top text-[14px] text-black leading-[18px]", children: input.value ?? "" })
              ] }, input.name);
            }
            if (input.colSpan === "full") {
              return /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsxs(Column, { className: "w-[50%] py-2 pr-6 align-top font-bold text-[14px] text-black leading-[18px]", children: [
                  input.name,
                  ":"
                ] }) }),
                /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsx(Column, { className: "w-[50%] py-2 align-top text-[14px] text-black leading-[18px]", children: input.value }) })
              ] });
            }
            return null;
          }) }),
          /* @__PURE__ */ jsxs(Section, { className: "max-w-[600px]", children: [
            /* @__PURE__ */ jsx(Text, { className: "text-[14px] text-black leading-[24px]", children: t.consultant }),
            /* @__PURE__ */ jsxs(Text, { className: "text-[14px] text-black leading-[18px]", children: [
              t.moreInfo,
              " ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx(
                Link,
                {
                  className: "text-blue-600 no-underline",
                  href: `mailto:${business.contactEmail}`,
                  children: business.contactEmail
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(Hr, { className: "mx-0 my-[16px] w-full border border-[#eaeaea] border-solid" }),
          /* @__PURE__ */ jsxs(Section, { className: "mx-auto max-w-[560px] py-1 pb-[22px]", children: [
            /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsx(
              Text,
              {
                className: "py-4 text-center text-[#AFAFAF] text-sm",
                style: resetText,
                children: t.poweredBy
              }
            ) }),
            /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsx(Column, { className: "mb-4 pt-1 pb-4 text-center", children: /* @__PURE__ */ jsx(
              Link,
              {
                className: "no-underline",
                href: "https://elevenestudio.link/web",
                children: /* @__PURE__ */ jsx(
                  Img,
                  {
                    alt: "Eleven Estudio",
                    className: "mx-auto h-auto w-[120px] max-w-[120px]",
                    height: 494,
                    src: "https://storage.elevenestudio.me/logo-eleven.png",
                    width: 1256
                  }
                )
              }
            ) }) }),
            /* @__PURE__ */ jsxs(Row, { className: "mx-auto w-fit", children: [
              /* @__PURE__ */ jsx(Column, { className: "py-4 pr-4 text-center", children: /* @__PURE__ */ jsx(
                Link,
                {
                  className: "text-center text-gray-400 text-sm underline",
                  href: "https://elevenestudio.link/ig",
                  children: t.socialLinks.instagram
                }
              ) }),
              /* @__PURE__ */ jsx(Column, { className: "py-4 pr-4 text-center", children: /* @__PURE__ */ jsx(
                Link,
                {
                  className: "text-center text-gray-400 text-sm underline",
                  href: "https://elevenestudio.link/wa",
                  children: t.socialLinks.whatsapp
                }
              ) }),
              /* @__PURE__ */ jsx(Column, { className: "py-4 pr-4 text-center", children: /* @__PURE__ */ jsx(
                Link,
                {
                  className: "text-center text-gray-400 text-sm underline",
                  href: "https://elevenestudio.link/fb",
                  children: t.socialLinks.facebook
                }
              ) }),
              /* @__PURE__ */ jsx(Column, { className: "py-4 text-center", children: /* @__PURE__ */ jsx(
                Link,
                {
                  className: "text-center text-gray-400 text-sm underline",
                  href: "https://elevenestudio.link/help-center",
                  children: t.socialLinks.helpCenter
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsx(
              Text,
              {
                className: "mx-auto max-w-[65ch] py-1 text-center text-[#AFAFAF] text-sm leading-snug",
                style: resetText,
                children: t.contactUs
              }
            ) }),
            /* @__PURE__ */ jsx(Row, { children: /* @__PURE__ */ jsxs(
              Text,
              {
                className: "py-1 text-center text-[#AFAFAF] text-sm",
                style: resetText,
                children: [
                  "© ",
                  (/* @__PURE__ */ new Date()).getFullYear(),
                  " Eleven Corporation, S.A.",
                  " ",
                  t.copyright
                ]
              }
            ) })
          ] })
        ] })
      }
    ) })
  ] });
};

const truncate = (str, length) => {
  if (!str || str.length <= length) {
    return str;
  }
  return `${str.slice(0, length - 3)}${"..."}`;
};

const BCC_EMAIL = Array.isArray(BUSINESS_CONFIG.settings?.bccEmail) ? BUSINESS_CONFIG.settings?.bccEmail : [];
const EMAIL_SENDER = BUSINESS_CONFIG.settings.emailSender;
const resend = new Resend(
  "re_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
);
const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string({
        required_error: "El nombre es requeridoo",
        invalid_type_error: "El nombre es requerido"
      }).min(3, {
        message: "El nombre debe tener al menos 3 caracteres"
      }),
      email: z.string({
        required_error: "Correo electrónico requerido",
        invalid_type_error: "Correo electrónico requerido"
      }).email({ message: "El correo electrónico no es válido." }),
      phone: z.string({
        required_error: "El número de teléfono es requerido",
        invalid_type_error: "El número de teléfono es requerido"
      }).min(8, {
        message: "El número de teléfono debe tener exactamente 8 caracteres"
      }).max(8, {
        message: "El número de teléfono debe tener exactamente 8 caracteres"
      }).regex(/^\d+$/, { message: "Solo se permiten números" }),
      message: z.string({
        invalid_type_error: "Mensaje no valido"
      }).max(300, {
        message: "El mensaje no puede exceder los 300 caracteres"
      }).nullable()
    }),
    handler: async (contact) => {
      try {
        const { name, message, email, phone } = contact;
        const DATA_STRUCTURE = [
          { name: "Nombre", value: name },
          { name: "Correo Electronico", value: email },
          { name: "Teléfono", value: phone },
          { name: "Mensaje", value: message }
        ];
        const preview = message ? truncate(message, 30) : "Datos del formulario de contacto";
        const isDev = false;
        const bcc = isDev ? [] : BUSINESS_CONFIG.settings.resendToCompany ? [...BCC_EMAIL, BUSINESS_CONFIG.contact.email.trim()] : [...BCC_EMAIL];
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
                website: BUSINESS_CONFIG.site
              },
              logo: {
                src: "",
                width: 0
              },
              data: DATA_STRUCTURE
            })
          )
        });
        if (resResend?.data?.id === void 0) {
          captureException(resResend.error, {
            level: "error",
            extra: { contact }
          });
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Error al enviar el correo electrónico"
          });
        }
        return { status: true, message: "Correo enviado exitosamente" };
      } catch (error) {
        captureException(error, { level: "error", extra: { contact } });
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Error al enviar el correo electrónico"
        });
      }
    }
  }),
  squad: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(3),
        members: z.array(
          z.object({
            gamertag: z.string().min(2),
            real_name: z.string().min(2),
            level: z.number().min(1),
            favorite_class: z.string(),
            slot_number: z.number().min(1).max(4)
          })
        ).length(4)
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para crear un escuadrón"
          });
        }
        const { data: squad, error: squadError } = await supabase.from("squads").insert({ name: input.name, owner_id: user.id }).select().single();
        if (squadError) {
          console.error("Error creating squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear el escuadrón: ${squadError.message}`
          });
        }
        const membersToInsert = input.members.map((m) => ({
          squad_id: squad.id,
          gamertag: m.gamertag,
          real_name: m.real_name,
          level: m.level,
          favorite_class: m.favorite_class,
          slot_number: m.slot_number
        }));
        const { error: membersError } = await supabase.from("squad_members").insert(membersToInsert);
        if (membersError) {
          console.error("Error creating members:", membersError);
          await supabase.from("squads").delete().eq("id", squad.id);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al registrar integrantes: ${membersError.message}`
          });
        }
        return { success: true, squad };
      }
    }),
    get: defineAction({
      accept: "json",
      handler: async (_, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver su escuadrón"
          });
        }
        const { data: squad, error: squadError } = await supabase.from("squads").select("*").eq("owner_id", user.id).maybeSingle();
        if (squadError) {
          console.error("Error fetching squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el escuadrón"
          });
        }
        if (!squad) {
          return null;
        }
        const { data: members, error: membersError } = await supabase.from("squad_members").select("*").eq("squad_id", squad.id).order("slot_number", { ascending: true });
        if (membersError) {
          console.error("Error fetching members:", membersError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar integrantes del escuadrón"
          });
        }
        return {
          ...squad,
          members
        };
      }
    }),
    update: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        name: z.string().min(3),
        members: z.array(
          z.object({
            id: z.string().uuid().optional(),
            gamertag: z.string().min(2),
            real_name: z.string().min(2),
            level: z.number().min(1),
            favorite_class: z.string(),
            slot_number: z.number().min(1).max(4)
          })
        ).length(4)
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para modificar el escuadrón"
          });
        }
        const { error: squadError } = await supabase.from("squads").update({ name: input.name }).eq("id", input.squadId).eq("owner_id", user.id);
        if (squadError) {
          console.error("Error updating squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al actualizar el escuadrón"
          });
        }
        for (const m of input.members) {
          const { error: memberError } = await supabase.from("squad_members").upsert(
            {
              id: m.id,
              squad_id: input.squadId,
              gamertag: m.gamertag,
              real_name: m.real_name,
              level: m.level,
              favorite_class: m.favorite_class,
              slot_number: m.slot_number
            },
            {
              onConflict: "squad_id,slot_number"
            }
          );
          if (memberError) {
            console.error("Error upserting member:", memberError);
            throw new ActionError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Error al actualizar integrantes: ${memberError.message}`
            });
          }
        }
        return { success: true };
      }
    })
  }
};

export { server };
