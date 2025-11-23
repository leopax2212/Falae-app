"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Users, MessageSquare, BarChart3, LogOut, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <h1 className="mb-12 mt-8 text-2xl font-semibold">ADMINISTRADOR</h1>

        <div className="w-full max-w-md flex flex-col gap-6">
          <Link href="/admin/usuarios">
            <button className="w-full flex items-center justify-center gap-4 rounded-full border-2 border-black bg-white px-8 py-5 text-lg font-semibold transition-colors hover:bg-gray-50">
              <Users className="h-6 w-6" />
              USUÁRIOS
            </button>
          </Link>

          <Link href="/admin/locais">
            <button className="w-full flex items-center justify-center gap-4 rounded-full border-2 border-black bg-white px-8 py-5 text-lg font-semibold transition-colors hover:bg-gray-50">
              <MapPin className="h-6 w-6" />
              LOCAIS / RESTAURANTES
            </button>
          </Link>

          <Link href="/admin/feedback">
            <button className="w-full flex items-center justify-center gap-4 rounded-full border-2 border-black bg-white px-8 py-5 text-lg font-semibold transition-colors hover:bg-gray-50">
              <MessageSquare className="h-6 w-6" />
              DENÚNCIAS / FEEDBACK
            </button>
          </Link>

          <Link href="/admin/dashboard">
            <button className="w-full flex items-center justify-center gap-4 rounded-full border-2 border-black bg-white px-8 py-5 text-lg font-semibold transition-colors hover:bg-gray-50">
              <BarChart3 className="h-6 w-6" />
              DASHBOARD ENCONTROS
            </button>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-12 flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
}
