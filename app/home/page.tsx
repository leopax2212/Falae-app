"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/bottom-navigation"

type ScheduledEvent = {
  id: number
  type: string
  date: string
  time: string
  location: string
} | null

export default function HomePage() {
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)

  const [scheduledEvent, setScheduledEvent] = useState<ScheduledEvent>({
    id: 1,
    type: "Jantar",
    date: "quarta-feira, 22 de outubro",
    time: "20:00",
    location: "Blumenau (centro)",
  })

  const handleCancel = () => {
    setScheduledEvent(null)
    setShowCancelModal(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <h1 className="text-5xl font-bold mb-8">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-12">Olá Helo 👋</h2>

        {scheduledEvent ? (
          <div className="w-full max-w-sm space-y-6">
            <div className="border-2 border-gray-900 rounded-2xl overflow-hidden">
              <div className="bg-white px-4 py-3 text-center border-b-2 border-gray-900">
                <h3 className="font-bold text-gray-900 text-sm">ENCONTRO MARCADO</h3>
              </div>

              <div className="bg-white p-4 flex items-start gap-4">
                <div className="w-16 h-16 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-white text-3xl">🍽️</div>
                </div>

                <div className="flex-1 pt-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{scheduledEvent.type}</h4>
                  <p className="text-sm text-gray-700">{scheduledEvent.date}</p>
                  <p className="text-sm text-gray-700 font-semibold mt-2">{scheduledEvent.time}</p>
                  <p className="text-sm text-gray-700">{scheduledEvent.location}</p>
                </div>
              </div>

              <div className="flex border-t-2 border-gray-900">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 bg-[#F5A623] text-gray-900 font-bold py-3 text-sm border-r border-gray-900 hover:bg-[#e69515] transition-colors"
                >
                  CANCELAR
                </button>
                <button className="flex-1 bg-[#4A90E2] text-white font-bold py-3 text-sm hover:bg-[#3a7bc8] transition-colors">
                  CONFIRMAR
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push("/encontro")}
              className="w-full border-2 border-gray-900 rounded-full py-4 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              + ADD UM NOVO ENCONTRO
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <button
              onClick={() => router.push("/encontro")}
              className="w-full border-2 border-gray-900 rounded-full py-4 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              + ADD UM NOVO ENCONTRO
            </button>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-t-3xl p-8 w-full max-w-lg shadow-xl animate-slide-up">
            <h3 className="text-center font-semibold text-gray-900 mb-6 text-lg">
              Você tem certeza que quer cancelar o Encontro?
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleCancel}
                className="w-full border-2 border-gray-900 rounded-full py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancelar Evento
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full border-2 border-gray-900 rounded-full py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Manter Evento
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
