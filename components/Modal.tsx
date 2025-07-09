"use client";

import {
  createLicense,
  updateLicense,
} from "@/app/(authed)/superuser/dashboard/actions/licenses";
import { Key, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Componente reutilizável de input com label e estilos padronizados
function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        {...(value !== undefined ? { value, onChange } : {})}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-200`}
      />
    </div>
  );
}

interface LicenseToEdit {
  contributing_number: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  zip: string;
  saga: string;
  available_users: number;
  abey: string;
}

export default function Modal({
  onClose,
  licenseToEdit,
  onUpdate,
}: {
  onClose: () => void;
  licenseToEdit?: LicenseToEdit;
  onUpdate?: () => void;  // novo
}) {
  const [activeTab, setActiveTab] = useState<"licenses" | "admins">("licenses");
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    zip: "",
    contributing_number: "",
    saga: "",
    available_users: 0,
    abey: ""
  });

  useEffect(() => {
    if (licenseToEdit) {
      setFormValues({
        name: licenseToEdit.name,
        phone: licenseToEdit.phone,
        email: licenseToEdit.email,
        address: licenseToEdit.address,
        zip: licenseToEdit.zip,
        contributing_number: licenseToEdit.contributing_number,
        available_users: licenseToEdit.available_users,
        saga: licenseToEdit.saga,
        abey: licenseToEdit.abey,
      });
    }
  }, [licenseToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (licenseToEdit) {
        await updateLicense(licenseToEdit.id, formValues);
        toast.success("Licença atualizada com sucesso!");
        onUpdate?.();
      } else {
        const formData = new FormData(e.currentTarget);
        await createLicense(formData);
        toast.success("Licença criada com sucesso!");
      }

      onClose();
    } catch (error) {
      toast.error("Erro ao salvar licença.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 transition-all flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg max-w-4xl w-full p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {licenseToEdit ? "Editar Licença" : "Nova Licença"}
        </h3>

        {!licenseToEdit && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("licenses")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "licenses"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>Licenças</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("admins")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "admins"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Administradores</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Aba Licenças */}
        <div
          className={`${
            activeTab === "licenses" || licenseToEdit ? "" : "hidden"
          } space-y-4`}
        >
          <FormField
            label="Logo *"
            name="logo"
            type="file"
            disabled={!!licenseToEdit}
          />

          <div className="flex gap-2 w-full">
            <FormField
              label="Nome *"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              required
              placeholder="Ex: Câmara Municipal de..."
            />
            <FormField
              label="Abreviatura"
              name="abey"
              onChange={handleChange}
              value={formValues.abey}
              disabled={!!licenseToEdit}
            />
          </div>

          <div className="flex gap-3">
            <FormField
              label="Contacto"
              name="phone"
              type="number"
              value={formValues.phone}
              onChange={handleChange}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
            />
            <FormField
              label="NIF *"
              name="contributing_number"
              disabled={!!licenseToEdit}
              value={formValues.contributing_number}
              onChange={handleChange}
            />
          </div>

          <div className="flex w-full gap-3">
            <FormField
              label="Morada"
              name="address"
              value={formValues.address}
              onChange={handleChange}
            />
            <FormField
              label="Código Postal"
              name="zip"
              value={formValues.zip}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-4 w-full">
            <FormField
              label="IP Saga Web"
              name="saga"
              disabled={!!licenseToEdit}
              value={formValues.saga}
              onChange={handleChange}
            />
            <FormField
              label="Utilizadores disponíveis"
              name="available_users"
              type="number"
              disabled={!!licenseToEdit}
              value={formValues.available_users}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Aba Admins */}
        {!licenseToEdit && (
          <div
            className={`${activeTab === "admins" ? "" : "hidden"} space-y-4`}
          >
            <div className="flex gap-2 w-full">
              <FormField
                label="Nome Administrador *"
                name="admin_name"
                placeholder="Ex: Jose Carlos"
              />
              <FormField
                label="Email Administrador *"
                name="admin_email"
                type="email"
                placeholder="Ex: j.carlos"
              />
            </div>

            <div className="flex gap-3">
              <FormField
                label="Password Administrador *"
                name="admin_password"
                type="password"
              />
              <FormField
                label="Confirme Password *"
                name="admin_confirm"
                type="password"
              />
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? licenseToEdit
                ? "Atualizando..."
                : "Criando..."
              : licenseToEdit
              ? "Atualizar"
              : "Criar Licença"}
          </button>
        </div>
      </form>
    </div>
  );
}
