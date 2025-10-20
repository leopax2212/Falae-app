"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PreferenciasPage() {
  const router = useRouter()
  const [preferences] = useState({
    budget: "Moda Financeira! $$",
    dietary: "Cardápio da vida! Sem restrições",
    language: "Idioma! português",
  })

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-24">
        <button onClick={() => router.back()} className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-2">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <h2 className="text-lg font-semibold text-gray-800 mb-8">Preferências</h2>

        <div className="w-full max-w-sm space-y-4 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <p className="text-sm text-gray-700">{preferences.budget}</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <p className="text-sm text-gray-700">{preferences.dietary}</p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <p className="text-sm text-gray-700">{preferences.language}</p>
          </div>
        </div>

        <Button
          onClick={() => router.push("/editar-preferencias")}
          variant="outline"
          className="w-full max-w-sm mb-8 rounded-full border-2 border-gray-800 text-gray-800 hover:bg-gray-50"
        >
          Editar Minhas Preferências
        </Button>

        <div className="mt-auto w-full max-w-sm">
          <Button
            onClick={() => router.push("/confirmacao")}
            className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}
