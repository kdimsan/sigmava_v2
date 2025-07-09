"use client";

import { getAppointments } from "@/app/(authed)/admin/dashboard/actions/appointments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysWithEvents, setDaysWithEvents] = useState<string[]>([]);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Buscar agendamentos para o mês/ano corrente
  useEffect(() => {
    async function fetchAppointments() {
      const allAppointments = await getAppointments("scheduled");
      console.log("all", allAppointments);

      // Filtrar só agendamentos do mês e ano atuais
      const filtered = allAppointments.filter((app) => {
        const appDate = new Date(app.date); // app.date é 'yyyy-mm-dd'
        return (
          appDate.getFullYear() === currentDate.getFullYear() &&
          appDate.getMonth() === currentDate.getMonth()
        );
      });

      // Pegar só as datas (string 'yyyy-mm-dd') sem duplicar
      const uniqueDates = Array.from(new Set(filtered.map((app) => app.date)));
      setDaysWithEvents(uniqueDates);
    }

    fetchAppointments();
  }, [currentDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Dias do mês anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i),
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  function toLocalISODate(date: Date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <h3 className="text-lg font-semibold text-blue-600">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={() => navigateMonth("next")}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj, index) => {
          // Verifica se tem evento para este dia (comparando string ISO)
          const dayISO = toLocalISODate(dayObj.date);
          const hasEvent =
            dayObj.isCurrentMonth && daysWithEvents.includes(dayISO);

          return (
            <button
              key={index}
              onClick={() => onDateSelect?.(dayObj.date)}
              className={`
                relative h-8 text-sm rounded transition-colors
                ${
                  dayObj.isCurrentMonth
                    ? "text-gray-900 hover:bg-blue-50"
                    : "text-gray-400"
                }
                ${isSelected(dayObj.date) ? "bg-blue-600 text-white" : ""}
                ${
                  isToday(dayObj.date) && !isSelected(dayObj.date)
                    ? "bg-blue-100 text-blue-600"
                    : ""
                }
              `}
            >
              {dayObj.day}
              {hasEvent && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
