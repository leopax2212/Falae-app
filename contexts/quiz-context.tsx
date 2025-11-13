"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface QuizData {
  usuarioId: string
  horarioFavorito: string
  tipoComidaFavorito: string
  nivelEstresse: number
  gostaViajar: boolean
  preferenciaLocal: string
  preferenciaAmbiente: string
  importanciaEspiritualidade: number
  posicaoPolitica: string
  genero: string
  preferenciaMusical: string
  moodFilmesSeries: string
  statusRelacionamento: string
  temFilhos: boolean
  preferenciaAnimal: string
  fraseDefinicao: string
  idiomaPreferido: string
  investimentoEncontro: string
  gostosPessoaisJson: string
}

interface QuizContextType {
  quizData: Partial<QuizData>
  updateQuizData: (data: Partial<QuizData>) => void
  resetQuizData: () => void
  enviarQuiz: () => Promise<void>
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizData, setQuizData] = useState<Partial<QuizData>>({
    usuarioId: "",
    horarioFavorito: "",
    tipoComidaFavorito: "",
    nivelEstresse: 0,
    gostaViajar: false,
    preferenciaLocal: "",
    preferenciaAmbiente: "",
    importanciaEspiritualidade: 0,
    posicaoPolitica: "",
    genero: "",
    preferenciaMusical: "",
    moodFilmesSeries: "",
    statusRelacionamento: "",
    temFilhos: false,
    preferenciaAnimal: "",
    fraseDefinicao: "",
    idiomaPreferido: "",
    investimentoEncontro: "",
    gostosPessoaisJson: "",
  })

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData((prev) => ({ ...prev, ...data }))
  }

  const resetQuizData = () => {
    setQuizData({
      usuarioId: "",
      horarioFavorito: "",
      tipoComidaFavorito: "",
      nivelEstresse: 0,
      gostaViajar: false,
      preferenciaLocal: "",
      preferenciaAmbiente: "",
      importanciaEspiritualidade: 0,
      posicaoPolitica: "",
      genero: "",
      preferenciaMusical: "",
      moodFilmesSeries: "",
      statusRelacionamento: "",
      temFilhos: false,
      preferenciaAnimal: "",
      fraseDefinicao: "",
      idiomaPreferido: "",
      investimentoEncontro: "",
      gostosPessoaisJson: "",
    })
  }

  // 💥 NOVA FUNÇÃO — faz o POST direto pro BFF
  const enviarQuiz = async () => {
    try {
      const response = await fetch("http://localhost:8081/bff/preferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro ao enviar preferências:", errorText)
        alert("Erro ao enviar preferências. Verifique o console.")
        return
      }

      const result = await response.json()
      console.log("Preferências salvas com sucesso:", result)
      alert("Preferências enviadas com sucesso 🎉")
    } catch (error) {
      console.error("Erro de rede ou servidor:", error)
      alert("Erro ao enviar preferências. Verifique sua conexão.")
    }
  }

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData, resetQuizData, enviarQuiz }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuizContext() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuizContext deve ser usado dentro de QuizProvider")
  }
  return context
}
