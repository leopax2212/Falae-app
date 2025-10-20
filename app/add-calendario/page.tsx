"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddCalendarioPage() {
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-24">
        <button onClick={() => window.history.back()} className="self-start mb-8">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-4xl font-bold mb-8">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>

        <div className="w-full max-w-sm mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#F5A623] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Icrie</h3>
              <p className="text-sm text-gray-600">Quarta-feira, 22 de outubro</p>
              <p className="text-sm text-gray-600">20:00</p>
              <p className="text-sm text-gray-600">Blumenau / Centro</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Nome" className="rounded-full border-2 border-gray-200" />
            <div className="flex gap-3">
              <Input placeholder="Data" className="rounded-full border-2 border-gray-200 flex-1" />
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-2 border-gray-200 px-4 bg-transparent"
              >
                📅
              </Button>
            </div>
            <div className="flex gap-3">
              <Input placeholder="Horário" className="rounded-full border-2 border-gray-200 flex-1" />
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-2 border-gray-200 px-4 bg-transparent"
              >
                🕐
              </Button>
            </div>
            <Input placeholder="Local" className="rounded-full border-2 border-gray-200" />
            <Input placeholder="Descrição" className="rounded-full border-2 border-gray-200" />
            <Input placeholder="Link" className="rounded-full border-2 border-gray-200" />

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 rounded-full px-4 py-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Adicionado ao calendário com sucesso!</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#4DD0E1] to-[#F5A623] hover:opacity-90 text-gray-800 font-medium"
            >
              Cancelar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
