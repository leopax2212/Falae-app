"use client"

import { Logo } from "@/components/logo"
import Link from "next/link"
import { ChevronLeft, Utensils, Clock, Star } from "lucide-react"

interface Feedback {
  id: number
  personName: string
  personImage: string
  rating: number
  comment: string
  date: string
  time: string
  restaurant: string
  location: string
}

const MOCK_FEEDBACKS: Record<number, Feedback> = {
  1: {
    id: 1,
    personName: "HELOISA MARGARIDA",
    personImage: "👩",
    rating: 4,
    comment: "Ótimo atendimento e comida boa",
    date: "22 de outubro",
    time: "20:00",
    restaurant: "Pub Brasil",
    location: "Blumenau (centro)",
  },
  2: {
    id: 2,
    personName: "CARINE CAVALHEIRO",
    personImage: "👩",
    rating: 5,
    comment: "Encontro maravilhoso, voltamos em breve!",
    date: "19 de outubro",
    time: "20:00",
    restaurant: "Blumenau",
    location: "Blumenau (centro)",
  },
}

export default function FeedbackDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number.parseInt((params as any).id)
  const feedback = MOCK_FEEDBACKS[id]

  if (!feedback) {
    return <div>Feedback não encontrado</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-col items-center px-6 py-8">
        <Logo />

        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md space-y-6">
          {/* Encontro Info */}
          <div className="rounded-3xl border-2 border-purple-500 bg-purple-50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Utensils className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-lg">{feedback.restaurant}</p>
                <p className="text-sm text-gray-600">{feedback.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-gray-600" />
              <span>{feedback.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-gray-600" />
              <span>{feedback.time}</span>
            </div>
          </div>

          {/* Pessoa que deu feedback */}
          <div className="rounded-3xl border-2 border-black p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{feedback.personImage}</span>
              <p className="font-semibold">{feedback.personName}</p>
            </div>

            {/* Stars */}
            <div className="flex gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-base text-gray-700">{feedback.comment}</p>
          </div>
        </div>

        <Link href="/admin/feedback">
          <button className="mt-8 text-gray-700 hover:text-black">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </Link>
      </div>
    </div>
  )
}
