!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"1b68c6057d3153ed064b0a70ad1b1e29a1b6dd06"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="094ac2bb-5bd5-4f82-9a86-7566125187d2",e._sentryDebugIdIdentifier="sentry-dbid-094ac2bb-5bd5-4f82-9a86-7566125187d2");}catch(e){}}();import { parsePhoneNumberFromString } from 'libphonenumber-js';

const name = "Eleven Estudio";
const description = "Somos una firma de arquitectos fundada en el año 2002, apasionados por crear arquitectura que explore posibilidades, emocione e inspire a la comunidad.";
const site = "https://www.elevenestudio.com";
const openGraph = "/og.png";
const lang = "es";
const contact = {"tel":{"ext":502,"number":45431635},"whatsapp":{"ext":502,"number":45431635},"email":"info@elevenestudio.com"};
const address = {"location":"Guatemala, Guatemala"};
const googleTagManager = {"id":"GTM-XXXXXXX"};
const social = {"facebook":"https://www.facebook.com/elevenestudio/","instagram":"https://www.instagram.com/elevenstudio.gt/"};
const settings = {"emailSender":"noreply@correo.com","bccEmail":["monitoreo@correo.com"],"resendToCompany":false};
const BUSINESS = {
  name,
  description,
  site,
  openGraph,
  lang,
  contact,
  address,
  googleTagManager,
  social,
  settings,
};

const DATA_BUSINESS = BUSINESS;
const phoneNumber = `+${DATA_BUSINESS.contact.tel.ext}${DATA_BUSINESS.contact.tel.number}`;
const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, {
  defaultCountry: "GT",
  defaultCallingCode: "502",
  extract: true
});
const BUSINESS_CONFIG = {
  ...DATA_BUSINESS,
  phone: {
    formatted: parsedPhoneNumber?.formatInternational(),
    ext: DATA_BUSINESS.contact.tel.ext,
    number: DATA_BUSINESS.contact.tel.number,
    country: parsedPhoneNumber?.country,
    link: `tel:${parsedPhoneNumber?.number}`
  },
  whatsapp: {
    formatted: parsedPhoneNumber?.formatInternational(),
    ext: DATA_BUSINESS.contact.whatsapp?.ext,
    number: DATA_BUSINESS.contact.whatsapp?.number,
    country: parsedPhoneNumber?.country,
    link: (message) => `https://wa.me/${DATA_BUSINESS.contact.whatsapp?.ext}${DATA_BUSINESS.contact.whatsapp?.number}?text=${message}`
  },
  email: {
    address: DATA_BUSINESS.contact.email,
    link: `mailto:${DATA_BUSINESS.contact.email}`
  },
  social: {
    facebook: DATA_BUSINESS.social?.facebook ?? null,
    instagram: DATA_BUSINESS.social?.instagram ?? null,
    tiktok: DATA_BUSINESS.social?.tiktok ?? null,
    youtube: DATA_BUSINESS.social?.youtube ?? null,
    linkedin: DATA_BUSINESS.social?.linkedin ?? null,
    twitter: DATA_BUSINESS.social?.twitter ?? null
  }
};

export { BUSINESS_CONFIG as B };
