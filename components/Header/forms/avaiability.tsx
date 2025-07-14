"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Input from "@/components/Form/input";
import { createAvaiability } from "@/app/(authed)/admin/dashboard/actions/avaiabilities";
import toast, { Toaster } from "react-hot-toast";

const availabilityOptions = ["10min", "15min", "30min", "45min", "60min"];

export interface FormWithCancelProps {
  onCancel?: () => void;
}

export default function AvailabilityForm({ onCancel }: FormWithCancelProps) {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [duration, setDuration] = useState("15min");
  const [timeSlots, setTimeSlots] = useState<{ from: string; to: string }[]>([
    { from: "", to: "" },
  ]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    selectedDays.forEach((date) => {
      formData.append("calendarDates[]", date.toLocaleDateString("sv-SE"));
    });

    try {
      await createAvaiability(formData);
      toast.success("Disponibilidade criada com sucesso!");
      setSelectedDays([]);
      setDuration("15min");
      setTimeSlots([{ from: "", to: "" }]);
    } catch (error) {
      toast.error("Erro ao criar disponibilidade. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h3 className="text-xl font-bold text-blue-500 mb-4">
          Disponibilidade
        </h3>
        <div>
          <label className="text-sm font-medium">Selecionar dias</label>
          <DayPicker
            required
            mode="multiple"
            selected={selectedDays}
            onSelect={setSelectedDays}
            className="border rounded-md p-2 mt-1 bg-white"
          />
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Duração da chamada</label>
          <select
            name="duration"
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

        <div className="w-full flex gap-5 text-white">
          <button
            onClick={onCancel}
            type="button"
            className="bg-gray-200 py-4 w-full rounded-[10px] hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            type="submit"
            className={`bg-blue-500 shadow py-4 w-full rounded-[10px] hover:bg-blue-600 transition-colors ${
              loading ? "disabled:cursor-none" : ""
            }`}
          >
            {loading ? "A enviar..." : "Guardar"}
          </button>
        </div>
      </form>
    </>
  );
}
