"use client";

import { Logo } from "@/components/logo";
import { Navigation } from "@/components/navigation";
import { Eye } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (email === "admin@falae.com" && password === "admin123") {
      router.push("/admin");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/bff/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      if (!res.ok) {
        alert("E-mail ou senha incorretos!");
        return;
      }

      const data = await res.json();

      // Aqui depende do que o backend retorna
      const userId =
        data.id || data.usuarioId || data.userId || data?.usuario?.id || null;

      if (!userId) {
        console.error("ID NÃO ENCONTRADO NO LOGIN", data);
      }

      localStorage.setItem("usuarioId", userId);
      localStorage.setItem("userName", data.nome || data?.usuario?.nome);
      localStorage.setItem("userEmail", data.email || data?.usuario?.email);

      router.push("/home");
    } catch (e) {
      console.error("Erro no login:", e);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <h1 className="mb-12 mt-8 text-4xl font-semibold text-[#3B82F6]">
          Login
        </h1>

        <div className="w-full max-w-md space-y-6">
          <input
            type="email"
            placeholder="seuemail@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border-2 border-black px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border-2 border-black px-6 py-4 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Eye className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="text-right">
            <Link
              href="/esqueceu-senha"
              className="text-sm text-gray-700 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 w-full max-w-md">
          <button
            onClick={handleLogin}
            className="w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-400 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            Login
          </button>

          <Link href="/cadastro" className="w-full">
            <button className="w-full rounded-full border-2 border-black bg-white px-12 py-4 text-lg font-semibold transition-colors hover:bg-gray-50">
              Não tenho Conta
            </button>
          </Link>
        </div>
      </div>

      <Navigation backHref="/" />
    </div>
  );
}
