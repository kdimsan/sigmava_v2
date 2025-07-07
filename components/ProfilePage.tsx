"use client";

import { useState } from "react";
import { Home, Calendar, Clock, Settings, MessageSquare, Plus } from "lucide-react";
import Input from "./Form/input";
import SelectField from "./Form/select";
import PageHeader from "./ui/PageHeader";


export default function ProfileSettings() {
  const [phoneNumber, setPhoneNumber] = useState("910 281 921");
  const [smsCode, setSmsCode] = useState("");
  const [name, setName] = useState("João Martins");
  const [municipalChamber, setMunicipalChamber] = useState("camara-porto");
  const [activeTab, setActiveTab] = useState("definicoes");

  const municipalOptions = [
    { label: "Câmara Municipal do Porto", value: "camara-porto" },
    { label: "Câmara Municipal de Lisboa", value: "camara-lisboa" },
    { label: "Câmara Municipal de Braga", value: "camara-braga" },
    { label: "Câmara Municipal de Coimbra", value: "camara-coimbra" },
  ];

  const handleSendSMS = () => {
    // SMS sending logic
    console.log("Sending SMS to:", phoneNumber);
  };

  const handleReset = () => {
    setSmsCode("");
    setName("");
    setMunicipalChamber("");
  };

  const handleSave = () => {
    // Save profile logic
    console.log("Saving profile:", {
      phoneNumber,
      smsCode,
      name,
      municipalChamber,
    });
  };

  return (
    <div className=" min-h-screen flex flex-col px-4">

    <PageHeader title="Definições" subtitle="de perfil"/>

      {/* Form Content */}
      <div className="flex-1 space-y-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Telemóvel
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1 px-4 py-3 rounded-md bg-gray-100 text-gray-800 font-medium">
              {phoneNumber}
            </div>
            <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
              Alterar
            </button>
          </div>
        </div>

        {/* Send SMS Button */}
        <button
          onClick={handleSendSMS}
          className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Enviar SMS</span>
        </button>

        {/* SMS Code */}
        <Input
          label="Código"
          placeholder="Digite código do SMS"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
          className="bg-gray-50"
        />

        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Nome
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1 px-4 py-3 rounded-md bg-gray-100 text-gray-800 font-medium">
              {name}
            </div>
            <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
              Alterar
            </button>
          </div>
        </div>

        {/* Municipal Chamber */}
        <SelectField
          label="Câmara Municipal"
          options={municipalOptions}
          value={municipalChamber}
          onChange={setMunicipalChamber}
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-8">
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 shadow-md shadow-blue-700 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}