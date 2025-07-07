"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: clientData } = await supabase
    .from("clients")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!clientData) {
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profileData) {
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email: user.email,
        role: "user",
        name: clientData.name,
        username: clientData.email,
        license_id: clientData.license_id,
      },
    ]);

    if (insertError) {
      console.error("Erro ao criar perfil:", insertError);
      return null;
    }
  }

  const dataToSend = {
    user_id: user.id,
    client_id: clientData.id as number,
    license_id: clientData.license_id as number,
    email: clientData.email as string,
    name: clientData.name,
  };

  return dataToSend;
}
