!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"9ae64c8afd338efbfe8b2be798182d2f20d2e584"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="42764ae5-ebb1-413e-9a84-a20f0ef83ab4",e._sentryDebugIdIdentifier="sentry-dbid-42764ae5-ebb1-413e-9a84-a20f0ef83ab4");}catch(e){}}();import './page-ssr_DmI5wnoy.mjs';
import { c as createComponent } from './astro-component_IjkuTRei.mjs';
import 'piccolore';
import './params-and-props_CfaR-7F2.mjs';
import 'clsx';
import { c as createSupabaseServerClient } from './supabase_C6JIrkW9.mjs';

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
