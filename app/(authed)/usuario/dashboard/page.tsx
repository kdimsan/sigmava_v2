import DailyAgendaPage from "@/components/DailyAgendaPage";
import React from "react";
import { getAppointmentsByUserId } from "./actions/appointments";

export default async function NextCalls() {
  const appointments = await getAppointmentsByUserId();
  return (
    <main className="w-11/12 mx-auto">
      <DailyAgendaPage appointments={appointments}/>
    </main>
  );
}
