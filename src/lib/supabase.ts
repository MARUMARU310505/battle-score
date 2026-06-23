import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";

const REST_API_PATH_REGEX = /\/rest\/v1\/?$/;

export function createSupabaseBrowserClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!(url && anonKey)) {
    throw new Error("Missing Supabase URL or Anon Key environment variables");
  }

  // Remove trailing /rest/v1/ if user accidentally kept it in .env
  const sanitizedUrl = url.replace(REST_API_PATH_REGEX, "");

  return createBrowserClient(sanitizedUrl, anonKey);
}

export function createSupabaseServerClient(cookies: AstroCookies) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!(url && anonKey)) {
    throw new Error("Missing Supabase URL or Anon Key environment variables");
  }

  // Remove trailing /rest/v1/ if user accidentally kept it in .env
  const sanitizedUrl = url.replace(REST_API_PATH_REGEX, "");

  return createServerClient(sanitizedUrl, anonKey, {
    cookies: {
      get(key) {
        return cookies.get(key)?.value;
      },
      set(key, value, options) {
        cookies.set(key, value, options);
      },
      remove(key, options) {
        cookies.delete(key, options);
      },
    },
  });
}
