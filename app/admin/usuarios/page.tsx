"use client";

import { Logo } from "@/components/logo";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
}

const ITEMS_PER_PAGE = 10;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      const resp = await fetch("http://localhost:8081/bff/usuarios");
      const data = await resp.json();

      // Normaliza para garantir que sempre exista nome/email
      const normalizados: Usuario[] = data.map((u: any) => ({
        id: u.id,
        nome: u.nome ?? "",
        cpf: u.cpf ?? "",
        email: u.email ?? "",
        telefone: u.telefone ?? "", // backend não envia, mas deixa preparado
      }));

      setUsuarios(normalizados);
    }

    loadData();
  }, []);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((user) =>
      (user.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, usuarios]);

  const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 bg-transparent outline-none"
            />
          </div>

          <div className="space-y-4">
            {paginatedUsuarios.map((user) => (
              <Link key={user.id} href={`/admin/usuarios/${user.id}`}>
                <button className="w-full rounded-full border-2 border-black bg-white px-6 py-4 text-base font-semibold transition-colors hover:bg-gray-50">
                  {user.nome}
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
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
  );
}
