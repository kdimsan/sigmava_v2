import { createDepartment } from "@/app/(authed)/admin/dashboard/actions/departments";
import Input from "@/components/Form/input";
import React, { useState } from "react";
import { FormWithCancelProps } from "./avaiability";
import toast from "react-hot-toast";

export default function Department({ onCancel }: FormWithCancelProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createDepartment(formData);
      toast.success("Departamendo criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar departamento.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl mb-8">
        <span className="font-normal text-gray-300 mr-1.5">Criar</span>
        <span className="font-extrabold text-blue-500">Departamento</span>
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input type="text" name="department_name" label="NOME" required />

        <div className="w-full flex gap-5 text-white">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 py-4 w-full rounded-[10px] hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            type="submit"
            className={`bg-blue-500 shadow py-4 w-full rounded-[10px] hover:bg-blue-600 transition-colors ${
              loading ? "disabled:cursor-none" : ""
            }`}
          >
            {loading ? "A enviar..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
