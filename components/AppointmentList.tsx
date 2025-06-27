"use client";

import CallGreen from "@/assets/svgs/callGreen";
import { Search, Phone, FileText, X } from "lucide-react";

import Dismiss from "@/assets/svgs/dismiss";
import Calendar from "@/assets/svgs/calendar";
import Link from "next/link";
import Check from "@/assets/svgs/check";

export interface Appointment {
  id: string;
  time: string;
  date: string;
  name: string;
  subject: string;
  status: "scheduled" | "in_progress" | "cancelled" | "pending" | "completed";

}

interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
  footerType: "link" | "showMore";
  onApprove?: (id: string) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (id: string) => void;
}

export default function AppointmentList({
  title,
  appointments,
  footerType,
  onApprove,
  onCancel,
  onReschedule,
}: AppointmentListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-400 hover:bg-green-500";
      case "in-progress":
        return "bg-gray-400";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <CallGreen className="m-2" />;
      case "in-progress":
        return <Calendar className="hover:bg-red-400" />;
      case "cancelled":
        return <Dismiss />;
      default:
        return <Phone className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="rounded-lg">
      <div className="flex gap-1 items-center my-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <h2 className="text-xl font-bold text-blue-600">{title}</h2>
        <p className="text-xl text-gray-500 font-normal">
          {title.includes("Próximos") ? "VideoAtendimentos" : "pendentes"}
        </p>
      </div>

      <div className="rounded-lg bg-white">
        <table className="w-full rounded-lg p-3">
          <thead className="bg-gray-100 text-center rounded-t-lg">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-t-lg">
              <th className="p-3">ID</th>
              <th className="">DIA</th>
              <th className="">HORA</th>
              <th className="">NOME</th>
              <th className="">ASSUNTO</th>
              <th className="">Ações</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {appointments.map((appointment, index) => (
              <tr
                key={appointment.id}
                className="border-b border-gray-50 last:border-b-0"
              >
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {appointment.id}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-sm text-gray-900">
                    {new Date(appointment.date).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </td>

                <td className="py-3">
                  <span className="text-sm text-gray-900">
                    {appointment.time}
                  </span>
                </td>
                <td className="py-3">
                  <span className="text-sm text-gray-900">
                    {appointment.name}
                  </span>
                </td>
                <td className="py-3">
                  <span className="text-sm text-gray-600">
                    {appointment.subject}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onApprove?.(appointment.id)}

                      className="w-9 h-9 bg-green-400 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors"
                      title="Aprovar"
                    >
                      {appointment.status === "in_progress" ? <Check /> : <CallGreen />}
                    </button>

                    <button
                      onClick={() => onReschedule?.(appointment)}
                      className="w-9 h-9 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                      title="Reagendar"
                    >
                      <Calendar />
                    </button>

                    <button
                      onClick={() => onCancel?.(appointment.id)}

                      className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {footerType === "link" && (
          <div className="mt-4 p-3 border-t border-gray-100 w-full flex">
            <Link
              href={
                title === "Próximos"
                  ? "/home/proximos_listagem"
                  : "/home/chamados_pendentes"
              }
              className="w-full bg-blue-200 py-1.5 rounded-md text-sm font-medium text-center text-blue-500"
            >
              Ver todos
            </Link>
          </div>
        )}

        {footerType === "showMore" && (
          <div className="mt-4 p-3 border-t border-gray-100 w-full flex">
            <button
              // onClick={onLoadMore}
              className="w-full bg-blue-200 py-1.5 rounded-md text-sm font-medium text-center text-blue-500 hover:bg-blue-300 transition-colors"
            >
              Carregar mais
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
