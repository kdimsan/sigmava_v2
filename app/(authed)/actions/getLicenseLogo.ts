"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";

export async function getLogoUrlByLicense(license_id: number) {
    console.log("tetetete",license_id);
    
  const { data, error } = await supabaseAdmin
    .from("logo_files")
    .select("path")
    .eq("license_id", license_id)
    .order("created_at", { ascending: false }) // pega a logo mais recente, se houver mais de uma
    .limit(1)
    .single();

  if (error) {
    console.error("Erro ao buscar logo:", error);
    return null;
  }

  return data.path;
}
