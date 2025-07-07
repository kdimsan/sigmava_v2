"use client";

import React, { useRef, useState } from "react";
import Select from "@/components/Form/select";
import Input from "./Form/input";
import TextArea from "./Form/textArea";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import PageHeader from "./ui/PageHeader";

interface Department {
  id: string;
  name: string;
}

interface DepartamentsProps {
  departaments: Department[];
}

export default function ScheduleCallPage({ departaments }: DepartamentsProps) {
  const [dep, setDep] = useState("");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ from: string; to: string }[]>([
    { from: "", to: "" },
  ]);
  const router = useRouter();
  const handleNavigation = () => {
    router.back();
  };

  const departmentOptions = departaments.map((d) => ({
    label: d.name,
    value: String(d.id),
  }));

  const addSlot = () => {
    setTimeSlots([...timeSlots, { from: "", to: "" }]);
  };

  const handleSlotChange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };
  return (
    <main className="min-h-screen px-4 pt-6 pb-20">
      <PageHeader title="Agendar" subtitle="Video Atendimentos" />
      <div className="flex flex-col space-y-6">
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
              mode="multiple"
              selected={selectedDays}
              onSelect={setSelectedDays}
              className="border rounded-md p-2 mt-1 bg-white"
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
            <label className="text-sm font-medium">Horários disponíveis</label>
            {timeSlots.map((slot, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  type="time"
                  name={`timeSlots[${i}][from]`}
                  value={slot.from}
                  onChange={(e) => handleSlotChange(i, "from", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
                <input
                  type="time"
                  name={`timeSlots[${i}][to]`}
                  value={slot.to}
                  onChange={(e) => handleSlotChange(i, "to", e.target.value)}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addSlot}
              className="text-blue-600 text-sm mt-2"
            >
              + Adicionar horário
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={handleNavigation}>Cancelar</button>
          <button>Confirmar</button>
        </div>
      </div>
    </main>
  );
}
