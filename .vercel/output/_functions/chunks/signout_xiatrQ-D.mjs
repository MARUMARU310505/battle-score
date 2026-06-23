!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"bf5d2c91e2095a3a12afa72c4ef99b9ad62c6e5b"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cff2db53-2b61-4b95-a244-3117f6113f37",e._sentryDebugIdIdentifier="sentry-dbid-cff2db53-2b61-4b95-a244-3117f6113f37");}catch(e){}}();import { c as createSupabaseServerClient } from './supabase_BqiIsE7q.mjs';

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
