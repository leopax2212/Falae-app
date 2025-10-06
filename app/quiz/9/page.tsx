"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

const relationshipOptions = ["Casado(a)", "Solteiro(a)", "Prefiro não dizer"]

export default function Quiz9Page() {
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null)
  const [hasChildren, setHasChildren] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-10">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">12.Qual seu status de relacionamento?</h2>

            <div className="space-y-3">
              {relationshipOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedRelationship(option)}
                  className={`w-full rounded-full border-2 border-black px-8 py-3 text-base italic transition-colors ${
                    selectedRelationship === option ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">13.Você tem Filhos?</h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setHasChildren("Sim")}
                className={`rounded-full border-2 border-black px-12 py-3 text-base transition-colors ${
                  hasChildren === "Sim" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                Sim
              </button>
              <button
                onClick={() => setHasChildren("Não")}
                className={`rounded-full border-2 border-black px-12 py-3 text-base transition-colors ${
                  hasChildren === "Não" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                Não
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <GradientButton>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/8" nextHref="/quiz/10" />
    </div>
  )
}
