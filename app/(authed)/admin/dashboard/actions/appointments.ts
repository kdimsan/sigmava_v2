"use server";
import { Appointment } from "@/components/AppointmentList";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAppointments(status?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("video_services")
    .select(
      "id, client_name, subject, datetime, video_service_state, department_id, message"
    )
    .order("datetime", { ascending: true });

  if (status && status !== "all") {
    query = query.eq("video_service_state", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
  const departmentIds = Array.from(
    new Set(data.map((item) => item.department_id))
  );

  const { data: departments, error: deptError } = await supabase
    .from("departments")
    .select("id, name")
    .in("id", departmentIds);

  if (deptError || !departments) {
    console.error("Erro ao buscar departamentos:", deptError);
    return [];
  }

  const departmentMap = new Map(
    departments.map((dept) => [dept.id, dept.name])
  );

  return data.map((item) => ({
    id: item.id.toString(),
    name: item.client_name,
    subject: item.subject,
    department: departmentMap.get(item.department_id),
    message: item.message,
    time: new Date(item.datetime).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date(item.datetime).toISOString().split("T")[0],
    status: item.video_service_state as
      | "scheduled"
      | "in_progress"
      | "cancelled"
      | "completed",
  }));
}

export async function approveAppointment(id: string) {
  const supabase = await createClient();
  await supabase
    .from("video_services")
    .update({ video_service_state: "scheduled" })
    .eq("id", id);
}

export async function cancelAppointment(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("video_services")
    .update({ video_service_state: "cancelled" })
    .eq("id", id);

  console.log("datra", data);
  console.log("error", error);
}

export async function rescheduleAppointment(
  appointmentId: string,
  newDate: Date,
  newTime: string
) {
  const supabase = await createClient();

  const yyyy = newDate.getFullYear();
  const mm = String(newDate.getMonth() + 1).padStart(2, "0");
  const dd = String(newDate.getDate()).padStart(2, "0");
  const [hour, minute] = newTime.split(":");

  const localDateTimeString = `${yyyy}-${mm}-${dd}T${hour}:${minute}:00`;

  const { error } = await supabase
    .from("video_services")
    .update({
      datetime: localDateTimeString,
      video_service_state: "in_progress",
    })
    .eq("id", appointmentId);
  if (error) {
    console.error("Erro ao reagendar chamada:", error);
    return;
  }

  revalidatePath("/home");
}

export async function completeAppointment(id: string) {
  const supabase = await createClient();

  await supabase
    .from("video_services")
    .update({ video_service_state: "completed" })
    .eq("id", id);
}

export async function getAppointmentsByOwnerId() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Erro ao obter usuário autenticado:", userError);
    return [];
  }

  const userId = user.id;

  const { data: profileData ,error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Erro ao buscar perfil:", profileError);
    return [];
  }

  const { data: appointments, error: appointmentsError } = await supabase
    .from("video_services")
    .select("*")
    .eq("owner_id", profileData.id)
    .order("datetime", { ascending: true });

  if (appointmentsError || !appointments) {
    console.error(
      "Erro ao buscar agendamentos por owner_id:",
      appointmentsError
    );
    return [];
  }
  
  return appointments as Appointment[];
}
