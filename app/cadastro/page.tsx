"use client"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

export default function CadastroPage() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Crie sua conta!</h1>
            <p className="mt-2 text-base">Seja Bem Vindo!</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome:</label>
              <input
                type="text"
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Sobrenome:</label>
              <input
                type="text"
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">E-mail:</label>
              <input
                type="email"
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">CPF:</label>
              <input
                type="text"
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Telefone:</label>
              <input
                type="tel"
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Senha:</label>
                <input
                  type="password"
                  className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirmar Senha:</label>
                <input
                  type="password"
                  className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="terms" className="text-sm">
                Concordo com os termos e políticas.
              </label>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <GradientButton>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/login" />
    </div>
  )
}
