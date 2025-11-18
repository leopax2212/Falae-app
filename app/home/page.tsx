"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavigation from "@/components/bottom-navigation"

type ScheduledEvent = {
  id: number
  type: string
  date: string
  time: string
  location: string
} | null

type ApiEncontro = {
  id: string
  tipo: string
  data: string
  horario: string
  local: string
  localId: string
}

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [eventToCancel, setEventToCancel] = useState<ScheduledEvent>(null)

  const [scheduledEvent, setScheduledEvent] = useState<ScheduledEvent>(null)
  const [showAddButton, setShowAddButton] = useState(false)

  // Buscar encontros do usuário
  useEffect(() => {
    const fetchEncontros = async () => {
      try {
        setLoading(true)
        
        // Pega o ID do usuário logado
        const usuarioId = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
        
        if (!usuarioId) {
          console.log("Usuário não logado")
          setScheduledEvent(null)
          setShowAddButton(true)
          setLoading(false)
          return
        }

        console.log("Buscando encontros para usuário:", usuarioId)
        
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }
        if (token) {
          headers.Authorization = token
        }

        const response = await fetch("http://localhost:8081/bff/encontros", {
          method: "GET",
          headers,
        })

        if (response.ok) {
          const encontros: ApiEncontro[] = await response.json()
          console.log("Encontros recebidos:", encontros)
          
          // Busca informações do local para o encontro
          let encontroDoUsuario = null
          let localInfo = "Restaurante Bella Itália" // default

          // Primeiro, encontra o encontro onde o usuário está participando
          for (const encontro of encontros) {
            // Busca participantes deste encontro
            const participantesResponse = await fetch(`http://localhost:8081/bff/encontros/${encontro.id}/participantes`, {
              headers
            })
            
            if (participantesResponse.ok) {
              const participantes = await participantesResponse.json()
              const usuarioEstaNoEncontro = participantes.some((p: any) => 
                p.id === usuarioId || (typeof p === 'string' && p === usuarioId)
              )
              
              if (usuarioEstaNoEncontro) {
                encontroDoUsuario = encontro
                
                // Busca informações do local
                try {
                  const localResponse = await fetch(`http://localhost:8081/bff/locais/${encontro.localId}`, {
                    headers
                  })
                  if (localResponse.ok) {
                    const localData = await localResponse.json()
                    localInfo = localData.nome || "Restaurante Bella Itália"
                  }
                } catch (error) {
                  console.error("Erro ao buscar local:", error)
                }
                break
              }
            }
          }

          if (encontroDoUsuario) {
            const eventDate = new Date(encontroDoUsuario.data)
            const formattedEvent = {
              id: parseInt(encontroDoUsuario.id),
              type: encontroDoUsuario.tipo || "Jantar",
              date: eventDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              }),
              time: encontroDoUsuario.horario,
              location: localInfo
            }
            
            setScheduledEvent(formattedEvent)
            
            // Verifica se o encontro já terminou
            const eventEnded = checkIfEventEnded(encontroDoUsuario.data, encontroDoUsuario.horario)
            setShowAddButton(eventEnded)
            console.log("Encontro encontrado:", formattedEvent, "Evento terminado:", eventEnded)
          } else {
            setScheduledEvent(null)
            setShowAddButton(true)
            console.log("Nenhum encontro encontrado para o usuário")
          }
        } else {
          console.error("Erro ao buscar encontros:", response.status)
          setScheduledEvent(null)
          setShowAddButton(true)
        }
      } catch (error) {
        console.error("Erro na requisição:", error)
        setScheduledEvent(null)
        setShowAddButton(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEncontros()
  }, [])

  useEffect(() => {
    const msg = searchParams.get("message")
    if (msg) {
      setMessage(msg)
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }, [searchParams])

  const checkIfEventEnded = (dateString: string, timeString: string): boolean => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number)
      const eventDateTime = new Date(dateString)
      eventDateTime.setHours(hours, minutes, 0, 0)
      
      const now = new Date()
      
      return now > eventDateTime
    } catch (error) {
      console.error("Erro ao verificar data do evento:", error)
      return false
    }
  }

  const handleCancelClick = (event: ScheduledEvent) => {
    setEventToCancel(event)
    setShowCancelModal(true)
  }

  const handleCancel = async () => {
    if (!eventToCancel) return

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const usuarioId = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers.Authorization = token
      }

      const response = await fetch(`http://localhost:8081/bff/encontros/${eventToCancel.id}/participantes/${usuarioId}`, {
        method: "DELETE",
        headers,
      })

      if (response.ok) {
        setScheduledEvent(null)
        setShowAddButton(true)
        setMessage("Encontro cancelado com sucesso!")
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
      } else {
        console.error("Erro ao cancelar encontro:", response.status)
        setMessage("Erro ao cancelar encontro. Tente novamente.")
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 3000)
      }
    } catch (error) {
      console.error("Erro na requisição de cancelamento:", error)
      setMessage("Erro ao cancelar encontro. Tente novamente.")
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    } finally {
      setShowCancelModal(false)
      setEventToCancel(null)
    }
  }

  // Verifica periodicamente se o encontro atual já terminou
  useEffect(() => {
    if (!scheduledEvent) return

    const checkEventStatus = () => {
      // Para simplificar, vamos apenas recarregar os encontros
      const fetchEncontros = async () => {
        try {
          const usuarioId = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null
          const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
          
          if (!usuarioId) return

          const headers: HeadersInit = {}
          if (token) headers.Authorization = token

          const response = await fetch("http://localhost:8081/bff/encontros", {
            headers,
          })

          if (response.ok) {
            const encontros: ApiEncontro[] = await response.json()
            
            const encontroDoUsuario = encontros.find(encontro => {
              // Verificação simplificada - na prática precisaria buscar participantes
              return true // Esta lógica precisa ser refinada
            })

            if (!encontroDoUsuario) {
              setScheduledEvent(null)
              setShowAddButton(true)
            }
          }
        } catch (error) {
          console.error("Erro ao verificar status do evento:", error)
        }
      }

      fetchEncontros()
    }

    const interval = setInterval(checkEventStatus, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [scheduledEvent])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col pb-20">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h1 className="text-5xl font-bold mb-8">
            <span className="text-[#4A90E2]">Fala</span>
            <span className="text-[#F5A623]">ê!</span>
          </h1>
          <p className="text-gray-600">Carregando seus encontros...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <h1 className="text-5xl font-bold mb-8">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-12">
          Olá {typeof window !== "undefined" ? localStorage.getItem("userName") || "Usuário" : "Usuário"} 👋
        </h2>

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
                  onClick={() => handleCancelClick(scheduledEvent)}
                  className="flex-1 bg-[#F5A623] text-gray-900 font-bold py-3 text-sm border-r border-gray-900 hover:bg-[#e69515] transition-colors"
                >
                  CANCELAR
                </button>
              </div>
            </div>

            {showAddButton && (
              <button
                onClick={() => router.push("/encontro")}
                className="w-full border-2 border-gray-900 rounded-full py-4 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                + ADD UM NOVO ENCONTRO
              </button>
            )}
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

      {showMessage && (
        <div className="fixed top-4 left-4 right-4 bg-green-100 border-2 border-green-500 rounded-lg p-4 text-green-800 font-semibold text-center">
          {message}
        </div>
      )}

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