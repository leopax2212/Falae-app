"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

interface EncontroParaFeedback {
  id: string
  restaurante: string
  tipo: string
  local: string
  usuarioId: string
  imagemUrl: string
}

export default function Feedback1Page() {
  const router = useRouter()
  const [nota, setNota] = useState<number>(0)
  const [comentario, setComentario] = useState("")
  const [encontro, setEncontro] = useState<EncontroParaFeedback | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    // Recuperar dados do encontro do localStorage
    const encontroSalvo = localStorage.getItem('encontroParaFeedback')
    const token = localStorage.getItem("token")
    
    if (!token) {
      router.push('/login')
      return
    }
    
    if (encontroSalvo) {
      setEncontro(JSON.parse(encontroSalvo))
    } else {
      // Se não houver dados, voltar para histórico
      router.push('/historico')
    }
  }, [router])

  const handleSubmit = async () => {
    if (!encontro || nota === 0) {
      alert("Por favor, dê uma nota antes de continuar.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push('/login')
      return
    }

    setEnviando(true)

    try {
      const response = await fetch('http://localhost:8081/bff/feedbacks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encontroId: encontro.id,
          usuarioId: encontro.usuarioId,
          nota: nota,
          comentario: comentario
        })
      })

      if (response.ok) {
        // Salvar que o feedback foi enviado para este encontro
        const feedbacksEnviados = JSON.parse(localStorage.getItem('feedbacksEnviados') || '[]')
        feedbacksEnviados.push(encontro.id)
        localStorage.setItem('feedbacksEnviados', JSON.stringify(feedbacksEnviados))
        
        // Limpar dados temporários
        localStorage.removeItem('encontroParaFeedback')
        
        // Voltar para histórico
        router.push('/historico')
      } else if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("token")
        localStorage.removeItem("usuarioId")
        router.push('/login')
      } else {
        throw new Error('Erro ao enviar feedback')
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
      alert('Erro ao enviar feedback. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (!encontro) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-8 pb-8">
      <button onClick={() => router.push('/historico')} className="self-start mb-8">
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>

      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <p className="text-lg font-semibold text-gray-900 mb-2">Feedback</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-12">Como foi sua experiência?</h2>

        <div className="w-full max-w-sm border-2 border-gray-900 rounded-3xl p-6 mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center">
              <span className="text-3xl">{encontro.imagemUrl}</span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div>
              <p className="font-semibold text-gray-900">Restaurante</p>
              <p className="text-gray-700">{encontro.restaurante}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{encontro.tipo}</p>
              <p className="text-gray-700">{encontro.local}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm mb-8">
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Nota (0 a 10)
          </label>
          <div className="flex items-center justify-between mb-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setNota(num)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  nota === num 
                    ? 'bg-[#F5A623] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Nota selecionada: {nota}
          </p>
        </div>

        <div className="w-full max-w-sm mb-8">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-[#4A90E2] focus:outline-none"
            rows={4}
            placeholder="Compartilhe sua experiência..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={enviando || nota === 0}
          className={`w-full max-w-sm text-white font-bold py-4 rounded-full transition-all ${
            nota === 0 || enviando
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#4A90E2] to-[#A8D5BA] hover:opacity-90'
          }`}
        >
          {enviando ? 'Enviando...' : 'Enviar Feedback'}
        </button>
      </div>
    </div>
  )
}