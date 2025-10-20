"use client"

import { ChevronLeft, UserPlus, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConvitePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-24">
        <button onClick={() => window.history.back()} className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-16">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
            <UserPlus className="w-12 h-12 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center max-w-xs mb-8 leading-relaxed">
            Convide 1 amigo para criar uma conta e participar. Depois que ele entrar no Falae, vocês estarão conectados!
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Button
            variant="outline"
            className="w-full rounded-full border-2 border-gray-800 text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 bg-transparent"
          >
            <UserPlus className="w-5 h-5" />
            Enviar convite
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full border-2 border-gray-800 text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 bg-transparent"
          >
            <LinkIcon className="w-5 h-5" />
            Copiar Link
          </Button>
        </div>

        <div className="mt-auto w-full max-w-sm">
          <Button
            onClick={() => window.history.back()}
            className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
