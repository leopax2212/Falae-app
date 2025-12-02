"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNavigation from "@/components/bottom-navigation"

interface Local {
  id: string
  nome: string
  endereco: string
  capacidade: number
  imagemUrl: string
}

interface Participante {
  id: string
  nome: string
  email: string
  cidade: string
}

interface Encontro {
  id: string
  localId: string
  local: Local
  dataHora: string
  status: string
  dataCriacao: string
  participantes: Participante[]
  totalParticipantes: number
}

export default function HistoricoPage() {
  const router = useRouter()
  const [encontros, setEncontros] = useState<Encontro[]>([])
  const [loading, setLoading] = useState(true)
  const [feedbackEnviado, setFeedbackEnviado] = useState<Set<string>>(new Set())
  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const id = localStorage.getItem("usuarioId")
    
    if (!token || !id) {
      console.error("Token ou usuarioId não encontrado")
      router.push('/login') // Redirecionar para login se não autenticado
      return
    }
    
    setUsuarioId(id)
    
    // Recuperar feedbacks já enviados do localStorage
    const feedbacksSalvos = localStorage.getItem('feedbacksEnviados')
    if (feedbacksSalvos) {
      setFeedbackEnviado(new Set(JSON.parse(feedbacksSalvos)))
    }
  }, [router])

  useEffect(() => {
    if (usuarioId) {
      carregarEncontros()
    }
  }, [usuarioId])

  const carregarEncontros = async () => {
    if (!usuarioId) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8081/bff/encontros/usuario/${usuarioId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setEncontros(data)
      } else if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("token")
        localStorage.removeItem("usuarioId")
        router.push('/login')
      } else {
        console.error('Erro ao carregar encontros:', response.status)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (dataHora: string) => {
    const data = new Date(dataHora)
    const diasDaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    
    const diaDaSemana = diasDaSemana[data.getDay()]
    const dia = data.getDate()
    const mes = meses[data.getMonth()]
    const hora = data.getHours().toString().padStart(2, '0')
    const minutos = data.getMinutes().toString().padStart(2, '0')
    
    return {
      day: diaDaSemana,
      date: `${dia} de ${mes}`,
      time: `${hora}:${minutos}`
    }
  }

  const isDataPassada = (dataHora: string) => {
    const dataEncontro = new Date(dataHora)
    const agora = new Date()
    return dataEncontro < agora
  }

  const handleFeedbackClick = (encontro: Encontro) => {
    if (!usuarioId) {
      router.push('/login')
      return
    }

    // Salvar dados do encontro para usar na página de feedback
    localStorage.setItem('encontroParaFeedback', JSON.stringify({
      id: encontro.id,
      restaurante: encontro.local.nome,
      tipo: "Jantar", // Você pode ajustar isso conforme necessário
      local: encontro.local.endereco,
      usuarioId: usuarioId
    }))
    router.push('/feedback1')
  }

  const verificarFeedbackEnviado = (encontroId: string) => {
    return feedbackEnviado.has(encontroId)
  }

  if (!usuarioId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pb-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#4A90E2]">Fala</span>
            <span className="text-[#F5A623]">ê!</span>
          </h1>
          <p className="text-gray-700">Redirecionando para login...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pb-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#4A90E2]">Fala</span>
            <span className="text-[#F5A623]">ê!</span>
          </h1>
          <p className="text-gray-700">Carregando encontros...</p>
        </div>
        <BottomNavigation />
      </div>
    )
  }

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

        {encontros.length === 0 ? (
          <div className="text-center py-8 max-w-2xl mx-auto">
            <p className="text-gray-700">Nenhum encontro encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {encontros.map((encontro) => {
              const { day, date, time } = formatarData(encontro.dataHora)
              const dataPassada = isDataPassada(encontro.dataHora)
              const feedbackJaEnviado = verificarFeedbackEnviado(encontro.id)

              return (
                <div key={encontro.id} className="space-y-2">
                  <div className="border-2 border-gray-900 rounded-2xl p-4 bg-white">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-white text-2xl">🍽️</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Jantar</h3>
                        <p className="text-sm text-gray-700 capitalize">
                          {day}, {date}
                        </p>
                        <p className="text-sm text-gray-700 font-semibold mt-2">{time}</p>
                        <p className="text-sm text-gray-700">{encontro.local.nome} - {encontro.local.endereco}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-gray-900 rounded-2xl overflow-hidden">
                    {!dataPassada ? (
                      <div className="w-full bg-white px-4 py-3 text-center">
                        <p className="font-bold text-gray-900 text-sm">FEEDBACK INDISPONÍVEL</p>
                      </div>
                    ) : feedbackJaEnviado ? (
                      <div className="w-full bg-white px-4 py-3 text-center">
                        <p className="font-bold text-green-600 text-sm">FEEDBACK CONCLUÍDO</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFeedbackClick(encontro)}
                        className="w-full bg-white px-4 py-3 text-center hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-bold text-[#F5A623] text-sm">O QUE ACHOU DO SEU ENCONTRO?</p>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}