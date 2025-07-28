// app/(authed)/home/actions/users.ts
"use server";

import { registerQuickBloxUser } from "@/services/qb-user";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function createUsers(formData: FormData) {
  const supabase = await createClient();

  const { data: authUser, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser?.user) {
    console.error("Usuário não autenticado.");
    return;
  }

  const currentUserId = authUser.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("license_id")
    .eq("id", currentUserId)
    .single();

  if (profileError || !profile?.license_id) {
    console.error("Erro ao buscar license_id:", profileError);
    return;
  }

  // 3. Pegar dados do form
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const role = formData.get("user_type") as string;
  const departmentId = parseInt(formData.get("department") as string);

  //criando um email fake, devo pegar esse email no form também?
  //Dados faltam algum?
  const email = `${name.toLowerCase().replace(/\s+/g, "")}@sigmava.pt`;

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, 
  });

  if (createError || !newUser?.user) {
    console.error("Erro ao criar utilizador:", createError);
    return;
  }

  // 5. Criar registro no profile
  const { error: profileInsertError } = await supabaseAdmin.from("profiles").insert({
    id: newUser.user.id,
    name,
    username: name,
    email,
    role,
    department_id: departmentId,
    license_id: profile.license_id,
    available: true,
    disabled: false,
    super_user: false,
    created_at: new Date(),
    updated_at: new Date(),
  });
  
  if (profileInsertError) {
    console.error("Erro ao criar perfil:", profileInsertError);
    return;
  }
  try {
    await registerQuickBloxUser({
      email: newUser.user.id,
      password,
      fullName: name,
    });
    console.log("Usuário QuickBlox criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar no QuickBlox:", err);

  }
  console.log("Usuário criado com sucesso!");
}
