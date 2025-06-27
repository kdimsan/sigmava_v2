"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: Date, newTime: string) => void;
}

export default function ReassignModal({
  isOpen,
  onClose,
  onConfirm,
}: ReassignModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold text-gray-800">Reagendar chamada</Dialog.Title>
          <div className="mt-4">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
            <input
              type="time"
              className="w-full mt-4 border p-2 rounded-md"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md text-gray-600">Cancelar</button>
            <button onClick={handleConfirm} className="bg-blue-600 text-white px-4 py-2 rounded-md">Confirmar</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
