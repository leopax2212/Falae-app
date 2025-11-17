"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut } from 'lucide-react'
import { GradientButton } from "@/components/gradient-button";
import BottomNavigation from "@/components/bottom-navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [userData, setUserData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "",
    telefone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) return;

    async function loadUser() {
      try {
        const res = await fetch(
          `http://localhost:8081/bff/usuarios/${usuarioId}`
        );
        if (res.ok) {
          const data = await res.json();
          setUserData({
            nome: data.nome,
            sobrenome: "",
            email: data.email,
            cpf: data.cpf,
            telefone: data.telefone,
          });
          localStorage.setItem("userName", data.nome);
        }

        const prefRes = await fetch(
          `http://localhost:8081/bff/preferencias/usuario/${usuarioId}`
        );
        if (prefRes.ok) {
          const pref = await prefRes.json();

          if (pref?.id) {
            localStorage.setItem("preferenciaId", pref.id);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }

    loadUser();
  }, []);

  const handleEditPreferences = () => {
    router.push("/quiz/1?edit=true");
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Por favor, preencha todos os campos");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("A nova senha e confirmação não coincidem");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const usuarioId = localStorage.getItem("usuarioId");

      const response = await fetch("/api/usuarios/senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId,
          senhaAtual: passwordForm.currentPassword,
          novaSenha: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setPasswordError(error.message || "Erro ao alterar senha");
        return;
      }

      setSuccessMessage("Senha alterada com sucesso!");
      setShowSuccessMessage(true);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      setPasswordError("Erro ao conectar com o servidor");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 px-6 pt-8 max-w-2xl mx-auto w-full">
        <button onClick={() => router.back()} className="mb-8">
        </button>

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl font-bold mb-8">
            <span className="text-[#4A90E2]">Fala</span>
            <span className="text-[#F5A623]">ê!</span>
          </h1>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Modifique seus dados
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome:
            </label>
            <input
              type="text"
              value={userData.nome}
              disabled
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              E-mail:
            </label>
            <input
              type="email"
              value={userData.email}
              disabled
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              CPF:
            </label>
            <input
              type="text"
              value={userData.cpf}
              disabled
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleEditPreferences}
            className="w-full border-2 border-gray-900 rounded-full py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            EDITAR PREFERÊNCIAS
          </button>

          <button
          onClick={handleLogout}
          className="mt-8 flex items-center justify-center gap-2 text-red-500 hover:text-red-700 font-semibold w-full"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="fixed top-4 left-4 right-4 bg-green-100 border-2 border-green-500 rounded-lg p-4 text-green-800 font-semibold text-center">
          {successMessage}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
