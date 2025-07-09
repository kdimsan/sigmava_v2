"use client";

import React, { useState } from "react";
import Input from "@/components/Form/input";
import Select from "@/components/Form/select";
import { createUsers } from "@/app/(authed)/admin/dashboard/actions/users";
import { FormWithCancelProps } from "./avaiability";
import toast from "react-hot-toast";

interface Department {
  id: number;
  name: string;
}

interface CreateUserFormProps extends FormWithCancelProps {
  departments: Department[];
}

export default function CreateUserForm({
  departments,
  onCancel,
}: CreateUserFormProps) {
  const [userType, setUserType] = useState("");
  const [dep, setDep] = useState("");
  const [loading, setLoading] = useState(false);

  const departmentOptions = departments.map((d) => ({
    label: d.name,
    value: String(d.id),
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("user_type", userType);
    formData.set("department", dep);

    try {
      await createUsers(formData);
      toast.success("Utilizador criado com sucesso!");
      setUserType("");
      setDep("");
    } catch (error) {
      toast.error("Erro ao criar utilizador. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input type="text" label="NOME" name="name" />
      <Select
        value={userType}
        onChange={setUserType}
        label="TIPO DE UTILIZADOR"
        options={[
          { label: "Administrador", value: "admin" },
          { label: "Trabalhador", value: "employee" },
        ]}
      />
      <Input type="password" label="PASSWORD" name="password" />
      <Select
        value={dep}
        onChange={setDep}
        label="DEPARTAMENTO"
        options={departmentOptions}
        name="department"
      />
      <div className="w-full flex gap-5 text-white">
        <button
          onClick={onCancel}
          type="button"
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
  );
}
