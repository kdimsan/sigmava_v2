import { createDepartment } from "@/app/(authed)/home/actions/departments";
import Input from "@/components/Form/input";
import React from "react";

export default function Department() {
  return (
    <div>
      <h3 className="text-xl mb-8">
        <span className="font-normal text-gray-300 mr-1.5">Criar</span>
        <span className="font-extrabold text-blue-500">Departamento</span>
      </h3>
      <form className="space-y-4" action={createDepartment}>
        <Input type="text" name="department_name" label="NOME" required />

        <div className="w-full flex gap-5 text-white">
          <button
            type="button"
            className="bg-gray-200 py-4 w-full rounded-[10px] hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 shadow shadow-blue-500 py-4 w-full rounded-[10px] hover:bg-blue-600 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
