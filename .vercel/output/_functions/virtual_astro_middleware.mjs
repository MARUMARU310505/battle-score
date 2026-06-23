!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"c706bb0390b29398174e070fd0f3db182ed29862"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e3ab2295-8a6d-4bb1-bf67-77fc6ba05e9e",e._sentryDebugIdIdentifier="sentry-dbid-e3ab2295-8a6d-4bb1-bf67-77fc6ba05e9e");}catch(e){}}();import { e as defineMiddleware, af as sequence } from './chunks/params-and-props_CkoCKIXb.mjs';
import 'piccolore';
import 'clsx';
import { c as createSupabaseServerClient } from './chunks/supabase_Bjqv9m7t.mjs';
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
