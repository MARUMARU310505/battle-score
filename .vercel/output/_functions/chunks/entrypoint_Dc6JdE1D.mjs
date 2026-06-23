!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"075032e6c1329a547b8a2023f2d78675c4707fcd"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="68ef7335-6b9c-48a5-99bc-5faa645072c7",e._sentryDebugIdIdentifier="sentry-dbid-68ef7335-6b9c-48a5-99bc-5faa645072c7");}catch(e){}}();import './server_Dg35aGgO.mjs';
import * as z from 'zod/v4';
import { render } from '@react-email/render';
import { captureException } from '@sentry/astro';
import { Resend } from 'resend';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Html, Head, Preview, Tailwind, Body, Container, Section, Link, Img, Text, Row, Column, Hr } from '@react-email/components';
import { twMerge } from 'tailwind-merge';
import { B as BUSINESS_CONFIG } from './business_ASKGTlnL.mjs';
import { d as defineAction, A as ActionError } from './entrypoint_zEdlSrfR.mjs';

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
  profile: {
    get: defineAction({
      accept: "json",
      handler: async (_, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para continuar"
          });
        }
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
        if (error) {
          console.error("Error fetching profile:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al obtener el perfil"
          });
        }
        return profile;
      }
    }),
    save: defineAction({
      accept: "json",
      input: z.object({
        gamertag: z.string().min(2),
        level: z.number().min(1),
        favoriteClass: z.string()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para guardar tu perfil"
          });
        }
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            gamertag: input.gamertag,
            level: input.level,
            favorite_class: input.favoriteClass
          },
          {
            onConflict: "id"
          }
        );
        if (error) {
          console.error("Error saving profile:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al guardar el perfil: ${error.message}`
          });
        }
        const { error: syncError } = await supabase.from("squad_members").update({
          gamertag: input.gamertag,
          level: input.level,
          favorite_class: input.favoriteClass
        }).eq("user_id", user.id);
        if (syncError) {
          console.error("Error syncing profile with squad members:", syncError);
        }
        return { success: true };
      }
    })
  },
  squad: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(3),
        members: z.array(
          z.object({
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
        const { data: profile, error: profileError } = await supabase.from("profiles").select("gamertag, level").eq("id", user.id).single();
        if (profileError || !profile) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Por favor configura tu perfil de operador primero antes de crear una escuadra"
          });
        }
        const generateInviteCode = () => {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let code = "BS-";
          for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return code;
        };
        const { data: squad, error: squadError } = await supabase.from("squads").insert({
          name: input.name,
          owner_id: user.id,
          invite_code: generateInviteCode()
        }).select().single();
        if (squadError) {
          console.error("Error creating squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear el escuadrón: ${squadError.message}`
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
            is_active: isLeader
          };
        });
        const { error: membersError } = await supabase.from("squad_members").insert(membersToInsert);
        if (membersError) {
          console.error("Error creating members:", membersError);
          await supabase.from("squads").delete().eq("id", squad.id);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al registrar integrantes: ${membersError.message}`
          });
        }
        context.cookies.set("active_squad_id", squad.id, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365
        });
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
        const { data: ownedSquads, error: ownedError } = await supabase.from("squads").select("id, name").eq("owner_id", user.id);
        if (ownedError) {
          console.error("Error fetching owned squads:", ownedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar los escuadrones del creador"
          });
        }
        const { data: joinedMembers, error: joinedError } = await supabase.from("squad_members").select("squad_id").eq("user_id", user.id);
        if (joinedError) {
          console.error("Error fetching joined squad IDs:", joinedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar las escuadras asociadas"
          });
        }
        const joinedSquadIds = (joinedMembers || []).map((m) => m.squad_id).filter((id) => !ownedSquads?.some((s) => s.id === id));
        let joinedSquads = [];
        if (joinedSquadIds.length > 0) {
          const { data, error: fetchJoinedError } = await supabase.from("squads").select("id, name").in("id", joinedSquadIds);
          if (fetchJoinedError) {
            console.error("Error fetching joined squads:", fetchJoinedError);
            throw new ActionError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al consultar los escuadrones asociados"
            });
          }
          joinedSquads = data || [];
        }
        const squads = [...ownedSquads || [], ...joinedSquads];
        if (squads.length === 0) {
          return { activeSquad: null, allSquads: [] };
        }
        const activeSquadId = context.cookies.get("active_squad_id")?.value;
        let activeSquad = squads.find((s) => s.id === activeSquadId);
        if (!activeSquad) {
          activeSquad = squads[0];
          context.cookies.set("active_squad_id", activeSquad.id, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365
          });
        }
        const { data: squadDetails, error: squadError } = await supabase.from("squads").select("*").eq("id", activeSquad.id).single();
        if (squadError) {
          console.error("Error fetching active squad:", squadError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar el escuadrón activo"
          });
        }
        const { data: members, error: membersError } = await supabase.from("squad_members").select("*").eq("squad_id", activeSquad.id).order("slot_number", { ascending: true });
        if (membersError) {
          console.error("Error fetching members:", membersError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar integrantes del escuadrón"
          });
        }
        return {
          activeSquad: {
            ...squadDetails,
            members
          },
          allSquads: squads
        };
      }
    }),
    update: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        name: z.string().min(3)
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
        return { success: true };
      }
    }),
    setActive: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para seleccionar un escuadrón"
          });
        }
        const { data: ownedSquad } = await supabase.from("squads").select("id").eq("id", input.squadId).eq("owner_id", user.id).maybeSingle();
        let canAccess = !!ownedSquad;
        if (!canAccess) {
          const { data: joinedMember } = await supabase.from("squad_members").select("id").eq("squad_id", input.squadId).eq("user_id", user.id).maybeSingle();
          if (joinedMember) {
            canAccess = true;
          }
        }
        if (!canAccess) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "El escuadrón no existe o no perteneces a él"
          });
        }
        context.cookies.set("active_squad_id", input.squadId, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365
        });
        return { success: true };
      }
    }),
    getHubData: defineAction({
      accept: "json",
      handler: async (_, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver sus escuadrones"
          });
        }
        const { data: ownedSquads, error: ownedError } = await supabase.from("squads").select(`
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
          `).eq("owner_id", user.id);
        if (ownedError) {
          console.error("Error fetching owned squads:", ownedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar los escuadrones del creador"
          });
        }
        const { data: joinedMembers, error: joinedError } = await supabase.from("squad_members").select("squad_id").eq("user_id", user.id);
        if (joinedError) {
          console.error("Error fetching joined squad IDs:", joinedError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar las escuadras asociadas"
          });
        }
        const joinedSquadIds = (joinedMembers || []).map((m) => m.squad_id).filter((id) => !ownedSquads?.some((s) => s.id === id));
        let joinedSquads = [];
        if (joinedSquadIds.length > 0) {
          const { data, error: fetchJoinedError } = await supabase.from("squads").select(`
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
            `).in("id", joinedSquadIds);
          if (fetchJoinedError) {
            console.error("Error fetching joined squads:", fetchJoinedError);
            throw new ActionError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Error al consultar los escuadrones asociados"
            });
          }
          joinedSquads = data || [];
        }
        const allSquads = [...ownedSquads || [], ...joinedSquads].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return allSquads;
      }
    }),
    getSquadByCode: defineAction({
      accept: "json",
      input: z.object({
        inviteCode: z.string().min(4)
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para buscar el escuadrón"
          });
        }
        const { data: squad, error } = await supabase.from("squads").select(`
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
          `).eq("invite_code", input.inviteCode.trim().toUpperCase()).maybeSingle();
        if (error) {
          console.error("Error searching squad by code:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al buscar el escuadrón"
          });
        }
        if (!squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Código de invitación no válido o escuadrón no encontrado"
          });
        }
        return squad;
      }
    }),
    claimSlot: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
        favoriteClass: z.string()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para unirte al escuadrón"
          });
        }
        const { data: profile, error: profileError } = await supabase.from("profiles").select("gamertag, level").eq("id", user.id).single();
        if (profileError || !profile) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Por favor configura tu perfil de operador primero"
          });
        }
        const { data: existingMember, error: fetchError } = await supabase.from("squad_members").select("id, user_id").eq("squad_id", input.squadId).eq("slot_number", input.slotNumber).maybeSingle();
        if (fetchError || !existingMember) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "El slot seleccionado no es válido"
          });
        }
        if (existingMember.user_id) {
          throw new ActionError({
            code: "CONFLICT",
            message: "Este slot ya ha sido reclamado por otro jugador"
          });
        }
        const { error: claimError } = await supabase.from("squad_members").update({
          user_id: user.id,
          gamertag: profile.gamertag,
          level: profile.level,
          favorite_class: input.favoriteClass,
          is_active: true
        }).eq("id", existingMember.id);
        if (claimError) {
          console.error("Error claiming slot:", claimError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al reclamar el slot de operador"
          });
        }
        context.cookies.set("active_squad_id", input.squadId, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 365
        });
        return { success: true };
      }
    }),
    releaseSlot: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4)
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para salir del escuadrón"
          });
        }
        const { data: squad, error: squadError } = await supabase.from("squads").select("owner_id").eq("id", input.squadId).maybeSingle();
        if (squadError || !squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Escuadrón no encontrado"
          });
        }
        const { data: member, error: memberError } = await supabase.from("squad_members").select("user_id").eq("squad_id", input.squadId).eq("slot_number", input.slotNumber).maybeSingle();
        if (memberError || !member) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Operador no encontrado"
          });
        }
        const isOwner = squad.owner_id === user.id;
        const isSelf = member.user_id === user.id;
        if (!(isOwner || isSelf)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "No tienes permiso para liberar este slot"
          });
        }
        const { error } = await supabase.from("squad_members").update({
          user_id: null,
          gamertag: `Operador ${input.slotNumber}`,
          level: 1,
          is_active: false
        }).eq("squad_id", input.squadId).eq("slot_number", input.slotNumber);
        if (error) {
          console.error("Error releasing slot:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al desvincular el rol de operador"
          });
        }
        const activeSquadId = context.cookies.get("active_squad_id")?.value;
        if (activeSquadId === input.squadId) {
          context.cookies.delete("active_squad_id", { path: "/" });
        }
        return { success: true };
      }
    }),
    setIsActive: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
        isActive: z.boolean()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para realizar esta acción"
          });
        }
        const { data: squad, error: squadError } = await supabase.from("squads").select("owner_id").eq("id", input.squadId).maybeSingle();
        if (squadError || !squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Escuadrón no encontrado"
          });
        }
        if (squad.owner_id !== user.id) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Solo el líder del escuadrón puede cambiar el estado de los integrantes"
          });
        }
        const { error } = await supabase.from("squad_members").update({ is_active: input.isActive }).eq("squad_id", input.squadId).eq("slot_number", input.slotNumber);
        if (error) {
          console.error("Error setting member active state:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al cambiar el estado del integrante"
          });
        }
        return { success: true };
      }
    }),
    updateMemberClass: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid(),
        slotNumber: z.number().min(1).max(4),
        favoriteClass: z.string()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para continuar"
          });
        }
        const { data: squad, error: squadError } = await supabase.from("squads").select("owner_id").eq("id", input.squadId).maybeSingle();
        if (squadError || !squad) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Escuadrón no encontrado"
          });
        }
        const { data: member, error: memberError } = await supabase.from("squad_members").select("user_id").eq("squad_id", input.squadId).eq("slot_number", input.slotNumber).maybeSingle();
        if (memberError || !member) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Operador no encontrado"
          });
        }
        const isOwner = squad.owner_id === user.id;
        const isSelf = member.user_id === user.id;
        if (!(isOwner || isSelf)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "No tienes permiso para editar este operador"
          });
        }
        const { error } = await supabase.from("squad_members").update({ favorite_class: input.favoriteClass }).eq("squad_id", input.squadId).eq("slot_number", input.slotNumber);
        if (error) {
          console.error("Error updating member class:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al actualizar la clase favorita"
          });
        }
        return { success: true };
      }
    }),
    delete: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para eliminar el escuadrón"
          });
        }
        const { error } = await supabase.from("squads").delete().eq("id", input.squadId).eq("owner_id", user.id);
        if (error) {
          console.error("Error deleting squad:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al eliminar el escuadrón: ${error.message}`
          });
        }
        const activeSquadId = context.cookies.get("active_squad_id")?.value;
        if (activeSquadId === input.squadId) {
          context.cookies.delete("active_squad_id", { path: "/" });
        }
        return { success: true };
      }
    })
  },
  session: {
    create: defineAction({
      accept: "json",
      input: z.object({
        name: z.string().min(1),
        squadId: z.string().uuid()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para crear una sesión"
          });
        }
        const { error: deactivateError } = await supabase.from("game_sessions").update({ status: "completed", closed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("squad_id", input.squadId).eq("status", "active");
        if (deactivateError) {
          console.error("Error deactivating sessions:", deactivateError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al preparar sesiones anteriores"
          });
        }
        const { data: session, error: createError } = await supabase.from("game_sessions").insert({
          squad_id: input.squadId,
          name: input.name,
          status: "active"
        }).select().single();
        if (createError) {
          console.error("Error creating session:", createError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear la sesión: ${createError.message}`
          });
        }
        return session;
      }
    }),
    getActive: defineAction({
      accept: "json",
      input: z.object({
        squadId: z.string().uuid()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para ver sesiones"
          });
        }
        const { data: session, error: getError } = await supabase.from("game_sessions").select("*").eq("squad_id", input.squadId).eq("status", "active").maybeSingle();
        if (getError) {
          console.error("Error getting active session:", getError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al consultar la sesión activa"
          });
        }
        return session;
      }
    }),
    close: defineAction({
      accept: "json",
      input: z.object({
        sessionId: z.string().uuid()
      }),
      handler: async (input, context) => {
        const user = context.locals.user;
        const supabase = context.locals.supabase;
        if (!(user && supabase)) {
          throw new ActionError({
            code: "UNAUTHORIZED",
            message: "Inicie sesión para cerrar la sesión"
          });
        }
        const { data: session, error: closeError } = await supabase.from("game_sessions").update({
          status: "completed",
          closed_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", input.sessionId).select().single();
        if (closeError) {
          console.error("Error closing session:", closeError);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al cerrar la sesión"
          });
        }
        return session;
      }
    })
  }
};

export { server };
