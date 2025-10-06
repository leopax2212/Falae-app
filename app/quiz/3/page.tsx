"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

export default function Quiz3Page() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-12">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
            <h1 className="text-xl font-bold">3.Me considero uma pessoa estressada.</h1>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span>Discordo</span>
              <span>Concordo Plenamente</span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelected(num)}
                  className={`aspect-square rounded-2xl border-2 border-black text-2xl font-semibold transition-colors ${
                    selected === num ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelected(num)}
                  className={`aspect-square rounded-2xl border-2 border-black text-2xl font-semibold transition-colors ${
                    selected === num ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <GradientButton>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/2" nextHref="/quiz/4" />
    </div>
  )
}
