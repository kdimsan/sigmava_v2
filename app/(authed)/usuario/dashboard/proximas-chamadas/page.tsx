import { getAppointments } from "@/app/(authed)/admin/dashboard/actions/appointments";
import NextCallsPage from "@/components/NextCallsPage";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";
import { getAppointmentsByUserId } from "../actions/appointments";
import { Appointment } from "@/components/AppointmentList";

export default async function NextCalls() {
  //Caso queira mais dados usar este:
  // const appointmentsFiltered = (await getAppointments()).filter(
  //   (ap) => ap.status === "in_progress" || ap.status === "scheduled"
  // );

  const appointmentsFiltered = (await getAppointmentsByUserId()).filter(
    (ap) =>
      ap.video_service_state === "in_progress" ||
      ap.video_service_state === "scheduled"
  );

  if (appointmentsFiltered.length === 0) {
    return (
      <div className="flex flex-col text-center py-16">
        <PageHeader
        title="Próximos"
        subtitle="Video Atendimentos"
        className="px-1.5"
      />
        <p className="text-xl font-semibold text-blue-600">
          Não têm marcações para <span className="text-blue-800">este dia</span>,
        </p>
        <p className="text-gray-400 mt-1">
          faça já a sua marcação.
        </p>
      </div>
    );
  }
  return (
    <main>
      <PageHeader
        title="Próximos "
        subtitle="Video Atendimentos"
        className="px-1.5"
      />
      <div>
        <NextCallsPage appointments={appointmentsFiltered} />
      </div>
    </main>
  );
}
