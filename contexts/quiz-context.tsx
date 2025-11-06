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
  gostosPessoaisJson: string
}

interface QuizContextType {
  quizData: Partial<QuizData>
  updateQuizData: (data: Partial<QuizData>) => void
  resetQuizData: () => void
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
      gostosPessoaisJson: "",
    })
  }

  return <QuizContext.Provider value={{ quizData, updateQuizData, resetQuizData }}>{children}</QuizContext.Provider>
}

export function useQuizContext() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuizContext deve ser usado dentro de QuizProvider")
  }
  return context
}
