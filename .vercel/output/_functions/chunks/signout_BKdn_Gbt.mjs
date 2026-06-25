!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"a934bb583750e922686f077084783c5ad5f4e065"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b4f4c398-d95b-497e-874f-a49ba2efdf8c",e._sentryDebugIdIdentifier="sentry-dbid-b4f4c398-d95b-497e-874f-a49ba2efdf8c");}catch(e){}}();import { c as createSupabaseServerClient } from './supabase_D8nI4GHP.mjs';

const GET = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies);
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out user:", error);
  }
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
