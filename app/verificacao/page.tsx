"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

export default function VerificacaoPage() {
  const [code, setCode] = useState(["", "", "", "", ""])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      if (value && index < 4) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-16 w-full max-w-md space-y-12">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold leading-tight">
              Acabamos de enviar um código
              <br />
              para o seu email
            </h1>
            <p className="text-sm leading-relaxed">
              Insira no campo abaixo o código de verificação de 5 dígitos
              <br />
              enviado para o seu email.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="h-16 w-16 rounded-2xl border-2 border-black text-center text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button className="text-sm font-medium hover:underline">Reenviar código</button>
          </div>

          <div className="flex justify-center">
            <GradientButton>Enviar</GradientButton>
          </div>

          <p className="text-center text-xs leading-relaxed text-gray-600">
            Dica: Caso não encontre o e-mail na sua caixa de entrada,verifique a
            <br />
            pasta de Spam!
          </p>
        </div>
      </div>

      <Navigation backHref="/esqueceu-senha" nextHref="/quiz/1" />
    </div>
  )
}
