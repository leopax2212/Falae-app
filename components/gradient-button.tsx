import type React from "react"
import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
}

export function GradientButton({ children, className, href, ...props }: GradientButtonProps) {
  if (href) {
    return (
      <Link href={href}>
        <button
          className={cn(
            "w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-400 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      </Link>
    )
  }

  return (
    <button
      className={cn(
        "w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-400 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
