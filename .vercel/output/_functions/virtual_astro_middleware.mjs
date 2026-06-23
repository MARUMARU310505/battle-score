!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"d8182e9ad60295de1a50848ed827abd8bd92c3b3"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="02dededa-af48-4310-891c-46ca488e802a",e._sentryDebugIdIdentifier="sentry-dbid-02dededa-af48-4310-891c-46ca488e802a");}catch(e){}}();import { e as defineMiddleware, af as sequence } from './chunks/params-and-props_CwECntQL.mjs';
import 'piccolore';
import 'clsx';
import { c as createSupabaseServerClient } from './chunks/supabase_DOAKCKk8.mjs';
import { onRequest as onRequest$2 } from '@sentry/astro/middleware';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServerClient(context.cookies);
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Error retrieving user in middleware:", error);
  }
  context.locals.supabase = supabase;
  context.locals.user = user;
  const url = new URL(context.request.url);
  if (url.pathname.startsWith("/dashboard") && !user) {
    return context.redirect("/");
  }
  if (url.pathname === "/" && user) {
    return context.redirect("/dashboard");
  }
  return next();
});

const onRequest = sequence(
	onRequest$2,
	onRequest$1
	
);

export { onRequest };
