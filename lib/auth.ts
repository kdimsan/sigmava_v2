import { createClient } from "@/utils/supabase/client";

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  name?: string;
  role: "superuser" | "admin" | "user";
  created_at: string;
  updated_at: string;
  license_id: number;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = createClient();

  // Buscar no profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profile) {
    // Achou perfil, retorna
    return profile;
  }


  // Se não achou perfil, busca na clients (id)
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", userId)
    .single();

  if (client) {
    return client;
  }

  if (clientError && clientError.code !== "PGRST116") {
    console.error("Erro ao buscar cliente:", clientError);
  }

  return null;
}

export async function getClientProfile(
  email: string
): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }

  return data;
}

export async function checkIfSuperUser(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);

  return profile?.role === "superuser";
}

export async function getCurrentUserWithProfile() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profile: null, isSuperUser: false };
  }

  const profile = await getUserProfile(user.id);
  const isSuperUser = profile?.role === "superuser";

  return { user, profile, isSuperUser };
}
