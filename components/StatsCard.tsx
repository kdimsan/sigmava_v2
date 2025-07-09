"use client";

import CallGreen from "@/assets/svgs/callGreen";
import Dismiss from "@/assets/svgs/dismiss";
import Link from "next/link";

interface StatsCardProps {
  title: number;
  subtitle: string;
  value: number;
  color: "call" | "dismiss";
  showViewAll?: boolean;
}

export default function StatsCard({
  title,
  subtitle,
  value,
  color,
  showViewAll = true,
}: StatsCardProps) {
  const colorClasses = {
    call: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: "bg-blue-500",
    },
    dismiss: {
      bg: "bg-red-50",
      text: "text-red-600",
      icon: "bg-red-500",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="rounded-lg mt-3">
      <div className="text-center">
        <div className="bg-gray-100 rounded-t-md py-4 border-b border-gray-200">
          <span className="text-[44px] font-normal text-blue-500">{title}</span>
        </div>

        <div className="mb-4 bg-white rounded-b-md">
          <div className="text-center py-5">
          <div className="mx-auto w-fit mb-2">{color === "call" ? <div className="bg-green-500 p-2.5 rounded-full"><CallGreen /></div> : <Dismiss />}</div>
            <div className={`text-sm font-medium text-gray-300 mb-1`}>
              Video Atendimentos
            </div>
            <div className={`text-xl font-bold ${classes.text}`}>
              {color === "call" ? "Efectuados" : "Cancelados"}
            </div>

            {showViewAll && (
              <Link
              href={color === "call" ? `/admin/dashboard/total_efetuados` : `/admin/dashboard/total_cancelados`}
                className={`text-sm ${classes.text} hover:underline m-4 font-medium transition-all`}
              >
                Ver todos ›
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
