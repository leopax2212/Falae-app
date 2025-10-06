import type React from "react"
import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-lime-300 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
