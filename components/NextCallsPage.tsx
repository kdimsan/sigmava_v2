"use client";

import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import AppointmentCard from "./appointmentCard";
import { formatDate } from "@/utils/formats";
import { cancelAppointment } from "@/app/(authed)/admin/dashboard/actions/appointments";
import toast from "react-hot-toast";

interface Appointment {
  id: string;
  name: string;
  subject: string;
  message: string;
  time: string;
  datetime: string;
  department: string;
  video_service_state: "scheduled" | "in_progress" | "cancelled" | "completed";
}

interface Appointments {
  appointments: Appointment[];
}

export default function NextCallsPage({ appointments }: Appointments) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localAppointments, setLocalAppointments] =
    useState<Appointment[]>(appointments);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const handleCancel = async (id: string) => {
    try {
      setLoadingId(id);
      await cancelAppointment(id);
      toast.success("Cancelado com sucesso!");
      setLocalAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      toast.error("Erro ao cancelar.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {localAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          isExpanded={expandedCards.has(appointment.id)}
          onToggle={() => toggleExpanded(appointment.id)}
          onCancel={() => handleCancel(appointment.id)}
          formatDate={formatDate}
          isLoading={loadingId === appointment.id}
        />
      ))}
    </div>
  );
}
