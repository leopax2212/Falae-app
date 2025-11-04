"use client"

import { Logo } from "@/components/logo"
import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

interface Encontro {
  id: number
  personName: string
  date: string
  time: string
  restaurant: string
}

const MOCK_ENCONTROS: Encontro[] = [
  { id: 1, personName: "HELOISA MARGARIDA", date: "22 de outubro", time: "20:00", restaurant: "Pub Brasil" },
  { id: 2, personName: "CARINE CAVALHEIRO", date: "19 de outubro", time: "20:00", restaurant: "Blumenau" },
  { id: 3, personName: "LEONARDO DUARTE", date: "04 de outubro", time: "22:00", restaurant: "García" },
  { id: 4, personName: "LEANDRO DE ALCANTARA", date: "15 de setembro", time: "19:30", restaurant: "Casa do Churrasco" },
  { id: 5, personName: "ANA LUIZA", date: "10 de setembro", time: "20:00", restaurant: "Restaurante Central" },
  { id: 6, personName: "MARIA LUIZA", date: "05 de setembro", time: "19:00", restaurant: "Boteco da Esquina" },
  { id: 7, personName: "CAIO AVILAR", date: "30 de agosto", time: "20:30", restaurant: "Pizzaria Italia" },
  { id: 8, personName: "MANUELA DIAS", date: "25 de agosto", time: "18:00", restaurant: "Café Gourmet" },
  { id: 9, personName: "BEATRIZ SILVA", date: "20 de agosto", time: "21:00", restaurant: "Pub Inglês" },
  { id: 10, personName: "JOÃO SANTOS", date: "15 de agosto", time: "20:00", restaurant: "Restaurante Japonês" },
  { id: 11, personName: "PAULA OLIVEIRA", date: "10 de agosto", time: "19:00", restaurant: "Churrascaria" },
  { id: 12, personName: "CARLOS MENDES", date: "05 de agosto", time: "20:00", restaurant: "Bar do Centro" },
]

const ITEMS_PER_PAGE = 10

export default function FeedbackPage() {
  const [filterDate, setFilterDate] = useState("")
  const [filterRestaurant, setFilterRestaurant] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const filteredEncontros = useMemo(() => {
    return MOCK_ENCONTROS.filter((encontro) => {
      const dateMatch = !filterDate || encontro.date.includes(filterDate)
      const restaurantMatch =
        !filterRestaurant || encontro.restaurant.toLowerCase().includes(filterRestaurant.toLowerCase())
      return dateMatch && restaurantMatch
    })
  }, [filterDate, filterRestaurant])

  const totalPages = Math.ceil(filteredEncontros.length / ITEMS_PER_PAGE)
  const paginatedEncontros = filteredEncontros.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="flex min-h-screen flex-col bg-white pb-8">
      <div className="flex flex-col items-center px-6 py-8">
        <Logo />

        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-between rounded-full border-2 border-black px-4 py-2">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 font-semibold">
              <Filter className="h-5 w-5" />
              FILTROS
            </button>
            <span className="text-sm text-gray-600">FEEDBACKS</span>
          </div>

          {showFilters && (
            <div className="mb-4 space-y-2 rounded-2xl border-2 border-black p-4 bg-gray-50">
              <input
                type="text"
                placeholder="Filtrar por data..."
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-full border-2 border-black px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Filtrar por restaurante..."
                value={filterRestaurant}
                onChange={(e) => {
                  setFilterRestaurant(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-full border-2 border-black px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="space-y-2">
            {paginatedEncontros.map((encontro) => (
              <Link key={encontro.id} href={`/admin/feedback/${encontro.id}`}>
                <button className="w-full rounded-full border-2 border-black bg-white px-6 py-3 text-base font-semibold transition-colors hover:bg-gray-50">
                  {encontro.personName}
                </button>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="text-sm font-semibold">
                {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        <Link href="/admin">
          <button className="mt-8 text-gray-700 hover:text-black">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </Link>
      </div>
    </div>
  )
}
