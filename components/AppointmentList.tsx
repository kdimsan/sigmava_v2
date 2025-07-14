"use client";

import CallGreen from "@/assets/svgs/callGreen";
import { Search, Phone, FileText, X } from "lucide-react";

import Dismiss from "@/assets/svgs/dismiss";
import Calendar from "@/assets/svgs/calendar";
import Link from "next/link";
import Check from "@/assets/svgs/check";
import { formatDate, formatTime } from "@/utils/formats";

export interface Appointment {
  id: string;
  datetime: string
  client_name: string;
  subject: string;
  video_service_state: "scheduled" | "in_progress" | "cancelled" | "pending" | "completed";
}

interface AppointmentListProps {
  title: string;
  appointments: Appointment[];
  footerType: "link" | "showMore";
  onApprove?: (id: string) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export default function AppointmentList({
  title,
  appointments,
  footerType,
  onApprove,
  onCancel,
  onReschedule,
  onComplete,
}: AppointmentListProps) {
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
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500 text-sm"
                >
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              appointments.map((appointment, index) => (
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
                      {formatDate(appointment.datetime)}
                    </span>
                  </td>

                  <td className="py-3">
                    <span className="text-sm text-gray-900">
                      {formatTime(appointment.datetime)}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-gray-900">
                      {appointment.client_name}
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
                        onClick={
                          appointment.video_service_state === "in_progress"
                            ? () => onApprove?.(appointment.id)
                            : () => onComplete?.(appointment.id)
                        }
                        className={`w-9 h-9 bg-green-400 rounded-full flex items-center justify-center transition-colors ${
                          !onApprove || !onComplete
                            ? "hover:bg-gray-300 !hover:cursor-not-allowed transition-colors"
                            : "hover:bg-green-500"
                        }`}
                        title="Aprovar"
                      >
                        {appointment.video_service_state === "in_progress" ? (
                          <Check />
                        ) : (
                          <CallGreen />
                        )}
                      </button>

                      <button
                        onClick={() => onReschedule?.(appointment)}
                        className={`w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center transition-colors ${
                          !onReschedule
                            ? "hover:bg-gray-300 !!hover:cursor-not-allowed transition-colors"
                            : "hover:bg-gray-500"
                        }`}
                        title="Reagendar"
                      >
                        <Calendar />
                      </button>

                      <button
                        onClick={() => onCancel?.(appointment.id)}
                        className={`w-9 h-9 bg-red-500 rounded-full flex items-center justify-center ${
                          !onCancel
                            ? "hover:bg-gray-300 !hover:cursor-not-allowed transition-colors"
                            : ""
                        }`}
                        title="Cancelar"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {footerType === "link" && (
          <div className="mt-4 p-3 border-t border-gray-100 w-full flex">
            <Link
              href={
                title === "Próximos"
                  ? "/admin/dashboard/proximos_listagem"
                  : "/admin/dashboard/chamados_pendentes"
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
