import { getAppointments } from "@/app/(authed)/admin/dashboard/actions/appointments";
import DailyAgendaPage from "@/components/DailyAgendaPage";
import NextCallsPage from "@/components/NextCallsPage";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";
import { getAppointmentsByUserId } from "./actions/appointments";

export default async function NextCalls() {
  const appointments = await getAppointmentsByUserId();
  return (
    <main>
      <DailyAgendaPage appointments={appointments}/>
    </main>
  );
}
