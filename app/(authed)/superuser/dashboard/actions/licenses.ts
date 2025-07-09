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
    license_key: "LIC-MC7QR09F-5OOSXMSSS",
    available_users: formData.get("available_users"),
    disabled: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const { data: licenseData, error: errorLicense } = await supabase
    .from("licenses")
    .insert(licensePayload)
    .select()
    .single();

  if (errorLicense || !licenseData) {
    if (errorLicense || !licenseData) {
      console.error("Erro ao criar license:", errorLicense);
      throw new Error("Erro ao criar license: " + errorLicense?.message);
    }
  }

  const adminEmail = formData.get("admin_email") as string;
  const adminPassword = formData.get("admin_password") as string;

  const { data: authData, error: errorAuth } =
    await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

  if (errorAuth || !authData.user) {
    console.error("Erro ao criar usuário:", errorAuth);
    throw new Error("Erro ao criar usuário: " + errorAuth?.message);
  }

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
    throw new Error("Erro ao criar profile: " + errorProfile.message);
  }

  const logoFile = formData.get("logo") as File | null;

  if (logoFile) {
    const fileName = `logos/${licenseData.id}-${Date.now()}-${logoFile.name}`;
    const { data: fileData, error: uploadError } = await supabaseAdmin.storage
      .from("logo.files")
      .upload(fileName, logoFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload da logo:", uploadError);
      throw new Error("Erro ao fazer upload da logo: " + uploadError.message);
    }

    const logoUrl = supabaseAdmin.storage
      .from("logo.files")
      .getPublicUrl(fileName).data.publicUrl;

    const { error: logoInsertError } = await supabase
      .from("logo_files")
      .insert({
        license_id: licenseData.id,
        name: logoUrl,
        path: logoUrl,
        created_at: new Date(),
      });

    if (logoInsertError) {
      console.error("Erro ao salvar logo na base:", logoInsertError);
      throw new Error(
        "Erro ao salvar logo na base: " + logoInsertError.message
      );
    }
  }
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

export async function updateLicense(id: string, data: Record<string, any>) {
  const supabase = await createClient();

  const { error } = await supabase.from("licenses").update(data).eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteLicense(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("licenses").delete().eq("id", id);

  if (error) {
    throw error;
  }
}