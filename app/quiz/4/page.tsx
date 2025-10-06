"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

export default function Quiz4Page() {
  const [viajar, setViajar] = useState<string | null>(null)
  const [local, setLocal] = useState<string | null>(null)
  const [ambiente, setAmbiente] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-12">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-center text-xl font-bold">4.Você gosta de viajar?</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setViajar("sim")}
                  className={`rounded-full border-2 border-black px-12 py-3 text-lg transition-colors ${
                    viajar === "sim" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Sim
                </button>
                <button
                  onClick={() => setViajar("nao")}
                  className={`rounded-full border-2 border-black px-12 py-3 text-lg transition-colors ${
                    viajar === "nao" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-center text-xl font-bold">5.Você Prefere:</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setLocal("cidade")}
                  className={`rounded-full border-2 border-black px-12 py-3 text-lg transition-colors ${
                    local === "cidade" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Cidade
                </button>
                <button
                  onClick={() => setLocal("campo")}
                  className={`rounded-full border-2 border-black px-12 py-3 text-lg transition-colors ${
                    local === "campo" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Campo
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-center text-xl font-bold">6.Você Prefere:</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setAmbiente("praia")}
                  className={`rounded-full border-2 border-black px-12 py-3 text-lg transition-colors ${
                    ambiente === "praia" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Praia
                </button>
                <button
                  onClick={() => setAmbiente("montanha")}
                  className={`rounded-full border-2 border-black px-12 py-3 text-lg transition-colors ${
                    ambiente === "montanha" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  Montanha
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <GradientButton>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/3" nextHref="/quiz/5" />
    </div>
  )
}
