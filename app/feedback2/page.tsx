"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Reaction = "sad" | "neutral" | "happy" | "love" | "absent" | null

export default function Feedback2Page() {
  const router = useRouter()

  const [reactions, setReactions] = useState<Record<string, Reaction>>({
    Marcelo: null,
    Ana: null,
    João: null,
    Manuela: null,
  })

  const people = ["Marcelo", "Ana", "João", "Manuela"]

  const emojis = [
    { type: "sad" as const, emoji: "😞" },
    { type: "neutral" as const, emoji: "😐" },
    { type: "happy" as const, emoji: "😊" },
    { type: "love" as const, emoji: "😍" },
  ]

  const handleReaction = (person: string, reaction: Reaction) => {
    setReactions((prev) => ({ ...prev, [person]: reaction }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>
        <p className="text-lg font-semibold text-gray-900">Feedback</p>
      </div>

      <div className="space-y-8">
        {people.map((person) => (
          <div key={person} className="space-y-3">
            <h3 className="text-center font-bold text-gray-900 text-lg">O que você achou de {person}?</h3>

            <div className="flex justify-center gap-3 mb-3">
              {emojis.map(({ type, emoji }) => (
                <button
                  key={type}
                  onClick={() => handleReaction(person, type)}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl transition-all ${
                    reactions[person] === type
                      ? "border-gray-900 bg-gray-100 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleReaction(person, "absent")}
                className={`px-6 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                  reactions[person] === "absent"
                    ? "border-[#F5A623] text-[#F5A623] bg-orange-50"
                    : "border-gray-900 text-gray-900 hover:bg-gray-50"
                }`}
              >
                Não Compareceu
              </button>
              <button className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors">
                DENUNCIAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
