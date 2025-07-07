"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Select from "@/components/Form/select";
import { registerUser } from "@/app/registar/actions";

interface License {
  id: string;
  name: string;
  // outros campos, se houver
}

interface Props {
  licenses: License[];
}

export default function SelectLicensePage({ licenses }: Props) {
  const params = useSearchParams();
  const email = params.get("email");
  const name = params.get("name");
  const password = params.get("password");

  const [license, setLicense] = useState("");

  const licenseOptions = licenses.map((license) => ({
    value: license.id,
    label: license.name,
  }));

  console.log("SEL", license);

  return (
    <main className="flex flex-col p-10 md:flex-row w-full min-h-screen">
      <div className="flex w-full md:w-1/2 h-full justify-center items-center">
        <div className="flex flex-col gap-[76px]">
          <div className="w-full mx-auto">
            <img className="mx-auto" src={"/sigmava_logo.png"} />
          </div>
          <div className="w-[300px]">
            <img className="w-full" src={"/ilus_1.png"} />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center md:-mt-10 md:px-10">
        <span>Só mais um passo</span>
        <h1 className="text-[32px] max-w-[293px] text-center font-medium mb-8">
          <span className="text-gray-400 font-light">Selecione a sua</span>
          <span className=" text-blue-600 font-bold"> Câmara Municipal</span>
        </h1>

        <form
          action={registerUser}
          className="w-full flex flex-col gap-4 items-center"
        >
          <input type="hidden" name="email" value={email ?? ""} />
          <input type="hidden" name="name" value={name ?? ""} />
          <input type="hidden" name="password" value={password ?? ""} />
          <Select
            className="w-full text-black"
            value={license}
            onChange={setLicense}
            label="Câmara"
            options={licenseOptions}
            name="license"
          />
          <button className="w-full max-w-[275px] bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-md p-3 mt-4 shadow shadow-blue-400">
            Finalizar Registo
          </button>
        </form>
      </div>
    </main>
  );
}
