"use client";

import Link from "next/link";
import { House, CalendarDays, History, Cog, Plus } from "lucide-react";

export default function MobileHeader() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around items-center py-2 z-50">
      <Link
        href="/usuario/dashboard"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <House size={20} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/usuario/dashboard/proximas-chamadas"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <CalendarDays size={20} />
        <span className="text-xs">PRÓXIMOS</span>
      </Link>

      {/* FAB central */}
      <Link
        href={"/usuario/dashboard/agendar-chamada"}
        className="relative -mt-10 bg-blue-600 text-white rounded-full p-4 shadow-md shadow-black hover:bg-blue-700 transition"
      >
        <Plus size={24} />
      </Link>

      <Link
        href="/usuario/dashboard/historico"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <History size={20} />
        <span className="text-xs">HISTÓRICO</span>
      </Link>
      <Link
        href="/usuario/dashboard/definicoes"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <Cog size={20} />
        <span className="text-xs">DEFINIÇÕES</span>
      </Link>
    </nav>
  );
}
