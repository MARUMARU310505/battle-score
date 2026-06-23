!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"bfcd9436403f315a94acf36ebfa581e3e93a06fc"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d4b43cc5-8051-444b-9dbd-8e6e5196028c",e._sentryDebugIdIdentifier="sentry-dbid-d4b43cc5-8051-444b-9dbd-8e6e5196028c");}catch(e){}}();import './page-ssr_e8NL110z.mjs';
import { c as createComponent } from './astro-component_BDF6RDGh.mjs';
import 'piccolore';
import './params-and-props_BwyISsjz.mjs';
import 'clsx';
import { c as createSupabaseServerClient } from './supabase_BAowjs8O.mjs';

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
