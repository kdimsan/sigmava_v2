import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { createClient } from "@/utils/supabase/client";
import {
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  XCircle,
} from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { deleteLicense } from "@/app/(authed)/superuser/dashboard/actions/licenses";

export interface License {
  id: string;
  name: string;
  description: string;
  disabled: boolean;
  created_at: string;
  expires_at: string;
  available_users: number;
  phone: string;
  address: string;
  zip: string;
  email: string;
  contributing_number: string;
  saga: string;
  abey: string;
}

export default function LicenseTable() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchLicenses = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("licenses").select("*");

    if (error) {
      console.error("Erro ao buscar licenças:", error);
      return;
    }

    setLicenses(data || []);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLicense(id);
      fetchLicenses();
    } catch (error) {
      console.error("Erro ao excluir licença:", error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const toggleLicenseStatus = async (id: string, currentDisabled: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("licenses")
      .update({ disabled: !currentDisabled })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar licença:", error);
      return;
    }

    fetchLicenses();
  };

  const handleEditClick = (license: License) => {
    setEditingLicense(license);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licença
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilizadores Disponíveis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {licenses.map((license) => (
                <tr key={license.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {license.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {license.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        license.disabled
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {license.disabled ? (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inativa
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativa
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {license.available_users}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          toggleLicenseStatus(license.id, license.disabled)
                        }
                        className={`p-2 rounded-md transition-colors ${
                          license.disabled
                            ? "text-green-600 hover:bg-green-50"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={license.disabled ? "Ativar" : "Desativar"}
                      >
                        {license.disabled ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditClick(license)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(license.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {confirmDeleteId && (
                        <ConfirmDialog
                          message="Tem certeza que deseja remover esta licença?"
                          onConfirm={() => handleDelete(confirmDeleteId)}
                          onCancel={() => setConfirmDeleteId(null)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingLicense && (
        <Modal
          onClose={() => {
            fetchLicenses();
            setEditingLicense(null)}}
          licenseToEdit={editingLicense}
          onUpdate={() => {
            fetchLicenses();
            setEditingLicense(null);
          }}
        />
      )}
    </>
  );
}
