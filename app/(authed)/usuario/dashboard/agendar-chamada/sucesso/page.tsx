"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();
  const handleContinue = () => {
    router.push("/usuario/dashboard")
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-col w-full items-start px-8 py-16">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-7">
          <Check className="h-10 w-10 text-green-600" />
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-blue-600 mb-2">
            O seu pedido foi efectuado com sucesso,{" "}
            <span className="text-gray-500 text-[32px]">
              irá receber brevemente uma notificação de confirmação.
            </span>
          </h1>
        </div>

        {/* Logo/Icon */}
        <div className="w-full">
          <div className="w-16 h-12 flex items-start justify-center relative">
            {/* Camera icon placeholder - replace with actual icon_logo.png */}
            <img src={"/icon_logo.png"}/>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6">
        <button
          onClick={handleContinue}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
        >
          Continuar
        </button>
      </div>

      
    </div>
  );
}