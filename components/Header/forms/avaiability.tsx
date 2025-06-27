// components/Form/Availability.tsx
"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Input from "@/components/Form/input";
import { createAvaiability } from "@/app/(authed)/home/actions/avaiabilities";

const availabilityOptions = ["10min", "15min", "30min", "45min", "60min"];

export default function AvailabilityForm() {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [duration, setDuration] = useState("15min");
  const [timeSlots, setTimeSlots] = useState<{ from: string; to: string }[]>([
    { from: "", to: "" },
  ]);

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
    <form action={createAvaiability} className="space-y-6">
      <h3 className="text-xl font-bold text-blue-500 mb-4">Disponibilidade</h3>

      {/* Calendário */}
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

      {/* Duração da chamada */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Duração da chamada</label>
        <select
          name="meetingDuration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          {availabilityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Intervalos de horário */}
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

      {/* Botões */}
      <div className="flex gap-4">
        <button
          type="button"
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
