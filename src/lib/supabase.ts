import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://example.supabase.co",
  supabaseAnonKey || "missing-anon-key"
);

export type AppUser = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
};

export const getCurrentProfile = async (): Promise<AppUser | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session?.user) return null;

  const authUser = sessionData.session.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name")
    .eq("id", authUser.id)
    .maybeSingle();

  return {
    id: authUser.id,
    email: profile?.email ?? authUser.email ?? "",
    first_name: profile?.first_name,
    last_name: profile?.last_name,
  };
};

export const isAdminEmail = (email?: string | null) => email === "admin@admin.com";
