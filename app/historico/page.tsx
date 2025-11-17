"use client"

import { useRouter } from 'next/navigation'
import BottomNavigation from "@/components/bottom-navigation"

export default function HistoricoPage() {
  const router = useRouter()

  const pastEvents = [
    {
      id: 1,
      type: "Jantar",
      day: "quarta-feira",
      date: "22 de outubro",
      time: "20:00",
      location: "Blumenau (centro)",
      feedbackAvailable: false,
    },
    {
      id: 2,
      type: "Almoço",
      day: "sábado",
      date: "05 de outubro",
      time: "12:30",
      location: "Indaial (centro)",
      feedbackAvailable: true,
    },
    {
      id: 3,
      type: "Jantar",
      day: "sexta-feira",
      date: "04 de outubro",
      time: "22:00",
      location: "Blumenau (centro)",
      feedbackAvailable: true,
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 px-6 pt-12">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-5xl font-bold">
            <span className="text-[#4A90E2]">Fala</span>
            <span className="text-[#F5A623]">ê!</span>
          </h1>
        </div>

        <div className="border-2 border-gray-900 rounded-2xl overflow-hidden mb-6 max-w-2xl mx-auto">
          <div className="bg-white px-4 py-3 text-center">
            <h2 className="font-bold text-gray-900 text-sm">HISTÓRICO DE ENCONTROS</h2>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {pastEvents.map((event) => (
            <div key={event.id} className="space-y-2">
              <div className="border-2 border-gray-900 rounded-2xl p-4 bg-white">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-white text-2xl">🍽️</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{event.type}</h3>
                    <p className="text-sm text-gray-700 capitalize">
                      {event.day}, {event.date}
                    </p>
                    <p className="text-sm text-gray-700 font-semibold mt-2">{event.time}</p>
                    <p className="text-sm text-gray-700">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-gray-900 rounded-2xl overflow-hidden">
                {event.feedbackAvailable ? (
                  <button
                    onClick={() => router.push(`/feedback1?eventId=${event.id}`)}
                    className="w-full bg-white px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-bold text-[#F5A623] text-sm">O QUE ACHOU DO SEU ENCONTRO?</p>
                  </button>
                ) : (
                  <div className="w-full bg-white px-4 py-3 text-center">
                    <p className="font-bold text-gray-900 text-sm">FEED BACK INDISPONÍVEL</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
