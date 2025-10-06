"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

const options = ["Italiana", "Mexicana", "Chinesa", "Indiana"]

export default function Quiz2Page() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-12">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
            <h1 className="text-xl font-bold">2.Qual seu tipo de comida Favorito?</h1>
          </div>

          <div className="space-y-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-full rounded-full border-2 border-black px-8 py-4 text-lg italic transition-colors ${
                  selected === option ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <GradientButton>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/1" nextHref="/quiz/3" />
    </div>
  )
}
