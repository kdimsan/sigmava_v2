"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import MobileHeader from "@/components/MobileHeader";

export default function DailyAgenda() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const fakeMeetings = [
    { id: 1, time: "10:00", department: "Informática e Base de Dados", title: "Quebra de servidor e armazenamento" },
    { id: 2, time: "14:00", department: "Financeiro", title: "Revisão de orçamento" }
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const fullHours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  return (
    <div className="pb-4 flex flex-col min-h-screen">
      {/* Mês e navegação */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="text-gray-700" />
        </button>
        <span className="font-semibold text-gray-800">
          {format(startOfMonth(currentMonth), "MMMM yyyy")}
        </span>
        <button onClick={handleNextMonth}>
          <ChevronRight className="text-gray-700" />
        </button>
      </div>

      {/* Calendário horizontal */}
      <div className="overflow-x-auto flex space-x-2 px-4 pb-2">
        {weekDays.map((day, idx) => {
          const date = new Date(currentMonth);
          date.setDate(12 + idx); // Exemplo (12 ao 18)
          const isSelected = idx === 2; // Apenas simulação
          return (
            <div
              key={idx}
              className={`flex flex-col items-center rounded-md px-3 py-2 ${
                isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              <span className="text-xs">{day}</span>
              <span className="text-lg font-semibold">{12 + idx}</span>
            </div>
          );
        })}
      </div>

      {/* Agenda do dia com scroll */}
      <div className="overflow-y-auto flex-1 px-4">
        {fullHours.map((hour, idx) => {
          const meeting = fakeMeetings.find((m) => m.time === hour);
          return (
            <div key={idx} className="flex flex-col py-2 border-b border-gray-100">
              <span className="text-xs text-gray-400">{hour}</span>
              {meeting ? (
                <div className="bg-blue-100 p-3 rounded-md shadow mt-1">
                  <span className="text-[10px] font-semibold uppercase text-blue-700">{meeting.department}</span>
                  <p className="text-blue-900 text-sm font-medium">{meeting.title}</p>
                </div>
              ) : (
                <div className="h-8"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
