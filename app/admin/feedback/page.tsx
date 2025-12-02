"use client"

import { Logo } from "@/components/logo"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Filter, Loader2 } from "lucide-react"

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

const ITEMS_PER_PAGE = 10
const ADMIN_TOKEN = "admin-static-token"

export default function FeedbackPage() {
  const [filterDate, setFilterDate] = useState("")
  const [filterRestaurant, setFilterRestaurant] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        setLoading(true)

        const response = await fetch('http://localhost:8081/bff/feedbacks', {
          headers: {
            "Authorization": `Bearer ${ADMIN_TOKEN}`
          }
        })

        if (!response.ok) {
          throw new Error(`Erro ao carregar: ${response.status}`)
        }

        const data = await response.json()
        setFeedbacks(data)
        setError(null)
      } catch (err) {
        setError('Não foi possível carregar os feedbacks. Verifique se o BFF/backend está rodando.')
        console.error('Erro:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

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

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const dateMatch = !filterDate || 
        formatDate(feedback.encontro.dataHora).toLowerCase().includes(filterDate.toLowerCase()) ||
        formatDate(feedback.dataCriacao).toLowerCase().includes(filterDate.toLowerCase())
      const restaurantMatch = !filterRestaurant || 
        feedback.encontro.local.nome.toLowerCase().includes(filterRestaurant.toLowerCase())
      return dateMatch && restaurantMatch
    })
  }, [feedbacks, filterDate, filterRestaurant])

  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE)
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="mt-4 text-gray-600">Carregando feedbacks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <Logo />
        <div className="mt-8 text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full rounded-full bg-purple-500 px-6 py-3 text-white font-semibold hover:bg-purple-600"
            >
              Tentar novamente
            </button>
            <Link href="/admin">
              <button className="w-full rounded-full border-2 border-black px-6 py-3 font-semibold hover:bg-gray-50">
                Voltar
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pb-8">
      <div className="flex flex-col items-center px-4 py-8 sm:px-6">
        <Logo />

        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-between rounded-full border-2 border-black px-4 py-2">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="flex items-center gap-2 font-semibold"
            >
              <Filter className="h-5 w-5" />
              FILTROS
            </button>
            <span className="text-sm text-gray-600">
              {filteredFeedbacks.length} feedback{filteredFeedbacks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {showFilters && (
            <div className="mb-4 space-y-3 rounded-2xl border-2 border-black p-4 bg-gray-50">
              <div>
                <label className="mb-1 block text-sm font-medium">Data (ex: outubro)</label>
                <input
                  type="text"
                  placeholder="Ex: outubro, 22..."
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-full border-2 border-black px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Restaurante</label>
                <input
                  type="text"
                  placeholder="Digite o nome do restaurante..."
                  value={filterRestaurant}
                  onChange={(e) => {
                    setFilterRestaurant(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-full border-2 border-black px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            {paginatedFeedbacks.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-300 py-8 text-center text-gray-500">
                {feedbacks.length === 0 ? 'Nenhum feedback disponível' : 'Nenhum resultado encontrado'}
              </div>
            ) : (
              paginatedFeedbacks.map((feedback) => (
                <Link key={feedback.id} href={`/admin/feedback/${feedback.id}`}>
                  <button className="w-full rounded-full border-2 border-black bg-white px-6 py-4 text-left transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.99]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{feedback.usuario.nome}</p>
                        <p className="mt-1 text-sm text-gray-600">{feedback.encontro.local.nome}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < feedback.nota ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{formatDate(feedback.dataCriacao)}</p>
                  </button>
                </Link>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-full text-sm font-semibold ${
                      currentPage === pageNum
                        ? 'bg-purple-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <Link href="/admin">
          <button className="mt-8 flex items-center gap-2 text-gray-700 hover:text-black">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-semibold">Voltar</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
