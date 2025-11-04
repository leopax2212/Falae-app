"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Star } from "lucide-react"

export default function Feedback1Page() {
  const router = useRouter()
  const [rating, setRating] = useState(0)

  const eventInfo = {
    restaurant: "Pub Brasil",
    type: "Pub",
    location: "Blumenau/Garcia",
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-8 pb-8">
      <button onClick={() => router.back()} className="self-start mb-8">
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>

      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <p className="text-lg font-semibold text-gray-900 mb-2">Feedback</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-12">Como foi sua experiência?</h2>

        <div className="w-full max-w-sm border-2 border-gray-900 rounded-3xl p-6 mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div>
              <p className="font-semibold text-gray-900">Restaurante</p>
              <p className="text-gray-700">{eventInfo.restaurant}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{eventInfo.type}</p>
              <p className="text-gray-700">{eventInfo.location}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-700 mb-4 px-4">Nos conte sua avaliação através das estrelas</p>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
              <Star className={`w-12 h-12 ${star <= rating ? "fill-gray-900 text-gray-900" : "text-gray-300"}`} />
            </button>
          ))}
        </div>

        <p className="text-center font-semibold text-gray-900 mb-auto">
          {rating === 1 || rating === 2 ? "Desapontada e Insatisfeita" : ""}
        </p>

        <button
          onClick={() => router.push("/feedback2")}
          className="w-full max-w-sm bg-gradient-to-r from-[#4A90E2] to-[#A8D5BA] text-white font-bold py-4 rounded-full hover:opacity-90 transition-opacity mt-8"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
