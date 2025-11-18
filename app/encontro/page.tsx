"use client"

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useState, useEffect } from "react"

interface Encontro {
  id: number
  localId: string
  dataHora: string
  minimoPreferenciasIguais: number
  vagas: number
  compatibilidade?: number
}

export default function EncontroPage() {
  const router = useRouter()
  const [eventos, setEventos] = useState<Encontro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [inscribingId, setInscribingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch("/api/encontros")
        const data = await response.json()
        
        // Filter eventos that are 7+ days in the future
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const filtered = data.filter((evento: Encontro) => {
          const eventDate = new Date(evento.dataHora)
          const daysUntil = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          return daysUntil >= 7
        })
        
        setEventos(filtered)
      } catch (err) {
        setError("Erro ao carregar eventos")
        console.error("[v0] Fetch eventos error:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchEventos()
  }, [])

  const handleInscrever = async (eventoId: number) => {
    try {
      setInscribingId(eventoId)
      const usuarioId = localStorage.getItem("usuarioId")
      
      const response = await fetch(`/api/encontros/${eventoId}/participantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId }),
      })

      if (!response.ok) {
        throw new Error("Erro ao se inscrever")
      }

      // Store inscribed event and redirect to home with message
      localStorage.setItem("inscribedEventId", eventoId.toString())
      router.push("/home?message=Você foi inscrito com sucesso no encontro!")
    } catch (err) {
      setError("Erro ao se inscrever. Tente novamente.")
      console.error("[v0] Inscrever error:", err)
    } finally {
      setInscribingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Olá {typeof window !== "undefined" ? localStorage.getItem("userName") || "Usuário" : "Usuário"} 👋
        </h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Conheça Pessoas em Blumenau!</h3>

        <p className="text-lg font-medium text-gray-900 mb-8">Reserve seu próximo evento:</p>

        {error && (
          <div className="w-full max-w-sm mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Carregando eventos...</div>
        ) : eventos.length === 0 ? (
          <div className="text-center text-gray-600">Nenhum evento disponível</div>
        ) : (
          <div className="w-full max-w-sm space-y-4">
            {eventos.map((evento) => (
              <button
                key={evento.id}
                onClick={() => setSelectedEvent(evento.id === selectedEvent ? null : evento.id)}
                className={`w-full border-2 border-gray-900 rounded-2xl p-4 flex items-center gap-4 transition-colors ${
                  evento.id === selectedEvent ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-white text-2xl">🍽️</div>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">
                    {formatDate(evento.dataHora)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Vagas: {evento.vagas} | Compatibilidade: {evento.compatibilidade || 0}%
                  </p>
                </div>

                {evento.id === selectedEvent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleInscrever(evento.id)
                    }}
                    disabled={inscribingId === evento.id}
                    className="bg-gradient-to-r from-[#3B82F6] to-[#F5A623] text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {inscribingId === evento.id ? "Inscrevendo..." : "Inscrever"}
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
