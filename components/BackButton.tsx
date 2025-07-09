"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton({className}: {className?: string}) {
  const router = useRouter();
  return (
    <button
      className={`bg-blue-200 text-blue-500 font-medium rounded-md px-4 py-2 flex items-center ${className}`}
      onClick={() => router.back()}
    >
      <ChevronLeft /> Voltar
    </button>
  );
}
