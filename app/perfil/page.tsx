"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"

export default function PerfilPage() {
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [userData, setUserData] = useState({
    nome: "Helo",
    sobrenome: "Silva",
    email: "helo@example.com",
    cpf: "123.456.789-00",
    telefone: "(47) 99999-9999",
  })

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 px-6 pt-8">
        <button onClick={() => router.back()} className="mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl font-bold mb-8">
            <span className="text-[#4A90E2]">Fala</span>
            <span className="text-[#F5A623]">ê!</span>
          </h1>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">Modifique seus dados</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Nome:</label>
            <input
              type="text"
              value={userData.nome}
              onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Sobrenome:</label>
            <input
              type="text"
              value={userData.sobrenome}
              onChange={(e) => setUserData({ ...userData, sobrenome: e.target.value })}
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">E-mail:</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">CPF:</label>
            <input
              type="text"
              value={userData.cpf}
              onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Telefone:</label>
            <input
              type="tel"
              value={userData.telefone}
              onChange={(e) => setUserData({ ...userData, telefone: e.target.value })}
              className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/quiz/1?edit=true")}
            className="w-full border-2 border-gray-900 rounded-full py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            EDITAR PREFERÊNCIAS
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full border-2 border-gray-900 rounded-full py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            EDITAR SENHA
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white rounded-t-3xl p-8 w-full max-w-lg shadow-xl animate-slide-up">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 text-center">Senha atual</label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 text-center">Nova senha</label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 text-center">
                  Confirme a nova senha
                </label>
                <input
                  type="password"
                  className="w-full border-2 border-gray-900 rounded-full px-6 py-3 text-gray-900"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-[#4A90E2] to-[#A8D5BA] text-white font-bold py-4 rounded-full hover:opacity-90 transition-opacity mt-4">
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
