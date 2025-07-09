"use client"

import AppointmentList, { Appointment } from "@/components/AppointmentList";
import BackButton from "@/components/BackButton";
import React, { useEffect, useState } from "react";

import ReassignModal from "@/components/ReassignModal";
import { approveAppointment, cancelAppointment, getAppointments, rescheduleAppointment } from "../actions/appointments";

export default function TotalMadeCalls() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(
    null
  );

  const fetchAppointments = async () => {
    const data = await getAppointments("completed");
    setAppointments(data);
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <main className="h-screen w-11/12 flex-1 mx-auto">
      <div className="flex gap-5">
        <div className="mt-1.5">
          <BackButton />
        </div>
        <div className="w-full">
          <AppointmentList
            title="Agendamentos completos"
            appointments={appointments}
            footerType="showMore"
          />
        </div>
      </div>
    </main>
  );
}
