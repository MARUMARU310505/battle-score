!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"9aa1f11240b5d340e4026a0e80081cd252d2d44d"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3031ed98-2024-4b99-87c0-e1b745e2c2bd",e._sentryDebugIdIdentifier="sentry-dbid-3031ed98-2024-4b99-87c0-e1b745e2c2bd");}catch(e){}}();import './page-ssr_CUJ-rDYR.mjs';
import { c as createComponent } from './astro-component_Cjjv5WYH.mjs';
import 'piccolore';
import './params-and-props_DeEqr1n3.mjs';
import 'clsx';
import { c as createSupabaseServerClient } from './supabase_MTUNIMHc.mjs';

const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Callback;
  const code = Astro2.url.searchParams.get("code");
  const next = Astro2.url.searchParams.get("next") || "/dashboard";
  if (code) {
    const supabase = createSupabaseServerClient(Astro2.cookies);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Error exchanging code for session:", error);
    } else {
      return Astro2.redirect(next);
    }
  }
  return Astro2.redirect("/");
}, "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/auth/callback.astro", void 0);

const $$file = "/Users/mpacheco/Documents/projects/PROJECT-battle-score/battle-score/src/pages/auth/callback.astro";
const $$url = "/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
