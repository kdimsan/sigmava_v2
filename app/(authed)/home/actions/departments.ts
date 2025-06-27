"use server";

import { createClient } from "@/utils/supabase/server";

export async function createDepartment(formData: FormData) {
  const supabase = await createClient();

  // 1. Obter o usuário logado
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("Usuário não autenticado");
    return;
  }

  const userId = userData.user.id;

  // 2. Buscar o license_id no profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("license_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile?.license_id) {
    console.error("Erro ao buscar license_id do usuário:", profileError);
    return;
  }

  // 3. Pegar o nome do departamento
  const departmentName = formData.get("department_name") as string;

  // 4. Inserir o novo departamento com license_id
  const { error: insertError } = await supabase
    .from("departments")
    .insert({
      name: departmentName,
      license_id: profile.license_id,
    });

  if (insertError) {
    console.error("Erro ao criar departamento:", insertError);
    return;
  }

  console.log("Departamento criado com sucesso!");
}

export async function getDepartments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("id, name");

  if (error) {
    console.error("Erro ao buscar departamentos:", error);
    return [];
  }

  return data;
}