"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  backHref?: string
  nextHref?: string
  onBack?: () => void
  onNext?: () => void
}

export function Navigation({ backHref, nextHref, onBack, onNext }: NavigationProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      {backHref ? (
        <Link href={backHref} className="flex items-center gap-1 text-sm font-medium">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Link>
      ) : onBack ? (
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </button>
      ) : (
        <div />
      )}

      {nextHref ? (
        <Link href={nextHref} className="flex items-center gap-1 text-sm font-medium">
          Próximo
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : onNext ? (
        <button onClick={onNext} className="flex items-center gap-1 text-sm font-medium">
          Próximo
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : (
        <div />
      )}
    </div>
  )
}
