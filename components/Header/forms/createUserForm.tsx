// components/Form/createUserForm.tsx
"use client";

import React, { useState } from "react";
import Input from "@/components/Form/input";
import Select from "@/components/Form/select";
import { createUsers } from "@/app/(authed)/admin/dashboard/actions/users";

interface Department {
  id: number;
  name: string;
}

export default function CreateUserForm({
  departments,
}: {
  departments: Department[];
}) {
  const [userType, setUserType] = useState("");
  const [dep, setDep] = useState("");

  console.log(departments);

  const departmentOptions = departments.map((d) => ({
    label: d.name,
    value: String(d.id),
  }));

  return (
    <form className="space-y-4" action={createUsers}>
      <Input type="text" label="NOME" name="name" />
      <Select
        value={userType}
        onChange={setUserType}
        label="TIPO DE UTILIZADOR"
        options={[
          { label: "Administrador", value: "admin" },
          { label: "Usuário", value: "user" },
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
        <button type="button" className="bg-gray-200 py-4 w-full rounded-[10px] hover:bg-gray-300 transition-colors">
          Cancelar
        </button>
        <button type="submit" className="bg-blue-500 shadow py-4 w-full rounded-[10px] hover:bg-blue-600 transition-colors">
          Guardar
        </button>
      </div>
    </form>
  );
}
