"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConfirmacaoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-24">
        <button onClick={() => router.back()} className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-16">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 mb-6 flex items-center justify-center">
            <Calendar className="w-24 h-24 text-[#F5A623]" strokeWidth={1.5} />
            <div className="absolute mt-2">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="15" fill="#4CAF50" />
                <path
                  d="M12 20L18 26L28 14"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">Uhul... Tudo certo!</h2>
          <p className="text-base text-gray-700 mb-6">Aproveite seu jantar!</p>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 flex gap-3 max-w-sm">
            <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed">
              A gente entende imprevistos, mas se for cancelar avisa antes! Menos de um dia ou sumiço total =
              Penalidade.
            </p>
          </div>
        </div>

        <div className="mt-auto w-full max-w-sm">
          <Button
            onClick={() => router.push("/home")}
            className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
          >
            Ver meu evento
          </Button>
        </div>
      </div>
    </div>
  )
}
