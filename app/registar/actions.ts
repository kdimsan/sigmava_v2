"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function registerUser(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const licenseId = formData.get("license") as string;

  if (!email || !password || !name || !licenseId) {
    throw new Error("Todos os campos são obrigatórios");
  }

  const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, 
  });

  if (authError) {
    console.error("Erro ao criar conta:", authError);
    throw new Error("Erro ao criar conta.");
  }

  const { error: dbError } = await (await supabase)
    .from("clients")
    .insert([{ name, email, license_id: licenseId }]);

  if (dbError) {
    console.error("Erro ao criar cliente:", dbError);
    throw new Error("Erro ao salvar dados no banco.");
  }
}
