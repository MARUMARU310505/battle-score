!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"9aa1f11240b5d340e4026a0e80081cd252d2d44d"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cff2db53-2b61-4b95-a244-3117f6113f37",e._sentryDebugIdIdentifier="sentry-dbid-cff2db53-2b61-4b95-a244-3117f6113f37");}catch(e){}}();import { c as createSupabaseServerClient } from './supabase_MTUNIMHc.mjs';

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
