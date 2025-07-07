import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

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

const statusConfig = {
  scheduled: { label: "ACEITE", color: "bg-blue-50 text-blue-700 border-blue-200" },
  in_progress: { label: "EM PROGRESSO", color: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "CANCELADO", color: "bg-red-50 text-red-700 border-red-200" },
  completed: { label: "CONCLUÍDO", color: "bg-gray-50 text-gray-700 border-gray-200" },
};

interface AppointmentCardProps {
  appointment: Appointment;
  isExpanded: boolean;
  onToggle: () => void;
  onCancel: () => void;
  formatDate: (date: string) => string;
}

export default function AppointmentCard({
  appointment,
  isExpanded,
  onToggle,
  onCancel,
  formatDate,
}: AppointmentCardProps) {
  const statusInfo = statusConfig[appointment.status] || statusConfig.scheduled;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200">
      {/* Card Header */}
      <div className="flex items-center justify-between ">
        <div className="flex flex-col space-y-1 text-xs font-bold uppercase tracking-wider">
          <span className="text-gray-500">DEPARTAMENTO</span>
          <span className="text-gray-600 leading-tight">{appointment.department}</span>
        </div>
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Card Content */}
      <div>
        <h3 className="text-xl font-semibold text-blue-500 leading-tight py-3">
          {appointment.subject}
        </h3>

        {isExpanded && (
          <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-300">
            <div className="mb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                MENSAGEM
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">
                {appointment.message}
              </p>
            </div>

            <div className="mb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                CLIENTE
              </span>
              <p className="text-sm font-medium text-gray-900">
                {appointment.name}
              </p>
            </div>

            {appointment.status === "scheduled" && (
              <button
                onClick={onCancel}
                className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">
              {formatDate(appointment.date)} | {appointment.time}
            </span>
          </div>
          <button
            onClick={onToggle}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 px-2 py-1 rounded-md hover:bg-blue-50"
          >
            {isExpanded ? (
              <>
                Ver menos
                <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Ver mais
                <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
