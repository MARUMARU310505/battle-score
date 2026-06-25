!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"c8a40707f66851908d1d47b9e7c7c38512cae772"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="73266fdd-0794-480b-a682-db08ce8583e3",e._sentryDebugIdIdentifier="sentry-dbid-73266fdd-0794-480b-a682-db08ce8583e3");}catch(e){}}();import { c as createComponent } from './astro-component_Dn0_w7C8.mjs';
import 'piccolore';
import { U as createRenderInstruction, Q as renderTemplate, a4 as addAttribute, b1 as unescapeHTML, B as renderSlot, b2 as renderHead, F as Fragment } from './params-and-props_BQKzcMjR.mjs';
import { s as spreadAttributes, r as renderComponent } from './entrypoint_BIgG_yUe.mjs';
import { $ as $$Font } from './_astro_assets_zxmlCz1N.mjs';
import 'clsx';
import { B as BUSINESS_CONFIG } from './business_DIIttM6S.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Favicons = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Favicons --><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest"><!-- Favicon for IE --><link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"><!-- Favicons for different sizes --><link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png"><link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png"><!-- Apple Touch Icon (for backwards compatibility) --><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/components/fundations/favicons.astro", void 0);

const $$Meta = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Meta Tags --><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Theme Color for Mobile Browsers --><meta name="theme-color" content="#000000"><!-- For IE --><meta http-equiv="X-UA-Compatible" content="IE=edge">`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/components/fundations/meta.astro", void 0);

const $$OpenGraphArticleTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$OpenGraphArticleTags;
  const { publishedTime, modifiedTime, expirationTime, authors, section, tags } = Astro2.props.openGraph.article;
  return renderTemplate`${publishedTime ? renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>` : null}${modifiedTime ? renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>` : null}${expirationTime ? renderTemplate`<meta property="article:expiration_time"${addAttribute(expirationTime, "content")}>` : null}${authors ? authors.map((author) => renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`) : null}${section ? renderTemplate`<meta property="article:section"${addAttribute(section, "content")}>` : null}${tags ? tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`) : null}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/OpenGraphArticleTags.astro", void 0);

const $$OpenGraphBasicTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$OpenGraphBasicTags;
  const { openGraph } = Astro2.props;
  return renderTemplate`<meta property="og:title"${addAttribute(openGraph.basic.title, "content")}><meta property="og:type"${addAttribute(openGraph.basic.type, "content")}><meta property="og:image"${addAttribute(openGraph.basic.image, "content")}><meta property="og:url"${addAttribute(openGraph.basic.url || Astro2.url.href, "content")}>`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/OpenGraphBasicTags.astro", void 0);

