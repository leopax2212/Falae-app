"use client"

import BottomNavigation from "@/components/bottom-navigation"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">e!</span>
        </h1>
        <p className="text-gray-600">Página de Bate-papo em desenvolvimento</p>
      </div>
      <BottomNavigation />
    </div>
  )
}
