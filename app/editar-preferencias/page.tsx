"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditarPreferenciasPage() {
  const router = useRouter()
  const [languages, setLanguages] = useState({
    portugues: true,
    espanhol: false,
    ingles: false,
  })
  const [budget, setBudget] = useState("$$")
  const [showDietaryModal, setShowDietaryModal] = useState(false)
  const [dietaryRestrictions, setDietaryRestrictions] = useState({
    vegetariano: false,
    glutenFree: false,
    vegano: false,
  })

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-24">
        <button onClick={() => router.back()} className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-8">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-base font-medium text-gray-800 mb-4">Em qual idioma você prefere se comunicar?</h2>
            <div className="space-y-3">
              {[
                { key: "portugues", label: "Português" },
                { key: "espanhol", label: "Espanhol" },
                { key: "ingles", label: "Inglês" },
              ].map((lang) => (
                <div
                  key={lang.key}
                  className="flex items-center justify-between border-2 border-gray-200 rounded-full px-6 py-3"
                >
                  <span className="text-sm text-gray-700">{lang.label}</span>
                  <Checkbox
                    checked={languages[lang.key as keyof typeof languages]}
                    onCheckedChange={(checked) => setLanguages((prev) => ({ ...prev, [lang.key]: checked }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-800 mb-4">Quanto você investe num bom encontro?</h2>
            <div className="space-y-3">
              {["$", "$$", "$$$"].map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between border-2 border-gray-200 rounded-full px-6 py-3"
                >
                  <span className="text-sm text-gray-700">{option}</span>
                  <Checkbox checked={budget === option} onCheckedChange={() => setBudget(option)} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setShowDietaryModal(true)} className="text-sm text-gray-600 flex items-center gap-2">
            Tenho restrições alimentares 🍕
          </button>

          <div className="pt-4">
            <Button
              onClick={() => router.push("/preferencias")}
              className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>

      {showDietaryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Tenho restrições alimentares.</h3>
            <div className="space-y-3 mb-6">
              {[
                { key: "vegetariano", label: "Vegetariano" },
                { key: "glutenFree", label: "Gluten-free" },
                { key: "vegano", label: "Vegano" },
              ].map((restriction) => (
                <div
                  key={restriction.key}
                  className="flex items-center justify-between border-2 border-gray-200 rounded-full px-6 py-3"
                >
                  <span className="text-sm text-gray-700">{restriction.label}</span>
                  <Checkbox
                    checked={dietaryRestrictions[restriction.key as keyof typeof dietaryRestrictions]}
                    onCheckedChange={(checked) =>
                      setDietaryRestrictions((prev) => ({ ...prev, [restriction.key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={() => setShowDietaryModal(false)}
              className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
