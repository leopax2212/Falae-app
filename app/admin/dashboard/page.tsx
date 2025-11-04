"use client"

import { Logo } from "@/components/logo"
import Link from "next/link"
import { ChevronLeft, TrendingUp } from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const encontrosData = [
  { month: "Jan", count: 12 },
  { month: "Fev", count: 15 },
  { month: "Mar", count: 10 },
  { month: "Abr", count: 18 },
  { month: "Mai", count: 22 },
  { month: "Jun", count: 25 },
  { month: "Jul", count: 28 },
  { month: "Ago", count: 32 },
  { month: "Set", count: 35 },
  { month: "Out", count: 40 },
  { month: "Nov", count: 45 },
  { month: "Dez", count: 50 },
]

const realizadosData = [
  { name: "Realizados", value: 65 },
  { name: "Cancelados", value: 35 },
]

const COLORS = ["#0EA5E9", "#FB923C"]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-12">
      <div className="flex flex-col items-center px-6 py-8">
        <Logo />

        <h1 className="mt-6 mb-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-lg font-semibold">Dashboard de Encontros</h2>

          {/* Gráfico de Barras */}
          <div className="rounded-2xl border-2 border-black p-4 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Encontros Realizados</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={encontrosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FB923C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pizza */}
          <div className="rounded-2xl border-2 border-black p-4 bg-white">
            <h3 className="font-semibold mb-4">Taxa de Sucesso</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={realizadosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {realizadosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>Total de encontros: {encontrosData.reduce((acc, d) => acc + d.count, 0)}</p>
            <p>Taxa de sucesso: 65%</p>
            <p>Encontros cancelados: 35%</p>
          </div>
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
