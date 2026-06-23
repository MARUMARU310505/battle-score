/// <reference path="../.astro/types.d.ts" />

// biome-ignore lint/style/noNamespace: Astro namespace requirement
declare namespace App {
  interface Locals {
    supabase: import("@supabase/supabase-js").SupabaseClient;
    user: import("@supabase/supabase-js").User | null;
  }
}
