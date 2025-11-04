"use client"

import { Logo } from "@/components/logo"
import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface Usuario {
  id: number
  name: string
  cpf: string
  email: string
  telefone: string
}

const MOCK_USUARIOS: Usuario[] = [
  { id: 1, name: "HELOISA MARGARIDA", cpf: "129.456.879-02", email: "heloisa@email.com", telefone: "47 996854434" },
  { id: 2, name: "CARINE CAVALHEIRO", cpf: "987.654.321-00", email: "carine@email.com", telefone: "47 998765432" },
  { id: 3, name: "LEONARDO DUARTE", cpf: "456.789.123-00", email: "leonardo@email.com", telefone: "47 997894561" },
  { id: 4, name: "LEANDRO DE ALCANTARA", cpf: "321.654.987-00", email: "leandro@email.com", telefone: "47 996523145" },
  { id: 5, name: "ANA LUIZA", cpf: "654.321.789-00", email: "ana@email.com", telefone: "47 998965214" },
  { id: 6, name: "MARIA LUIZA", cpf: "789.123.456-00", email: "maria@email.com", telefone: "47 999875432" },
  { id: 7, name: "CAIO AVILAR", cpf: "111.222.333-00", email: "caio@email.com", telefone: "47 991122334" },
  { id: 8, name: "MANUELA DIAS", cpf: "444.555.666-00", email: "manuela@email.com", telefone: "47 994445556" },
  { id: 9, name: "BEATRIZ SILVA", cpf: "777.888.999-00", email: "beatriz@email.com", telefone: "47 997778889" },
  { id: 10, name: "JOÃO SANTOS", cpf: "101.202.303-00", email: "joao@email.com", telefone: "47 991011121" },
  { id: 11, name: "PAULA OLIVEIRA", cpf: "212.313.414-00", email: "paula@email.com", telefone: "47 992131415" },
  { id: 12, name: "CARLOS MENDES", cpf: "323.424.525-00", email: "carlos@email.com", telefone: "47 993233242" },
]

const ITEMS_PER_PAGE = 10

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredUsuarios = useMemo(() => {
    return MOCK_USUARIOS.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm])

  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE)
  const paginatedUsuarios = filteredUsuarios.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="flex min-h-screen flex-col bg-white pb-8">
      <div className="flex flex-col items-center px-6 py-8">
        <Logo />

        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 rounded-full border-2 border-black px-4 py-2">
            <Search className="h-5 w-5 text-gray-600" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 bg-transparent outline-none"
            />
          </div>

          <div className="space-y-2">
            {paginatedUsuarios.map((user) => (
              <Link key={user.id} href={`/admin/usuarios/${user.id}`}>
                <button className="w-full rounded-full border-2 border-black bg-white px-6 py-3 text-base font-semibold transition-colors hover:bg-gray-50">
                  {user.name}
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
