import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "@/lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize Supabase server client
  const supabase = createSupabaseServerClient(context.cookies);

  // Ingest session user
  let user: import("@supabase/supabase-js").User | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Error retrieving user in middleware:", error);
  }

  // Inject into locals
  context.locals.supabase = supabase;
  context.locals.user = user;

  const url = new URL(context.request.url);

  // Route protection rules
  if (url.pathname.startsWith("/dashboard") && !user) {
    return context.redirect("/");
  }

  if (url.pathname === "/" && user) {
    return context.redirect("/dashboard");
  }

  return next();
});
