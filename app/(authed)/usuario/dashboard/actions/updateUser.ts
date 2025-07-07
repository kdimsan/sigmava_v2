"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  const user_id = formData.get("user_id") as string;
  const license_id = formData.get("license") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  console.log("license_id", email);
  

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      license_id: Number(license_id),
      updated_at: new Date(),
      name: name,
    })
    .eq("id", user_id);

    const { error: clientError } = await supabase
    .from("clients")
    .update({
      updated_at: new Date(),
      name: name,
    })
    .eq("email", email);

  if (error) {
    console.error("Erro ao atualizar o perfil:", error);
  } else {
    console.log("Perfil atualizado com sucesso.");
    redirect("/usuario/dashboard/definicoes?success=1");
  }
}
