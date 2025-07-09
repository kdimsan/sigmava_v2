"use client";
import AppointmentList, { Appointment } from "@/components/AppointmentList";
import BackButton from "@/components/BackButton";
import React, { useEffect, useState } from "react";

import ReassignModal from "@/components/ReassignModal";
import { approveAppointment, cancelAppointment, getAppointments, rescheduleAppointment } from "../actions/appointments";

export default function NextList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(
    null
  );

  const fetchAppointments = async () => {
    const data = await getAppointments("scheduled");
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
    <main className="max-w-10/12 mx-auto h-svh flex-1">
      <div className="flex gap-5">
        <div className="mt-1.5">
          <BackButton />
        </div>
        <div className="w-full">
          {/*listagem */}

          <AppointmentList
            title="Próximos"
            appointments={appointments}
            footerType="showMore"
          />
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
