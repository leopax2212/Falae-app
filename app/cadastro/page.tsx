"use client"

import type React from "react"

import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CadastroPage() {
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    cidade: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    setError("")

    // Validation
    if (
      !formData.nome.trim() ||
      !formData.cpf.trim() ||
      !formData.dataNascimento ||
      !formData.cidade.trim() ||
      !formData.email.trim() ||
      !formData.senha.trim()
    ) {
      setError("Todos os campos obrigatórios devem ser preenchidos")
      return
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem")
      return
    }

    if (!agreed) {
      setError("Você deve concordar com os termos e políticas")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8081/bff/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          cpf: formData.cpf,
          dataNascimento: new Date(formData.dataNascimento).toISOString(),
          cidade: formData.cidade,
          email: formData.email,
          senha: formData.senha,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "Erro ao criar conta. Tente novamente.")
        return
      }

      // Redirect to login on success
      router.push("/login")
    } catch (err) {
      setError("Erro ao conectar com o servidor. Verifique sua conexão.")
      console.error("Cadastro error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Crie sua conta!</h1>
            <p className="mt-2 text-base">Seja Bem Vindo!</p>
          </div>

          {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome:</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Cidade:</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">E-mail:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">CPF:</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Data de Nascimento:</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Senha:</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirmar Senha:</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  className="w-full rounded-full border-2 border-black px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="terms" className="text-sm">
                Concordo com os termos e políticas.
              </label>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <GradientButton onClick={handleSubmit} disabled={loading}>
              {loading ? "Criando conta..." : "Enviar"}
            </GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/login" />
    </div>
  )
}
