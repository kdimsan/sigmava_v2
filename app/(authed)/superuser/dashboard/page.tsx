"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import LicenseTable from "@/components/LicenseTable";
import Modal from "@/components/Modal";

export default function SuperUserPage() {
  const [showCreateLicense, setShowCreateLicense] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Carregando...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-11/12 mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Painel de Administração
          </h1>
          <p className="text-gray-600">
            Gerencie licenças e administradores do sistema
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar licenças..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
            <button
              onClick={() => setShowCreateLicense(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Licença</span>
            </button>
          </div>

          {/* Licenses Table */}
          <LicenseTable />
        </div>
      </main>

      {/* Create License Modal */}
      {showCreateLicense && (
        <Modal onClose={() => setShowCreateLicense(false)} />
      )}
    </div>
  );
}
