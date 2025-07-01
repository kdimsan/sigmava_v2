"use server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function createLicense(formData: FormData) {
  const supabase = await createClient();

  const licensePayload = {
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    postal_code: formData.get("zip"),
    contributing_number: formData.get("contributing_number"),
    abey: formData.get("abey"),
    license_key: "LIC-MC7QR09F-5OOSXMS",
    available_users: formData.get("available_users"),
    disabled: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  // 1. Criação da license
  const { data: licenseData, error: errorLicense } = await supabase
    .from("licenses")
    .insert(licensePayload)
    .select()
    .single();

  if (errorLicense || !licenseData) {
    console.error("Erro ao criar license:", errorLicense);
    return;
  }

  // 2. Criação do admin
  const adminEmail = formData.get("admin_email") as string;
  const adminPassword = formData.get("admin_password") as string;

  const { data: authData, error: errorAuth } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true
  });

  if (errorAuth || !authData.user) {
    console.error("Erro ao criar usuário:", errorAuth);
    return;
  }

  // 3. Criação do profile
  const { error: errorProfile } = await supabase.from("profiles").insert({
    id: authData.user.id,
    name: formData.get("admin_name"),
    username: formData.get("admin_name"),
    email: adminEmail,
    phone: formData.get("admin_phone"),
    role: "admin",
    license_id: licenseData.id,
    super_user: true,
    disabled: false,
    available: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (errorProfile) {
    console.error("Erro ao criar profile:", errorProfile);
    return;
  }

  // 4. Upload da logo (se enviada)
  const logoFile = formData.get("logo") as File | null;

  if (logoFile) {
    const fileName = `logos/${licenseData.id}-${Date.now()}-${logoFile.name}`;
    const { data: fileData, error: uploadError } = await supabaseAdmin.storage
      .from("logo.files") // Nome do seu bucket
      .upload(fileName, logoFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload da logo:", uploadError);
      return;
    }

    const logoUrl = supabaseAdmin.storage.from("logo.files").getPublicUrl(fileName).data.publicUrl;

    console.log("license data", licenseData.id);
    

    // 5. Registro da logo na tabela
    const { error: logoInsertError } = await supabase.from("logo_files").insert({
      license_id: licenseData.id,
      name: logoUrl,
      path: logoUrl,
      created_at: new Date(),
    });

    if (logoInsertError) {
      console.error("Erro ao salvar logo na base:", logoInsertError);
      return;
    }
  }

  console.log("License, usuário, profile e logo criados com sucesso.");
}


export async function getLicenses() {
  const supabase = createClient();

  const { data, error } = await (await supabase).from("licenses").select("*");

  console.log("DATA", data);

  if (error) {
    console.error("Erro ao buscar licenças:", error);
    return [];
  }

  return data;
}
