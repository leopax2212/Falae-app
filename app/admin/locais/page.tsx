"use client"

import { Logo } from "@/components/logo"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { Search, Plus, ChevronLeft } from "lucide-react"

interface Local {
  id?: string
  nome: string
  endereco: string
  capacidade: number
  ativo: boolean
  imagemUrl: string
}

export default function LocaisPage() {
  const [locais, setLocais] = useState<Local[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadData() {
      const resp = await fetch("http://localhost:8081/bff/locais")
      const data = await resp.json()
      setLocais(data)
    }
    loadData()
  }, [])

  const filteredLocais = useMemo(() => {
    return locais.filter((l) =>
      l.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, locais])

  return (
    <div className="flex min-h-screen flex-col bg-white pb-8">
      <div className="flex flex-col items-center px-6 py-8">
        <Logo />
        <h1 className="mt-6 mb-8 text-2xl font-semibold">LOCAIS / RESTAURANTES</h1>

        <div className="w-full max-w-md">

          {/* CAMPO DE BUSCA + BOTÃO DE ADICIONAR */}
          <div className="mb-6 flex items-center gap-3 rounded-full border-2 border-black px-4 py-2">
            <Search className="h-5 w-5 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar restaurante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
            <Link href="/admin/locais/novo">
              <Plus className="h-6 w-6 text-black hover:text-gray-700 cursor-pointer" />
            </Link>
          </div>

          {/* LISTA */}
          <div className="space-y-4">
            {filteredLocais.map((local) => (
              <button
                key={local.id}
                className="w-full rounded-full border-2 border-black bg-white px-6 py-4 font-semibold hover:bg-gray-50"
              >
                {local.nome}
              </button>
            ))}
          </div>

          <Link href="/admin">
            <button className="mt-10 text-gray-700 hover:text-black">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
