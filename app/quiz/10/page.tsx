"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuizContext } from "@/contexts/quiz-context"

export default function Quiz10Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditingPreferences = searchParams.get("edit") === "true"
  const { quizData, updateQuizData, resetQuizData } = useQuizContext()

  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [mantra, setMantra] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (selectedPet && mantra) {
      setIsLoading(true)
      try {
        // Update quiz data with final answers
        updateQuizData({
          preferenciaAnimal: selectedPet === "dog" ? "Cachorro" : "Gato",
          fraseDefinicao: mantra,
        })

        // Prepare complete data for submission
        const completeData = {
          ...quizData,
          preferenciaAnimal: selectedPet === "dog" ? "Cachorro" : "Gato",
          fraseDefinicao: mantra,
          usuarioId: localStorage.getItem("usuarioId") || "", // Get user ID from localStorage after login
        }

        console.log("[v0] Submitting quiz data:", completeData)

        // Send to BFF
        const response = await fetch("http://localhost:8081/bff/preferencias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(completeData),
        })

        if (!response.ok) {
          throw new Error("Falha ao enviar preferências")
        }

        console.log("[v0] Quiz data submitted successfully")

        // Reset quiz data and redirect
        resetQuizData()

        if (isEditingPreferences) {
          router.push("/perfil")
        } else {
          router.push("/home")
        }
      } catch (error) {
        console.error("[v0] Error submitting quiz:", error)
        alert("Erro ao salvar suas preferências. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
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
            <h2 className="text-center text-lg font-bold">14.Gosta mais de:</h2>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setSelectedPet("dog")}
                className={`flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-black transition-colors ${
                  selectedPet === "dog" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="text-6xl">🐕</div>
              </button>

              <span className="text-xl font-bold">OU</span>

              <button
                onClick={() => setSelectedPet("cat")}
                className={`flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-black transition-colors ${
                  selectedPet === "cat" ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="text-6xl">🐱</div>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">15.Uma frase que defina você ou que seja seu mantra:</h2>

            <div className="relative">
              <textarea
                value={mantra}
                onChange={(e) => setMantra(e.target.value)}
                className="h-32 w-full resize-none rounded-[3rem] border-2 border-dashed border-black px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button onClick={handleSubmit} disabled={isLoading}>
              <GradientButton>{isLoading ? "Enviando..." : "Enviar"}</GradientButton>
            </button>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/9" onNext={handleSubmit} />
    </div>
  )
}
