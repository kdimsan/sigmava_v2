'use client';

import { logout } from "@/app/logout/actions";
import Logout from "@/assets/svgs/logout";
import { Power } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  // Fecha o modal se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  // Fecha modal com ESC
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showModal]);

  return (
    <>
      {/* Overlay de fundo com blur */}
      {showModal && (
        <div className="fixed inset-0 mr-0 bg-black/30 backdrop-blur-sm z-40" />
      )}
      
      <div ref={containerRef} className="relative inline-block">
        <button
          onClick={() => setShowModal((prev) => !prev)}
          className={`p-[22px] bg-blue-200 border hover:border hover:border-blue-500 rounded-md transition-colors relative  ${showModal ? `border-blue-500 z-50`: "border-transparent"}`}
        >
          <Logout />
        </button>

        {showModal && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl p-6 z-50 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
              Tem a certeza que pretende sair da Sigma VA?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}