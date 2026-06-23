!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"bef452b3ccc56d267223ad34e70c101dfed3c9a7"};var n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="577e6fdf-8c0e-4329-a6eb-35ca6287526a",e._sentryDebugIdIdentifier="sentry-dbid-577e6fdf-8c0e-4329-a6eb-35ca6287526a");}catch(e){}}();import { createServerClient, createBrowserClient } from '@supabase/ssr';

const REST_API_PATH_REGEX = /\/rest\/v1\/?$/;
function createSupabaseBrowserClient() {
  const url = "https://jrmmgpxotgeasvpubnpu.supabase.co/rest/v1/";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybW1ncHhvdGdlYXN2cHVibnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzUwOTEsImV4cCI6MjA5NzgxMTA5MX0.hLI4HQmAeQ0a5OkrdjHgnbOUnuY1pHrHX3NxnYLywuI";
  const sanitizedUrl = url.replace(REST_API_PATH_REGEX, "");
  return createBrowserClient(sanitizedUrl, anonKey);
}
function createSupabaseServerClient(cookies) {
  const url = "https://jrmmgpxotgeasvpubnpu.supabase.co/rest/v1/";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybW1ncHhvdGdlYXN2cHVibnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzUwOTEsImV4cCI6MjA5NzgxMTA5MX0.hLI4HQmAeQ0a5OkrdjHgnbOUnuY1pHrHX3NxnYLywuI";
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
      }
    }
  });
}

export { createSupabaseBrowserClient as a, createSupabaseServerClient as c };
