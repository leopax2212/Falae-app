"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function HomePage() {
  const events = [
    {
      id: 1,
      title: "Icrie",
      date: "Quarta-feira, 22 de outubro",
      time: "20:00",
      location: "Blumenau / Centro",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <button className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-2">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <h2 className="text-lg font-medium text-gray-800 mb-1">Olá Helo 👋</h2>
        <p className="text-base text-gray-700 mb-8">Conheça Pessoas em Blumenau!</p>

        <div className="w-full max-w-sm space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="text-sm text-gray-600">{event.time}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
