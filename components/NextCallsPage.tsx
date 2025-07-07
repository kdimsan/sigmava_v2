"use client";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import AppointmentCard from "./appointmentCard";

interface Appointment {
  id: string;
  name: string;
  subject: string;
  message: string;
  time: string;
  date: string;
  department: string;
  status: "scheduled" | "in_progress" | "cancelled" | "completed";
}

interface Appointments {
  appointments: Appointment[];
}

const statusConfig = {
  scheduled: {
    label: "ACEITE",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  in_progress: {
    label: "EM PROGRESSO",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "CANCELADO",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  completed: {
    label: "CONCLUÍDO",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export default function NextCallsPage({ appointments }: Appointments) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date
      .toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      .replace(/\//g, ".");
    return formattedDate;
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const handleCancel = (id: string) => {
    console.log("Cancelando agendamento:", id);
    // Adicione sua lógica de cancelamento aqui
  };

  

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {appointments.map((appointment)  => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          isExpanded={expandedCards.has(appointment.id)}
          onToggle={() => toggleExpanded(appointment.id)}
          onCancel={() => handleCancel(appointment.id)}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
