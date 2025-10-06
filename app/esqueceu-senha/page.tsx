import { Logo } from "@/components/logo"
import { GradientButton } from "@/components/gradient-button"
import { Navigation } from "@/components/navigation"

export default function EsqueceuSenhaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-16 w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold">Esqueceu a senha?</h1>
            <p className="text-base font-medium">Redefina sua senha em duas etapas</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#3B82F6]">Qual seu email de cadastro?</label>
            <input
              type="email"
              className="w-full rounded-full border-2 border-black px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center pt-8">
            <GradientButton>Enviar</GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/login" nextHref="/verificacao" />
    </div>
  )
}
