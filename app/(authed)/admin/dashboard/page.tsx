"use client";

import { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import AppointmentList, { Appointment } from "@/components/AppointmentList";
import StatsCard from "@/components/StatsCard";
import {
  approveAppointment,
  cancelAppointment,
  completeAppointment,
  getAppointmentsByOwnerId,
  rescheduleAppointment,
} from "./actions/appointments";
import ReassignModal from "@/components/ReassignModal";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(
    null
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [daysWithEvents, setDaysWithEvents] = useState<string[]>([]);

  const proximos = appointments.filter(
    (a) => a.video_service_state === "scheduled"
  );
  const pendentes = appointments.filter(
    (a) => a.video_service_state === "in_progress"
  );
  const cancelados = appointments.filter(
    (a) => a.video_service_state === "cancelled"
  );
  const completados = appointments.filter(
    (a) => a.video_service_state === "completed"
  );

  const fetchAppointments = async () => {
    const data = await getAppointmentsByOwnerId();
    setAppointments(data);

    const dates = data.map((appt) => {
      const d = new Date(appt.datetime || appt.datetime); // ajuste conforme seu campo real
      return d.toISOString().split("T")[0];
    });

    const uniqueDates = Array.from(new Set(dates));
    setDaysWithEvents(uniqueDates);
  };

  const handleReschedule = async (
    appt: Appointment,
    newDate: Date,
    newTime: string
  ) => {
    await rescheduleAppointment(appt.id, newDate, newTime);
    await fetchAppointments();
    setModalAppointment(null);
  };

  const handleApprove = async (id: string) => {
    await approveAppointment(id);
    await fetchAppointments();
  };

  const handleCancel = async (id: string) => {
    await cancelAppointment(id);
    await fetchAppointments();
  };

  const handleCompleted = async (id: string) => {
    await completeAppointment(id);
    await fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <main className="max-w-11/12 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentList
            title="Próximos"
            appointments={proximos}
            footerType="link"
            onCancel={handleCancel}
            onComplete={handleCompleted}
            onReschedule={(appt) => setModalAppointment(appt)}
          />
          <AppointmentList
            title="Agendamentos"
            appointments={pendentes}
            footerType="link"
            onApprove={handleApprove}
            onCancel={handleCancel}
            onReschedule={(appt) => setModalAppointment(appt)}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-blue-600 my-3">Agenda</h2>
            <Calendar
              daysWithEvents={daysWithEvents}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          <div>
            <h2 className="text-xl flex gap-2">
              <p className="text-blue-500 font-bold">Total</p>
              <p className="text-gray-300 font-normal">VideoAtendimentos</p>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <StatsCard
                title={completados.length}
                subtitle="VideoAtendimentos"
                value={270}
                color="call"
              />
              <StatsCard
                title={cancelados.length}
                subtitle="VideoAtendimentos"
                value={cancelados.length}
                color="dismiss"
              />
            </div>
          </div>
        </div>
      </div>
      {modalAppointment && (
        <ReassignModal
          isOpen={!!modalAppointment}
          onClose={() => setModalAppointment(null)}
          onConfirm={(date, time) =>
            handleReschedule(modalAppointment, date, time)
          }
        />
      )}
    </main>
  );
}
