"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useQuizContext } from "@/contexts/quiz-context"
import { useRouter } from 'next/navigation'

const options = ["Manhã", "Tarde", "Noite", "Madrugada"]

export default function Quiz1Page() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const { updateQuizData } = useQuizContext()

  const handleNext = () => {
    if (selected) {
      updateQuizData({ horarioFavorito: selected })
      router.push("/quiz/2")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-12">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
            <h1 className="text-xl font-bold">1.Qual seu horário favorito do dia?</h1>
          </div>

          <div className="space-y-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-full rounded-full border-2 border-black px-8 py-4 text-lg italic transition-colors ${
                  selected === option ? "bg-gray-500 text-white" : "bg-white hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <GradientButton onClick={handleNext} disabled={!selected}>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/welcome" />
    </div>
  )
}
