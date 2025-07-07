"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUser } from "./user";


export async function getAppointmentsByUserId() {
    const supabase = await createClient();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return [];
    }
  
    // Busca agendamentos
    const { data: appointments, error } = await supabase
      .from("video_services")
      .select("*")
      .eq("user_id", user.id);
  
    if (error || !appointments) {
      return [];
    }
  
    // Pega IDs únicos dos departamentos
    const departmentIds = Array.from(
      new Set(appointments.map((a) => a.department_id).filter(Boolean))
    );

    console.log("depID", departmentIds);
    
  
    if (departmentIds.length === 0) {
      return appointments.map((a) => ({ ...a, department_name: null }));
    }
  
    // Busca nomes dos departamentos
    const { data: departments } = await supabase
      .from("departments")
      .select("id, name")
      .in("id", departmentIds);

      console.log("dep", departments);
      
  
    // Cria mapa para lookup rápido
    const departmentMap = new Map(
      departments?.map((d) => [d.id, d.name]) ?? []
    );

    console.log("DEART", departmentMap);
    
  
    // Junta os nomes no retorno
    const enrichedAppointments = appointments.map((a) => ({
      ...a,
      department_name: departmentMap.get(a.department_id) || null,
    }));

    console.log("ern", enrichedAppointments);
    
  
    return enrichedAppointments;
  }
  

export async function createAppointment(formData: FormData) {
    const department = formData.get("department");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const date = formData.get("calendarDates[]");
    const timeSlot = formData.get("selectedTimeSlot");
  
    if (!department || !subject || !date || !timeSlot) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }
  
    const [slot_id, start_time, end_time] = String(timeSlot).split("|");
    const datetime = `${date}T${start_time}`;
  
    const supabase = await createClient();

    const clientData = await getUser();
  
    const { error } = await supabase.from("video_services").insert([
      {
        department_id: Number(department),
        subject,
        message,
        datetime,
        slot_id: Number(slot_id),
        client_id: clientData!.client_id,
        user_id: clientData!.user_id,
        // Exemplo: você pode definir o ID do cliente aqui, se necessário:
        // client_id: someClientId,
        // slot_id: opcional, se quiser associar ao slot:
      },
    ]);
  
    if (error) {
      console.error("Erro ao agendar:", error);
      throw new Error("Erro ao agendar.");
    }
  
    redirect("/usuario/dashboard/agendar-chamada/sucesso");
}