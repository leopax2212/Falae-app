import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import Image from "next/image"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-between px-6 py-12">
        <Logo />

        <div className="flex flex-col items-center gap-8">
          <div className="relative h-[400px] w-full max-w-md">
            <Image src="/images/hands-unity.jpg" alt="Mãos unidas em círculo" fill className="object-contain" />
          </div>

          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">
              Bem Vindo ao Falaê!
              <br />
              Sua Dose Semanal De Interação!
            </h1>
            <p className="text-base leading-relaxed text-gray-700">
              Descubra sua compatibilidade através de 15
              <br />
              perguntas divertidas.
            </p>
          </div>
        </div>

        <div className="h-16" />
      </div>

      <Navigation nextHref="/login" />
    </div>
  )
}
