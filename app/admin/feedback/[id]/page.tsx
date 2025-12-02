"use client"

import { Logo } from "@/components/logo"
import Link from "next/link"
import { ChevronLeft, Utensils, Clock, Star, MapPin, Calendar, User, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface Local {
  id: string
  nome: string
  endereco: string
  capacidade: number
  imagemUrl: string
}

interface Encontro {
  id: string
  dataHora: string
  status: string
  local: Local
}

interface Usuario {
  id: string
  nome: string
  email: string
  cidade: string
}

interface Feedback {
  id: string
  encontroId: string
  usuarioId: string
  nota: number
  comentario: string
  dataCriacao: string
  usuario: Usuario
  encontro: Encontro
}

export default function FeedbackDetalhesPage() {
  const params = useParams()
  const id = params.id as string
  
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeedback() {
      if (!id) return
      
      try {
        setLoading(true)
        // Chamada direta para a API - sem autenticação
        const response = await fetch(`http://localhost:8081/bff/feedbacks/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Feedback não encontrado')
          }
          throw new Error(`Erro ${response.status}`)
        }
        
        const data = await response.json()
        setFeedback(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [id])

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Formatar hora para exibição
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="mt-4 text-gray-600">Carregando feedback...</p>
      </div>
    )
  }

  if (error || !feedback) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <Logo />
        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 mb-4">
            <p className="text-red-600 font-semibold">Erro</p>
            <p className="mt-2 text-gray-700">{error || 'Feedback não encontrado'}</p>
          </div>
          <Link href="/admin/feedback">
            <button className="w-full rounded-full bg-purple-500 px-6 py-3 text-white font-semibold hover:bg-purple-600">
              Voltar para lista
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-col items-center px-4 py-8 sm:px-6">
        <Logo />

        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md space-y-6">
          {/* Card do Restaurante */}
          <div className="rounded-3xl border-2 border-purple-500 bg-purple-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-purple-200">
                <Utensils className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{feedback.encontro.local.nome}</h2>
                <div className="mt-2 flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{feedback.encontro.local.endereco}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white p-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Data</p>
                  <p className="font-medium">{formatDate(feedback.encontro.dataHora)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white p-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Horário</p>
                  <p className="font-medium">{formatTime(feedback.encontro.dataHora)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card do Usuário */}
          <div className="rounded-3xl border-2 border-blue-500 bg-blue-50 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-blue-200">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{feedback.usuario.nome}</h3>
                <p className="text-sm text-gray-600">{feedback.usuario.email}</p>
                <p className="mt-1 text-sm text-gray-600">{feedback.usuario.cidade}</p>
              </div>
            </div>
          </div>

          {/* Card do Feedback */}
          <div className="rounded-3xl border-2 border-gray-800 bg-white p-6 shadow-sm">
            {/* Avaliação */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-gray-700">AVALIAÇÃO</p>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-7 w-7 ${
                        i < feedback.nota 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">{feedback.nota}<span className="text-gray-400">/5</span></span>
              </div>
            </div>

            {/* Comentário */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-gray-700">COMENTÁRIO</p>
              <div className="rounded-xl bg-gray-50 p-4 min-h-[100px]">
                <p className="text-gray-700 leading-relaxed">
                  {feedback.comentario || "Nenhum comentário fornecido."}
                </p>
              </div>
            </div>

            {/* Informações do feedback */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Feedback enviado em:</span> {formatDate(feedback.dataCriacao)} às {formatTime(feedback.dataCriacao)}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>
                  <span className="font-medium">ID do Encontro:</span> {feedback.encontroId}
                </div>
                <div>
                  <span className="font-medium">ID do Usuário:</span> {feedback.usuarioId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <Link href="/admin/feedback">
          <button className="mt-8 flex items-center gap-2 rounded-full border-2 border-black px-6 py-3 font-semibold hover:bg-gray-50">
            <ChevronLeft className="h-5 w-5" />
            Voltar para todos os feedbacks
          </button>
        </Link>
      </div>
    </div>
  )
}