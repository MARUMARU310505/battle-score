import type { APIRoute } from "astro";
import { createSupabaseServerClient } from "@/lib/supabase";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServerClient(cookies);

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out user:", error);
  }

  return redirect("/");
};
