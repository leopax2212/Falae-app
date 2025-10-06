"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

export default function QuizWelcomePage() {
  const [userName, setUserName] = useState("Heloisa")

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Logo />

        <div className="mt-16 w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">
            Bem Vinda <span className="font-bold">{userName}!</span>
          </h1>

          <p className="text-left text-base leading-relaxed">
            Disponibilizamos um questionário divertido com 15 perguntas de assuntos diversos. Com base nas suas
            respostas o Falaê, fara uma triagem com mais 4 pessoas com gostos similares ao seu, para um date divertido
            com muita conversa boa, em um restaurante parceiro com ambiente acolhedor e com excelente experiência
            gastronômica.
          </p>

          <div className="flex justify-center pt-8">
            <GradientButton href="/quiz/1">Vamos lá...</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/login" nextHref="/quiz/1" />
    </div>
  )
}
