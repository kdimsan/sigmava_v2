"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

export interface AppointmentProps {
  id: string;
  datetime: string;
  name: string;
  subject: string;
  status: "scheduled" | "in_progress" | "cancelled" | "pending" | "completed";
  department_name: string;
}

export default function DailyAgendaPage({
  appointments,
}: {
  appointments: AppointmentProps[];
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const fullHours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const meetingsForSelectedDay = appointments.filter((a) =>
    isSameDay(new Date(a.datetime), selectedDate)
  );

  console.log("appointments", appointments);
  console.log("meetingsForSelectedDay", meetingsForSelectedDay);

  if (appointments.length === 0) {
    return (
      <div className="max-w-full mx-auto min-h-screen flex flex-col">
        <div className="flex items-center justify-between py-3">
          <button onClick={handlePrevMonth}>
            <ChevronLeft className="text-gray-700" />
          </button>
          <span className="font-semibold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button onClick={handleNextMonth}>
            <ChevronRight className="text-gray-700" />
          </button>
        </div>

        <div className="overflow-x-auto flex space-x-2 pb-4">
          {monthDays.map((date, idx) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center rounded-md px-3 py-2 min-w-[50px] ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <span className="text-xs">
                  {format(date, "EEE", { locale: undefined })}
                </span>
                <span className="text-lg font-semibold">{date.getDate()}</span>
              </button>
            );
          })}
        </div>

        {/* Estado vazio */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Não têm marcações,{" "}
              <span className="text-gray-500">faça já a sua marcação.</span>
            </h2>
          </div>

          <Link href="/usuario/dashboard/agendar-chamada">
            <button className="px-8 py-3 bg-green-400 text-white rounded-lg font-medium hover:bg-green-500 transition-colors">
              Agende já
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4 flex flex-col min-h-screen">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="text-gray-700" />
        </button>
        <span className="font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button onClick={handleNextMonth}>
          <ChevronRight className="text-gray-700" />
        </button>
      </div>

      <div className="overflow-x-auto flex space-x-2 px-4 pb-2">
        {monthDays.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center rounded-md px-3 py-2 min-w-[50px] ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span className="text-xs">
                {format(date, "EEE", { locale: undefined })}
              </span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-y-auto flex-1 px-4">
        {fullHours.map((hour, idx) => {
          const meetings = meetingsForSelectedDay.filter((m) => {
            const meetingDate = new Date(m.datetime);
            return meetingDate.getHours() === idx;
          });

          return (
            <div
              key={idx}
              className="flex flex-col py-2 border-b border-gray-100"
            >
              <span className="text-xs text-gray-400">{hour}</span>
              {meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-blue-100 p-3 rounded-md shadow mt-1"
                  >
                    <span className="text-[10px] font-semibold uppercase text-blue-700">
                      {meeting.department_name}
                    </span>
                    <p className="text-blue-900 text-sm font-medium">
                      {meeting.subject}
                    </p>
                  </div>
                ))
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
