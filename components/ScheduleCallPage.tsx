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
  duration: number;
  id: number;
  user_id: string;
  start_time: string;
  end_time: string;
  date: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  department_id: string;
}

interface ScheduleCallPageProps {
  departaments: Department[];
  slots: AvailabilitySlot[];
  licenseId: number; // Novo!
}



export default function ScheduleCallPage({
  departaments,
  slots: initialSlots,
  licenseId,
}: ScheduleCallPageProps) {
  const [dep, setDep] = useState("");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots);

  const router = useRouter();

  const filteredSlots = slots.filter(
    (slot) => String(slot.department_id) === String(dep)
  );

  const availableDates = Array.from(
    new Set(filteredSlots.map((slot) => slot.date))
  ).map((dateStr) => new Date(dateStr));

  const departmentOptions = departaments.map((d) => ({
    label: d.name,
    value: String(d.id),
  }));

  const selectedDateStr = selectedDays[0]
    ? selectedDays[0].toLocaleDateString("sv-SE")
    : "";

  const availableHours = filteredSlots.filter(
    (slot) => slot.date === selectedDateStr
  );

  const timeSlotOptions = availableHours.flatMap((slot) => {
    const duration = slot.duration || 15; // pega duração do slot, ou 15 min padrão
    const intervals = generateTimeIntervals(slot.start_time, slot.end_time, duration);
  
    return intervals.map((time) => ({
      label: time,
      value: `${slot.id}|${time}`,
    }));
  });

  function generateTimeIntervals(startTime: string, endTime: string, duration: number): string[] {
    const intervals = [];
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
  
    let current = new Date();
    current.setHours(startH, startM, 0, 0);
  
    const end = new Date();
    end.setHours(endH, endM, 0, 0);
  
    while (current.getTime() + duration * 60000 <= end.getTime()) {
      const hh = current.getHours().toString().padStart(2, "0");
      const mm = current.getMinutes().toString().padStart(2, "0");
      intervals.push(`${hh}:${mm}`);
  
      current = new Date(current.getTime() + duration * 60000);
    }
  
    return intervals;
  }

  async function loadSlots(departmentId: string) {
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseId, departmentId }),
      });

      if (!res.ok) throw new Error("Erro ao buscar slots");

      const data = await res.json();
      console.log("data", data);

      setSlots(data);
      setSelectedDays([]);
      setSelectedTimeSlot("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen px-4 pb-20 max-w-5xl mx-auto">
      <PageHeader title="Agendar" subtitle="Video Atendimentos" />

      <form
        action={createAppointment}
        className="flex flex-col space-y-8 lg:grid lg:grid-cols-2 lg:gap-18"
      >
        <div className="space-y-6">
          <Select
            value={dep}
            onChange={(value) => {
              setDep(value);
              loadSlots(value);
            }}
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
                setSelectedTimeSlot("");
              }}
              className="border border-gray-200 rounded-md p-2 mt-1 bg-white max-w-[400px] flex items-center justify-center"
              disabled={(date) =>
                !availableDates.some(
                  (d) =>
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
                )
              }
            />
            {selectedDays.map((date, i) => (
              <Input
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
                options={timeSlotOptions}
                value={selectedTimeSlot}
                onChange={setSelectedTimeSlot}
                placeholder="Selecione um horário"
                name="selectedTimeSlot"
                className="max-w-[400px]"
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
