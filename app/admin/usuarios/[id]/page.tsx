"use client"

import type React from "react"

import { Logo } from "@/components/logo"
import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Trash2, Shield } from "lucide-react"

interface Usuario {
  id: number
  name: string
  cpf: string
  email: string
  telefone: string
}

const MOCK_USUARIOS: Record<number, Usuario> = {
  1: { id: 1, name: "HELOISA MARGARIDA", cpf: "129.456.879-02", email: "heloisa@email.com", telefone: "47 996854434" },
  2: { id: 2, name: "CARINE CAVALHEIRO", cpf: "987.654.321-00", email: "carine@email.com", telefone: "47 998765432" },
}

export default function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((params as any).id)
  const usuario = MOCK_USUARIOS[id]

  const [formData, setFormData] = useState(usuario || {})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDelete = () => {
    alert("Usuário excluído com sucesso!")
    window.history.back()
  }

  const handleSave = () => {
    alert("Usuário salvo com sucesso!")
  }

  const handleMakeAdmin = () => {
    alert("Usuário promovido a administrador!")
  }

  if (!usuario) {
    return <div>Usuário não encontrado</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-col items-center px-6 py-8">
        <Logo />

        <h1 className="mt-6 mb-2 text-2xl font-semibold">ADMINISTRADOR</h1>
        <p className="mb-8 text-center text-sm text-gray-600">OBS:AQUI O ADM PODE EDITAR AS INFORMAÇÕES</p>

        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-center gap-2 rounded-full border-2 border-black px-6 py-3 text-lg font-semibold">
            <span>{formData.name}</span>
          </div>

          <input
            type="text"
            name="cpf"
            value={formData.cpf || ""}
            onChange={handleChange}
            placeholder="CPF"
            className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="EMAIL"
            className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="tel"
            name="telefone"
            value={formData.telefone || ""}
            onChange={handleChange}
            placeholder="TELEFONE"
            className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="space-y-2 pt-4">
            <button
              onClick={handleSave}
              className="w-full rounded-full border-2 border-black bg-white px-6 py-3 text-base font-semibold transition-colors hover:bg-gray-50"
            >
              SALVAR
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-red-500 bg-white px-6 py-3 text-base font-semibold text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                EXCLUIR
              </button>

              <button
                onClick={handleMakeAdmin}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-6 py-3 text-base font-semibold transition-colors hover:bg-gray-50"
              >
                <Shield className="h-4 w-4" />
                PROMOVER
              </button>
            </div>
          </div>
        </div>

        <Link href="/admin/usuarios">
          <button className="mt-8 text-gray-700 hover:text-black">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </Link>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-end bg-black/50 px-6 pb-8">
          <div className="w-full max-w-md rounded-3xl border-2 border-black bg-white p-6 space-y-4">
            <p className="text-center text-lg font-semibold">Tem certeza que quer excluir este usuário?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-full border-2 border-black bg-white px-4 py-3 font-semibold transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-full border-2 border-red-500 bg-red-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
