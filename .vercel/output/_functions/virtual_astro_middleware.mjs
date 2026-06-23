!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"d9eddfe5ff0a9193a99cfff4c059b06ab7d53ab4"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="74d06bcd-24d6-4094-8046-0f5d909da7f5",e._sentryDebugIdIdentifier="sentry-dbid-74d06bcd-24d6-4094-8046-0f5d909da7f5");}catch(e){}}();import { e as defineMiddleware, af as sequence } from './chunks/params-and-props_C_SQUMVQ.mjs';
import 'piccolore';
import 'clsx';
import { c as createSupabaseServerClient } from './chunks/supabase_DcPCbuCC.mjs';
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
