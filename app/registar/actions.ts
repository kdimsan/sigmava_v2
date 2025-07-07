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

  // 1. Criar conta no Supabase Auth
  const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // já envia com email confirmado (ajuste conforme sua política)
  });

  if (authError) {
    console.error("Erro ao criar conta:", authError);
    throw new Error("Erro ao criar conta.");
  }

  // 2. Inserir na tabela clients
  const { error: dbError } = await (await supabase)
    .from("clients")
    .insert([{ name, email, license_id: licenseId }]);

  if (dbError) {
    console.error("Erro ao criar cliente:", dbError);
    throw new Error("Erro ao salvar dados no banco.");
  }

  // Redirecionar após sucesso
  redirect("/login"); // Ou onde você quiser
}
