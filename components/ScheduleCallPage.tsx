"use client";

import React, { useState } from "react";
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
  start_time: string;
  end_time: string;
  date: string;
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
    <main className="min-h-screen px-4 pt-6 pb-20 max-w-4xl mx-auto">
      <PageHeader title="Agendar" subtitle="Video Atendimentos" />

      <form
        action={createAppointment}
        className="flex flex-col space-y-8 lg:grid lg:grid-cols-2 lg:gap-18"
      >
        <div className="space-y-6">
          <Select
            value={dep}
            onChange={setDep}
            label="Departamento"
            options={departmentOptions}
            name="department"
          />

          <Input
            label="Assunto"
            placeholder="Ex.: Registos"
            id="subject"
            name="subject"
          />

          <TextArea
            label="Mensagem"
            placeholder="Descreva o assunto"
            id="message"
            name="message"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Selecionar Dia</label>
            <DayPicker
              required
              mode="single"
              selected={selectedDays[0]}
              onSelect={(date) => {
                setSelectedDays(date ? [date] : []);
                setSelectedTimeSlot(""); // Limpa o horário ao mudar o dia
              }}
              className="border rounded-md p-2 mt-1 bg-white max-w-[400px] flex items-center justify-center"
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

          <div>
            <label className="text-sm font-medium">Horários Disponíveis</label>
            {timeSlotOptions.length > 0 ? (
              <SelectField
                label="Horários Disponíveis"
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

        <div className="col-span-2 flex flex-col-reverse gap-4 lg:flex-row lg:gap-18">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 shadow-md shadow-blue-700 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Agendar
          </button>
        </div>
      </form>
    </main>
  );
}
