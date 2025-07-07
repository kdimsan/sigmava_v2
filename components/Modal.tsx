"use client";

import { createLicense } from "@/app/(authed)/superuser/dashboard/actions/licenses";
import { Key, Users } from "lucide-react";
import React, { useState } from "react";

export default function Modal({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"licenses" | "admins">("licenses");

  return (
    <div className="fixed inset-0 bg-black/80 transition-all flex items-center justify-center p-4 z-50">
      <form
        action={createLicense}
        className="bg-white rounded-lg max-w-4xl w-full p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Licença</h3>

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

        <div
          className={`${activeTab === "licenses" ? "" : "hidden"} space-y-4`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo *
            </label>
            <input
              type="file"
              name="logo"
              id="logo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Câmara Municipal de..."
              />
            </div>
            <div className="max-w-56">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Abreviatura
              </label>
              <input
                type="text"
                name="abey"
                id="abey"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contacto
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIF *
              </label>
              <input
                type="text"
                name="contributing_number"
                id="contributing_number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex w-full gap-3">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Morada
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="max-w-56">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                name="zip"
                id="zip"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Saga Web
              </label>
              <input
                type="text"
                name="saga"
                id="saga"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilizadores disponíveis
              </label>
              <input
                type="number"
                name="available_users"
                id="available_users"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className={`${activeTab === "admins" ? "" : "hidden"} space-y-4`}>
          <div className="flex gap-2 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Administrador *
              </label>
              <input
                type="text"
                name="admin_name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Jose Carlos"
              />
            </div>
            <div className="max-w-56">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Administrador *
              </label>
              <input
                type="email"
                name="admin_email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: j.carlos"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Administrador *
              </label>
              <input
                type="password"
                name="admin_password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirme Password *
              </label>
              <input
                type="password"
                name="admin_confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Criar Licença
          </button>
        </div>
      </form>
    </div>
  );
}
