"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useQuizContext } from "@/contexts/quiz-context"
import { useRouter } from "next/navigation"

const musicOptions = [
  { label: "Rock", emoji: "🎸" },
  { label: "Pop", emoji: "🎤" },
  { label: "Eletrônica", emoji: "🎧" },
  { label: "Clássica", emoji: "🎻" },
  { label: "MPB", emoji: "🎵" },
  { label: "Jazz...", emoji: "🎺" },
]

const moodOptions = ["Maratonador(a)", "Só Clássicos", "Gosta de estréias", "Film Cult", "Séries Populares"]

export default function Quiz8Page() {
  const router = useRouter()
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const { updateQuizData } = useQuizContext()

  const handleNext = () => {
    if (selectedMusic && selectedMood) {
      updateQuizData({
        preferenciaMusical: selectedMusic,
        moodFilmesSeries: selectedMood,
      })
      router.push("/quiz/9")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-10">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">10.Conte-nos sobre sua preferência musical?</h2>

            <div className="grid grid-cols-3 gap-3">
              {musicOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedMusic(option.label)}
                  className={`flex items-center justify-center gap-1 rounded-full border-2 border-black px-4 py-3 text-sm transition-colors ${
                    selectedMusic === option.label ? "bg-gray-500 text-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">11.Qual seu Mood para filmes e séries?</h2>

            <div className="space-y-3">
              {moodOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedMood(option)}
                  className={`w-full rounded-full border-2 border-black px-8 py-3 text-base italic transition-colors ${
                    selectedMood === option ? "bg-gray-500 text-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button onClick={handleNext}>
              <GradientButton>Enviar</GradientButton>
            </button>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/7"/>
    </div>
  )
}
