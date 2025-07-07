import { getAppointments } from "@/app/(authed)/admin/actions/appointments";
import NextCallsPage from "@/components/NextCallsPage";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";

export default async function CallsHistory() {
  const appointmentsFiltered = (await getAppointments()).filter(
    (ap) => ap.status === "cancelled" || ap.status === "completed"
  );

  return (
    <main>
      <PageHeader title="Histórico" subtitle="Video Atendimentos" className="px-1.5"/>
      <div>
        <NextCallsPage appointments={appointmentsFiltered} />
      </div>
    </main>
  );
}
