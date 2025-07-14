import { getAppointments } from "@/app/(authed)/admin/dashboard/actions/appointments";
import NextCallsPage from "@/components/NextCallsPage";
import PageHeader from "@/components/ui/PageHeader";
import React from "react";
import { getAppointmentsByUserId } from "../actions/appointments";

export default async function CallsHistory() {
  //Caso queira mais dados usar este:
  // const appointmentsFiltered = (await getAppointments()).filter(
  //   (ap) => ap.status === "cancelled" || ap.status === "completed"
  // );
  const appointmentsFiltered = (await getAppointmentsByUserId()).filter(
    (ap) =>
      ap.video_service_state === "cancelled" ||
      ap.video_service_state === "completed"
  );

  if (appointmentsFiltered.length === 0) {
      return (
        <div className="flex flex-col text-center py-16">
          <PageHeader
          title="Histórico"
          subtitle="Video Atendimentos"
          className="px-1.5"
        />
          <p className="text-xl font-semibold text-blue-600">
            Não têm histórico de marcações
          </p>

        </div>
      );
    }

  return (
    <main className="max-w-5xl mx-auto px-6">
      <PageHeader
        title="Histórico"
        subtitle="Video Atendimentos"
        className="px-1.5"
      />
      <div>
        <NextCallsPage appointments={appointmentsFiltered} />
      </div>
    </main>
  );
}
