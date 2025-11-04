"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function EncontroPage() {
  const router = useRouter()

  const availableEvents = [
    { id: 1, day: "quarta-feira", date: "19 de novembro", time: "20:00" },
    { id: 2, day: "quinta-feira", date: "20 de novembro", time: "20:00" },
    { id: 3, day: "sexta-feira", date: "21 de novembro", time: "20:00" },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-8">
      <button onClick={() => router.back()} className="self-start mb-8">
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-12">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">Olá Helo 👋</h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Conheça Pessoas em Blumenau!</h3>

        <p className="text-lg font-medium text-gray-900 mb-8">Reserve seu próximo evento:</p>

        <div className="w-full max-w-sm space-y-4">
          {availableEvents.map((event) => (
            <button
              key={event.id}
              className="w-full border-2 border-gray-900 rounded-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="text-white text-2xl">🍽️</div>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 capitalize">
                  {event.day}, {event.date}
                </p>
                <p className="font-semibold text-gray-900">{event.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
