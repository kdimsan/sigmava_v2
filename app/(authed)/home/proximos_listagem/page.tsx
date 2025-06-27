import AppointmentList from "@/components/AppointmentList";
import BackButton from "@/components/BackButton";
import React from "react";

const proximosAtendimentos = [
  {
    id: "93172",
    time: "14:15",
    name: "Rogério Ribeiro",
    subject: "Quebra de servidor e armazenamento",
    status: "scheduled" as const,
  },
  {
    id: "93171",
    time: "14:30",
    name: "Fátima Costa Martins",
    subject: "Arrendamento",
    status: "scheduled" as const,
  },
  {
    id: "93170",
    time: "14:45",
    name: "Rogério Ribeiro",
    subject: "Taxas Municipais",
    status: "scheduled" as const,
  },
  {
    id: "93169",
    time: "16:15",
    name: "Maria João Guilherme",
    subject: "Pagamento de água",
    status: "scheduled" as const,
  },
  {
    id: "93175",
    time: "16:45",
    name: "Baneka Ribeiro",
    subject: "Quebra de servidor e armazenamento",
    status: "scheduled" as const,
  },
  {
    id: "93174",
    time: "16:15",
    name: "Maria João Guilherme",
    subject: "Pagamento de água",
    status: "scheduled" as const,
  },
  {
    id: "931766",
    time: "16:45",
    name: "Baneka Ribeiro",
    subject: "Quebra de servidor e armazenamento",
    status: "scheduled" as const,
  },
  {
    id: "931722",
    time: "16:15",
    name: "Maria João Guilherme",
    subject: "Pagamento de água",
    status: "scheduled" as const,
  },
  {
    id: "931732",
    time: "16:45",
    name: "Baneka Ribeiro",
    subject: "Quebra de servidor e armazenamento",
    status: "scheduled" as const,
  },
];
export default function NextList() {
  return (
    <main className="max-w-10/12 mx-auto h-svh flex-1">
        <div className="flex gap-5">

      <div className="mt-1.5">
        <BackButton />
      </div>
      <div className="w-full">
        {/*listagem */}

          <AppointmentList
            title="Próximos"
            appointments={proximosAtendimentos}
            footerType="showMore"
          />

      </div>
        </div>
    </main>
  );
}
