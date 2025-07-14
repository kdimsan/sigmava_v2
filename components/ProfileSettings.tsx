"use client";

import { MessageSquare } from "lucide-react";
import Input from "./Form/input";
import SelectField from "./Form/select";
import PageHeader from "./ui/PageHeader";
import { updateUser } from "@/app/(authed)/usuario/dashboard/actions/updateUser";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { logout } from "@/app/logout/actions";

interface UserProps {
  user_id: string;
  client_id: number;
  license_id: number;
  email: string;
  name: string;
}

interface LicensesProps {
  id: number;
  name: string;
}

interface ProfileProps {
  licenses: LicensesProps[];
  user: UserProps;
}

export default function ProfileSettings({ user, licenses }: ProfileProps) {
  const searchParams = useSearchParams();

  const [selectedLicense, setSelectedLicense] = useState<string>(
    String(user.license_id)
  );

  const licenseOptions = licenses.map((license) => ({
    label: license.name,
    value: String(license.id),
  }));

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Dados atualizados com sucesso!");
    }
  }, [searchParams]);

  return (
    <form className="min-h-screen flex flex-col px-4" action={updateUser}>
      <PageHeader title="Definições" subtitle="de perfil" />

      <div className="flex-1 space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Email
          </label>
          <input
            type="text"
            name="email"
            defaultValue={user.email}
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Enviar Email */}
        <button
          type="button"
          className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Enviar Email</span>
        </button>

        {/* Código (opcional, apenas exemplo) */}
        <Input
          label="Código"
          placeholder="Digite código do Email"
          name="email_code"
          className="bg-gray-50"
        />

        {/* Nome */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Nome
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Licença */}
        <SelectField
          label="Licença"
          name="license"
          options={licenseOptions}
          value={selectedLicense}
          onChange={setSelectedLicense}
          className="mb-8"
        />

        <input type="hidden" name="user_id" value={user.user_id} />

        {/* Botões */}
        <div className="flex space-x-4 pt-8">
          <button
            type="reset"
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 shadow-md shadow-blue-700 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
        <div className="w-full flex">
          <button
            className="flex-1 px-6 py-3 bg-blue-600 shadow-md shadow-blue-700 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </div>
    </form>
  );
}