const $$OpenGraphImageTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$OpenGraphImageTags;
  const { image } = Astro2.props.openGraph.basic;
  const { secureUrl, type, width, height, alt } = Astro2.props.openGraph.image;
  return renderTemplate`<meta property="og:image:url"${addAttribute(image, "content")}>${secureUrl ? renderTemplate`<meta property="og:image:secure_url"${addAttribute(secureUrl, "content")}>` : null}${type ? renderTemplate`<meta property="og:image:type"${addAttribute(type, "content")}>` : null}${width ? renderTemplate`<meta property="og:image:width"${addAttribute(width, "content")}>` : null}${height ? renderTemplate`<meta property="og:image:height"${addAttribute(height, "content")}>` : null}${alt ? renderTemplate`<meta property="og:image:alt"${addAttribute(alt, "content")}>` : null}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/OpenGraphImageTags.astro", void 0);

const $$OpenGraphOptionalTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$OpenGraphOptionalTags;
  const { optional } = Astro2.props.openGraph;
  return renderTemplate`${optional.audio ? renderTemplate`<meta property="og:audio"${addAttribute(optional.audio, "content")}>` : null}${optional.description ? renderTemplate`<meta property="og:description"${addAttribute(optional.description, "content")}>` : null}${optional.determiner ? renderTemplate`<meta property="og:determiner"${addAttribute(optional.determiner, "content")}>` : null}${optional.locale ? renderTemplate`<meta property="og:locale"${addAttribute(optional.locale, "content")}>` : null}${optional.localeAlternate?.map((locale) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(locale, "content")}>`)}${optional.siteName ? renderTemplate`<meta property="og:site_name"${addAttribute(optional.siteName, "content")}>` : null}${optional.video ? renderTemplate`<meta property="og:video"${addAttribute(optional.video, "content")}>` : null}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro", void 0);

const $$ExtendedTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ExtendedTags;
  const { props } = Astro2;
  return renderTemplate`${props.extend.link?.map((attributes) => renderTemplate`<link${spreadAttributes(attributes)}>`)}${props.extend.meta?.map(({ content, httpEquiv, media, name, property }) => renderTemplate`<meta${addAttribute(name, "name")}${addAttribute(property, "property")}${addAttribute(content, "content")}${addAttribute(httpEquiv, "http-equiv")}${addAttribute(media, "media")}>`)}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/ExtendedTags.astro", void 0);

const $$TwitterTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$TwitterTags;
  const { card, site, title, creator, description, image, imageAlt } = Astro2.props.twitter;
  return renderTemplate`${card ? renderTemplate`<meta name="twitter:card"${addAttribute(card, "content")}>` : null}${site ? renderTemplate`<meta name="twitter:site"${addAttribute(site, "content")}>` : null}${title ? renderTemplate`<meta name="twitter:title"${addAttribute(title, "content")}>` : null}${image ? renderTemplate`<meta name="twitter:image"${addAttribute(image, "content")}>` : null}${imageAlt ? renderTemplate`<meta name="twitter:image:alt"${addAttribute(imageAlt, "content")}>` : null}${description ? renderTemplate`<meta name="twitter:description"${addAttribute(description, "content")}>` : null}${creator ? renderTemplate`<meta name="twitter:creator"${addAttribute(creator, "content")}>` : null}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/TwitterTags.astro", void 0);

const $$LanguageAlternatesTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$LanguageAlternatesTags;
  const { languageAlternates } = Astro2.props;
  return renderTemplate`${languageAlternates.map((alternate) => renderTemplate`<link rel="alternate"${addAttribute(alternate.hrefLang, "hreflang")}${addAttribute(alternate.href, "href")}>`)}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/components/LanguageAlternatesTags.astro", void 0);

const $$SEO = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SEO;
  Astro2.props.surpressWarnings = true;
  function validateProps(props) {
    if (props.openGraph) {
      if (!props.openGraph.basic || (props.openGraph.basic.title ?? void 0) == void 0 || (props.openGraph.basic.type ?? void 0) == void 0 || (props.openGraph.basic.image ?? void 0) == void 0) {
        throw new Error(
          "If you pass the openGraph prop, you have to at least define the title, type, and image basic properties!"
        );
      }
    }
    if (props.title && props.openGraph?.basic.title) {
      if (props.title == props.openGraph.basic.title && !props.surpressWarnings) {
        console.warn(
          "WARNING(astro-seo): You passed the same value to `title` and `openGraph.optional.title`. This is most likely not what you want. See docs for more."
        );
      }
    }
    if (props.openGraph?.basic?.image && !props.openGraph?.image?.alt && !props.surpressWarnings) {
      console.warn(
        "WARNING(astro-seo): You defined `openGraph.basic.image`, but didn't define `openGraph.image.alt`. This is strongly discouraged.'"
      );
    }
  }
  validateProps(Astro2.props);
  let updatedTitle = "";
  if (Astro2.props.title) {
    updatedTitle = Astro2.props.title;
    if (Astro2.props.titleTemplate) {
      updatedTitle = Astro2.props.titleTemplate.replace(/%s/g, updatedTitle);
    }
  } else if (Astro2.props.titleDefault) {
    updatedTitle = Astro2.props.titleDefault;
  }
  const baseUrl = Astro2.site ?? Astro2.url;
  const defaultCanonicalUrl = new URL(Astro2.url.pathname + Astro2.url.search, baseUrl);
  const shouldRemoveTrailingSlash = Astro2.props.removeTrailingSlashForRoot && Astro2.url.pathname === "/";
  const canonicalHref = shouldRemoveTrailingSlash ? defaultCanonicalUrl.origin + defaultCanonicalUrl.search : defaultCanonicalUrl.href;
  return renderTemplate`${updatedTitle ? renderTemplate`<title>${unescapeHTML(updatedTitle)}</title>` : null}${Astro2.props.charset ? renderTemplate`<meta${addAttribute(Astro2.props.charset, "charset")}>` : null}<link rel="canonical"${addAttribute(Astro2.props.canonical || canonicalHref, "href")}>${Astro2.props.description ? renderTemplate`<meta name="description"${addAttribute(Astro2.props.description, "content")}>` : null}<meta name="robots"${addAttribute(`${Astro2.props.noindex ? "noindex" : "index"}, ${Astro2.props.nofollow ? "nofollow" : "follow"}${Astro2.props.noarchive ? ", noarchive" : ""}${Astro2.props.nocache ? ", nocache" : ""}${Astro2.props.robotsExtras ? `, ${Astro2.props.robotsExtras}` : ""}`, "content")}>${Astro2.props.openGraph && renderTemplate`${renderComponent($$result, "OpenGraphBasicTags", $$OpenGraphBasicTags, { ...Astro2.props })}`}${Astro2.props.openGraph?.optional && renderTemplate`${renderComponent($$result, "OpenGraphOptionalTags", $$OpenGraphOptionalTags, { ...Astro2.props })}`}${Astro2.props.openGraph?.image && renderTemplate`${renderComponent($$result, "OpenGraphImageTags", $$OpenGraphImageTags, { ...Astro2.props })}`}${Astro2.props.openGraph?.article && renderTemplate`${renderComponent($$result, "OpenGraphArticleTags", $$OpenGraphArticleTags, { ...Astro2.props })}`}${Astro2.props.twitter && renderTemplate`${renderComponent($$result, "TwitterTags", $$TwitterTags, { ...Astro2.props })}`}${Astro2.props.extend && renderTemplate`${renderComponent($$result, "ExtendedTags", $$ExtendedTags, { ...Astro2.props })}`}${Astro2.props.languageAlternates && renderTemplate`${renderComponent($$result, "LanguageAlternatesTags", $$LanguageAlternatesTags, { ...Astro2.props })}`}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/node_modules/.pnpm/astro-seo@1.1.0_prettier@3.5.3_typescript@5.9.2/node_modules/astro-seo/src/SEO.astro", void 0);

const $$Seo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Seo;
  const canonicalDefault = Astro2.url.href;
  const { metadata } = Astro2.props;
  const {
    title = BUSINESS_CONFIG.name,
    description = BUSINESS_CONFIG.description,
    canonical = canonicalDefault,
    openGraph = {},
    ignoreTitleTemplate = false,
    ...rest
  } = metadata ?? {};
  const ogImageUrl = openGraph?.image?.url || BUSINESS_CONFIG.openGraph;
  const absoluteImageUrl = ogImageUrl?.startsWith("http") ? ogImageUrl : ogImageUrl?.startsWith("/") ? `${Astro2.site}${ogImageUrl}` : ogImageUrl ? `${Astro2.site}/${ogImageUrl}` : BUSINESS_CONFIG.openGraph;
  return renderTemplate`${renderComponent($$result, "SEO", $$SEO, { "title": title, "titleTemplate": ignoreTitleTemplate ? void 0 : `%s - ${BUSINESS_CONFIG.name}`, "description": description, "canonical": canonical, "openGraph": {
    basic: {
      title,
      type: "website",
      image: absoluteImageUrl
    },
    optional: {
      description,
      siteName: BUSINESS_CONFIG.name,
      locale: "es_ES"
    }
  }, "twitter": {
    card: "summary_large_image",
    site: BUSINESS_CONFIG.site,
    creator: BUSINESS_CONFIG.social?.twitter ?? "@yourhandle"
  }, ...rest })}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/components/fundations/seo.astro", void 0);

const $$TailwindIndicator = createComponent(($$result, $$props, $$slots) => {
  const view = "production";
  return renderTemplate`${view === "development"}`;
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/components/tailwind-indicator.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { metadata } = Astro2.props;
  const gtmId = BUSINESS_CONFIG.googleTagManager?.id;
  return renderTemplate(_a || (_a = __template(['<html lang="es" class="scroll-smooth"> <head><script>\n      const getThemePreference = () => {\n        if (\n          typeof localStorage !== "undefined" &&\n          localStorage.getItem("theme")\n        ) {\n          return localStorage.getItem("theme");\n        }\n        return window.matchMedia("(prefers-color-scheme: dark)").matches\n          ? "dark"\n          : "light";\n      };\n      const isDark = getThemePreference() === "dark";\n      document.documentElement.classList[isDark ? "add" : "remove"]("dark");\n    <\/script>', "", "", "", "", "", '</head> <body class="flex min-h-screen flex-col bg-muted/20 text-foreground antialiased transition-colors duration-200"> ', ' <div class="mx-auto flex min-h-screen w-full max-w-[450px] flex-col bg-background shadow-2xl xl:max-w-none xl:shadow-none"> <main class="flex flex-1 flex-col">', "</main> </div> ", " ", " </body> </html>"])), renderComponent($$result, "Meta", $$Meta, {}), renderComponent($$result, "Seo", $$Seo, { "metadata": metadata }), renderComponent($$result, "Favicons", $$Favicons, {}), renderComponent($$result, "Font", $$Font, { "cssVariable": "--font-geist" }), renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(gtmId ? `<script is:inline>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');<\/script>` : "")}` }), renderHead(), gtmId && renderTemplate`<noscript> <iframe${addAttribute(`https://www.googletagmanager.com/ns.html?id=${gtmId}`, "src")} height="0" width="0" style="display:none;visibility:hidden"></iframe> </noscript>`, renderSlot($$result, $$slots["default"]), renderComponent($$result, "TailwindIndicator", $$TailwindIndicator, {}), renderScript($$result, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/layouts/base-layout.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/layouts/base-layout.astro", void 0);

export { $$BaseLayout as $ };
