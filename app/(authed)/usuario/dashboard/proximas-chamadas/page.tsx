import { getAppointments } from "@/app/(authed)/admin/dashboard/actions/appointments";
import NextCallsPage from "@/components/NextCallsPage";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";

export default async function NextCalls() {
  const appointmentsFiltered = (await getAppointments()).filter(
    (ap) => ap.status === "in_progress" || ap.status === "scheduled"
  );
  return (
    <main>
      <PageHeader title="Próximos " subtitle="Video Atendimentos" className="px-1.5"/>
      <div>
        <NextCallsPage appointments={appointmentsFiltered} />
      </div>
    </main>
  );
}
