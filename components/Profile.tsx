"use client";

import Input from "@/components/Form/input";
import { FormWithCancelProps } from "./Header/forms/avaiability";


interface ProfileProps extends FormWithCancelProps {
  name: string;
  department: string;
}

export default function Profile({ onCancel, name, department }: ProfileProps) {
  return (
    <div>
      <h3 className="text-xl mb-8">
        <span className="font-normal text-gray-300 mr-1.5">O Seu</span>
        <span className="font-extrabold text-blue-500">Perfil</span>
      </h3>

      <form className="space-y-4">
        <Input
          type="text"
          name="user_name"
          label="NOME"
          value={name}
          disabled
        />

        <Input
          type="text"
          name="department_name"
          label="DEPARTAMENTO"
          value={department}
          disabled
        />

        <div className="w-full flex gap-5 text-white">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 py-4 w-full rounded-[10px] hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </form>
    </div>
  );
}
