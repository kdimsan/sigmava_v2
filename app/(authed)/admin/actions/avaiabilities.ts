// app/(authed)/home/actions/availability.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function createAvaiability(formData: FormData) {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      console.error("Usuário não autenticado");
      return;
    }
  
    const userId = authData.user.id;
  
    // Buscar dados complementares (nome do usuário, departamento e licença)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, license_id, department_id")
      .eq("id", userId)
      .single();
  
    if (profileError || !profile) {
      console.error("Erro ao buscar perfil:", profileError);
      return;
    }
  
    const { data: department } = await supabase
      .from("departments")
      .select("name")
      .eq("id", profile.department_id)
      .single();
  
    const { data: license } = await supabase
      .from("licenses")
      .select("name")
      .eq("id", profile.license_id)
      .single();
  
    // Recuperar dados do form
    const selectedDates = formData.getAll("calendarDates[]") as string[];
    const timeSlots: { from: string; to: string }[] = [];

for (const [key, value] of formData.entries()) {
  const match = key.match(/^timeSlots\[(\d+)]\[(from|to)]$/);
  if (match) {
    const index = parseInt(match[1], 10);
    const field = match[2] as "from" | "to";

    if (!timeSlots[index]) timeSlots[index] = { from: "", to: "" };
    timeSlots[index][field] = value as string;
  }
}
  
    const insertPayload = selectedDates.flatMap((date: string) =>
      timeSlots.map((slot: { from: string; to: string }) => ({
        user_id: userId,
        start_time: slot.from,
        end_time: slot.to,
        date,
        available: true,
      }))
    );
  
    const { error: insertError } = await supabase
      .from("slots")
      .insert(insertPayload);
  
    if (insertError) {
      console.error("Erro ao salvar disponibilidade:", insertError);
    } else {
      console.log("Disponibilidade salva com sucesso!");
    }
}
