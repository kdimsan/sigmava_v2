"use client";

import React, { useRef, useState } from "react";
import Select from "@/components/Form/select";
import Input from "./Form/input";
import TextArea from "./Form/textArea";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import PageHeader from "./ui/PageHeader";
import SelectField from "@/components/Form/select";
import { createAppointment } from "@/app/(authed)/usuario/dashboard/actions/appointments";

interface Department {
  id: string;
  name: string;
}

export interface AvailabilitySlot {
  id: number;
  user_id: string;
  start_time: string; // formato HH:mm:ss ou HH:mm
  end_time: string; // idem
  date: string; // formato YYYY-MM-DD
  available: boolean;
  created_at: string;
  updated_at: string;
}
interface ScheduleCallPageProps {
  departaments: Department[];
  slots: AvailabilitySlot[];
}

export default function ScheduleCallPage({
  departaments,
  slots,
}: ScheduleCallPageProps) {
  const [dep, setDep] = useState("");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const router = useRouter();
  const handleNavigation = () => {
    router.back();
  };

  const availableDates = Array.from(
    new Set(slots.map((slot) => slot.date))
  ).map((dateStr) => new Date(dateStr));

  const departmentOptions = departaments.map((d) => ({
    label: d.name,
    value: String(d.id),
  }));

  const selectedDateStr = selectedDays[0]
    ? selectedDays[0].toLocaleDateString("sv-SE")
    : "";
  const availableHours = slots.filter((slot) => slot.date === selectedDateStr);

  const timeSlotOptions = availableHours.map((slot) => ({
    label: `${slot.start_time} às ${slot.end_time}`,
    value: `${slot.id}|${slot.start_time}|${slot.end_time}`,
  }));

  return (
    <main className="min-h-screen px-4 pt-6 pb-20">
      <PageHeader title="Agendar" subtitle="Video Atendimentos" />
      <form action={createAppointment} className="flex flex-col space-y-6">
        <Select
          value={dep}
          onChange={setDep}
          label="DEPARTAMENTO"
          options={departmentOptions}
          name="department"
        />
        <Input
          label="ASSUNTO"
          placeholder="Ex.: Registos"
          id="subject"
          name="subject"
        />
        <TextArea
          label="MENSAGEM"
          placeholder="Descreva o assunto"
          id="message"
          name="message"
        />
        <div className="inputs">
          <div>
            <label className="text-sm font-medium">Selecionar dias</label>
            <DayPicker
              required
              mode="single"
              selected={selectedDays[0]}
              onSelect={(date) => setSelectedDays(date ? [date] : [])}
              className="border rounded-md p-2 mt-1 bg-white"
              disabled={(date) =>
                !availableDates.some(
                  (d) => d.toDateString() === date.toDateString()
                )
              }
            />
            {selectedDays.map((date, i) => (
              <input
                key={i}
                type="hidden"
                name="calendarDates[]"
                value={date.toISOString().split("T")[0]}
              />
            ))}
          </div>
          <div className="mt-8">
            <label className="text-sm font-medium">Horários disponíveis</label>
            {timeSlotOptions.length > 0 ? (
              <SelectField
                label="Horários disponíveis"
                options={timeSlotOptions}
                value={selectedTimeSlot}
                onChange={setSelectedTimeSlot}
                placeholder="Selecione um horário"
                name="selectedTimeSlot"
              />
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Selecione um dia para ver os horários disponíveis.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
            type="button"
            onClick={handleNavigation}
          >
            Cancelar
          </button>
          <button
            className="flex-1 px-6 py-3 bg-blue-600 shadow-md shadow-blue-700 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            type="submit"
          >
            Agendar
          </button>
        </div>
      </form>
    </main>
  );
}
