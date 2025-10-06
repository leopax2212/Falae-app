import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"

export default function QuizWelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Logo />

        <div className="mt-16 text-center">
          <p className="mb-8 text-xl font-semibold italic">Personalidade.</p>
        </div>
      </div>

      <Navigation nextHref="/quiz/1" />
    </div>
  )
}
