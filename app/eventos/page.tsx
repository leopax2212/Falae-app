"use client"

import { useState } from "react"
import { ChevronLeft, Share2, Calendar, Users, Gamepad2, MessageSquare } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"

export default function EventosPage() {
  const [showManageModal, setShowManageModal] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20 relative">
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <button className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-8">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <div className="w-full max-w-sm mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Icrie</h3>
              <p className="text-sm text-gray-600">Quarta-feira, 22 de outubro</p>
              <p className="text-sm text-gray-600">20:00</p>
              <p className="text-sm text-gray-600">Blumenau / Centro</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              onClick={() => setShowManageModal(true)}
              variant="outline"
              className="flex-1 rounded-full border-2 border-gray-800 text-gray-800 text-sm"
            >
              Gerenciar Encontro
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-2 border-gray-800 text-gray-800 px-4 bg-transparent"
              onClick={() => (window.location.href = "/convite")}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Restaurante</h4>
                <p className="text-sm text-gray-600">Você saberá o local combinado pouco antes do evento.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Grupo</h4>
                <p className="text-sm text-gray-600">
                  Compartilharemos detalhes sobre seu grupo, momentos antes do evento.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Gamepad2 className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Jogo</h4>
                <p className="text-sm text-gray-600">Quebre o gelo com seu grupo.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Feedback</h4>
                <p className="text-sm text-gray-600">
                  Compartilhe o que achou do evento, conheça novas pessoas e torne sua próxima experiência ainda melhor!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-600 text-center">
              Todas as opções acima serão desbloqueadas 24hs antes do evento.
            </p>
          </div>
        </div>
      </div>

      {showManageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 px-6 pb-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Gerenciar Encontro</h3>
            <div className="space-y-3 mb-4">
              <button
                onClick={() => (window.location.href = "/add-calendario")}
                className="w-full flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Add no Calendário</span>
              </button>

              <button className="w-full flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Reagendar Encontro</span>
              </button>

              <button className="w-full flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Cancelar Encontro</span>
              </button>
            </div>
            <Button
              onClick={() => setShowManageModal(false)}
              className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
