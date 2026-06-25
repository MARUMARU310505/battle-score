!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"f0a8be2e3139dbbd8d8e97047d3c335c85a6c8b7"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="02dededa-af48-4310-891c-46ca488e802a",e._sentryDebugIdIdentifier="sentry-dbid-02dededa-af48-4310-891c-46ca488e802a");}catch(e){}}();import { e as defineMiddleware, af as sequence } from './chunks/params-and-props_BDg4dkDo.mjs';
import 'piccolore';
import 'clsx';
import { c as createSupabaseServerClient } from './chunks/supabase_DmwnDjw_.mjs';
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
