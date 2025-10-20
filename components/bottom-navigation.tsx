"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, Calendar, User } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/chat", icon: MessageCircle, label: "Bate-papo" },
    { href: "/eventos", icon: Calendar, label: "Eventos" },
    { href: "/perfil", icon: User, label: "Perfil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 flex-1">
              <Icon className={`w-6 h-6 ${isActive ? "text-[#4A90E2]" : "text-gray-400"}`} />
              <span className={`text-xs ${isActive ? "text-[#4A90E2] font-medium" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
