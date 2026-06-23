!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"dce79c2b46fb8658052efd0b0dac2c852fc4de15"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c8bd9362-fb56-483a-a3b2-e42f60c319f1",e._sentryDebugIdIdentifier="sentry-dbid-c8bd9362-fb56-483a-a3b2-e42f60c319f1");}catch(e){}}();import './page-ssr_CNlRdk4O.mjs';
import { c as createComponent } from './astro-component_C70HfCt2.mjs';
import 'piccolore';
import './params-and-props_DaruqQBn.mjs';
import 'clsx';
import { c as createSupabaseServerClient } from './supabase_D_q8zc7u.mjs';

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
