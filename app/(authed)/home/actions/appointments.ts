"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// exemplo de função no servidor
export async function getAppointments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("video_services")
    .select("id, client_name, subject, datetime, video_service_state")
    .order("datetime", { ascending: true });

  if (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id.toString(),
    name: item.client_name,
    subject: item.subject,
    time: new Date(item.datetime).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date(item.datetime).toISOString().split("T")[0],
    status: item.video_service_state as
      | "scheduled"
      | "in_progress"
      | "cancelled",
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
  const {data, error} = await supabase
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
    .update({ datetime: localDateTimeString })
    .eq("id", appointmentId);
  if (error) {
    console.error("Erro ao reagendar chamada:", error);
    return;
  }

  // Revalidar a home para refletir a alteração
  revalidatePath("/home");
}
