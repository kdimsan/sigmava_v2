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
    license_key: "LIC-MC7QR09F-5OOSXL",
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

    const adminEmail = formData.get("admin_email") as string;
    const adminPassword = formData.get("admin_password") as string;
  
    const { data: authData, error: errorAuth } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
    });

    console.log(errorAuth);
    
    console.log("AUTGDATA", authData.user);

    console.log("licenseData", licenseData);
    
    

  const { error: errorProfile } = await supabase.from("profiles").insert({
    id: authData.user!.id,
    name: formData.get("admin_name"),
    username: formData.get("admin_name"),
    email: adminEmail,
    phone: formData.get("admin_phone"),
    role: "admin", // ou o valor do enum correspondente
    license_id: licenseData.id,
    super_user: true,
    disabled: false,
    available: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  if (errorProfile) {
    console.error("Erro ao criar profile:", errorProfile);
    return;
  }

  console.log("errorLicense", errorLicense);

  console.log("form", formData);
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