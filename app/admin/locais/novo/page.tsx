"use client"

import { useState } from "react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function NovoLocalPage() {
  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    capacidade: 0,
    ativo: true,
    imagemUrl: ""
  })

  async function handleSubmit(e: any) {
    e.preventDefault()

    await fetch("http://localhost:8081/bff/locais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    alert("Local cadastrado com sucesso!")
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 py-10">
      <Logo />
      <h1 className="mt-6 mb-10 text-2xl font-semibold">CADASTRAR LOCAL</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">

        <input
          type="text"
          placeholder="Nome do restaurante"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full rounded-full border-2 border-black px-6 py-3"
        />

        <input
          type="text"
          placeholder="Endereço"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          className="w-full rounded-full border-2 border-black px-6 py-3"
        />

        <input
          type="number"
          placeholder="Capacidade"
          value={formData.capacidade}
          onChange={(e) => setFormData({ ...formData, capacidade: Number(e.target.value) })}
          className="w-full rounded-full border-2 border-black px-6 py-3"
        />

        <input
          type="text"
          placeholder="URL da imagem"
          value={formData.imagemUrl}
          onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
          className="w-full rounded-full border-2 border-black px-6 py-3"
        />

        <button
          type="submit"
          className="w-full mt-6 rounded-full border-2 border-black bg-black text-white px-6 py-3 font-semibold hover:opacity-80"
        >
          SALVAR
        </button>

        <Link href="/admin/locais">
          <button className="mt-8 text-gray-700 hover:text-black">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </Link>

      </form>
    </div>
  )
}
