"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuizContext } from "@/contexts/quiz-context"

export default function Quiz11Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditingPreferences = searchParams.get("edit") === "true"

  const { quizData, updateQuizData, resetQuizData } = useQuizContext()

  const [selectedPet, setSelectedPet] = useState<string | null>(null)
  const [mantra, setMantra] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!selectedPet || !mantra.trim()) {
      setError("Por favor, preencha todos os campos")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Atualiza os dados no contexto
      const updatedData = {
        preferenciaAnimal: selectedPet === "dog" ? "Cachorro" : "Gato",
        fraseDefinicao: mantra,
        usuarioId: localStorage.getItem("usuarioId") || "",
      }

      updateQuizData(updatedData)

      // Junta tudo do contexto + o que foi atualizado
      const completeData = {
        ...quizData,
        ...updatedData,
      }

      // Faz o POST direto pro BFF (sem route.ts!)
      const response = await fetch("http://localhost:8081/bff/preferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro do BFF:", errorText)
        throw new Error("Falha ao enviar preferências")
      }

      const result = await response.json()
      console.log("Preferências salvas com sucesso:", result)

      // Reseta e redireciona
      resetQuizData()
      const redirectPath = isEditingPreferences ? "/perfil" : "/home"
      router.push(redirectPath)
    } catch (err) {
      console.error("Erro geral:", err)
      setError("Erro ao salvar suas preferências. Tente novamente.")
    } finally {
      setIsLoading(false)
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
            <h2 className="text-center text-lg font-bold">16. Gosta mais de:</h2>

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
            <h2 className="text-center text-lg font-bold">17. Uma frase que defina você ou que seja seu mantra:</h2>

            <div className="relative">
              <textarea
                value={mantra}
                onChange={(e) => setMantra(e.target.value)}
                className="h-32 w-full resize-none rounded-[3rem] border-2 border-dashed border-black px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite aqui sua frase ou mantra pessoal..."
              />
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">{error}</div>}

          <div className="flex justify-center pt-4">
            <GradientButton
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando...
                </>
              ) : (
                "Enviar"
              )}
            </GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/10" />
    </div>
  )
}
