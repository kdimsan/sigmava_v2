// app/(authed)/home/actions/availability.ts
"use server";

import { AvailabilitySlot } from "@/components/ScheduleCallPage";
import { createClient } from "@/utils/supabase/server";

export async function createAvaiability(formData: FormData) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    console.error("Usuário não autenticado");
    return;
  }

  const userId = authData.user.id;

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
    .select("name, id")
    .eq("id", profile.department_id)
    .single();

  const { data: license } = await supabase
    .from("licenses")
    .select("name, id")
    .eq("id", profile.license_id)
    .single();

  const selectedDates = formData.getAll("calendarDates[]") as string[];
  const timeSlots: { from: string; to: string }[] = [];
  const duration = parseInt(formData.get("duration") as string, 10);

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
      license_id: license?.id,
      department_id: department?.id,
      start_time: slot.from,
      end_time: slot.to,
      date,
      duration,
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

async function fetchSlots({
  licenseId,
  departmentId,
}: {
  licenseId?: number;
  departmentId?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("slots")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (licenseId) query = query.eq("license_id", licenseId);
  if (departmentId) query = query.eq("department_id", departmentId);

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar slots:", error);
    return [];
  }

  return data;
}

export async function getAvaiability() {
  return fetchSlots({});
}

export async function getAvaiabilityByLicenseAndDepartment(
  licenseId: number,
  departmentId?: string
) {
  return fetchSlots({ licenseId, departmentId });
}
