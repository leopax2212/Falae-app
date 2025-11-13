"use client"

import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuizContext } from "@/contexts/quiz-context"

const languageOptions = ["Português", "Espanhol", "Inglês"]
const investmentOptions = ["$", "$$", "$$$"]

export default function Quiz10Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditingPreferences = searchParams.get("edit") === "true"
  const { quizData, updateQuizData, resetQuizData } = useQuizContext()

  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined)
  const [selectedInvestment, setSelectedInvestment] = useState<string | undefined>(undefined)

  const handleNext = () => {
    updateQuizData({
      idiomaPreferido: selectedLanguage || "",
      investimentoEncontro: selectedInvestment || "",
    })
    router.push("/quiz/11")
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-12">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Comunicação & Estilo.</p>
            <h1 className="text-xl font-bold">14. Em qual idioma você prefere se comunicar?</h1>
          </div>

          <div className="space-y-4">
            {languageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedLanguage(option)}
                className={`w-full rounded-full border-2 border-black px-8 py-4 text-lg italic transition-colors ${
                  selectedLanguage === option ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">15. Quanto você investe em um bom encontro?</h2>

            <div className="flex justify-center gap-6">
              {investmentOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedInvestment(option)}
                  className={`rounded-full border-2 border-black px-8 py-4 text-xl font-bold transition-colors ${
                    selectedInvestment === option ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/9" nextHref="/quiz/11" onNext={handleNext} />
    </div>
  )
}
