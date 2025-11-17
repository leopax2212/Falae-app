"use client";

import { Logo } from "@/components/logo";
import { GradientButton } from "@/components/gradient-button";
import { Navigation } from "@/components/navigation";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuizContext } from "@/contexts/quiz-context";

export default function Quiz11Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditingPreferences = searchParams.get("edit") === "true";
  const { quizData, updateQuizData, resetQuizData } = useQuizContext();

  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [mantra, setMantra] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedPet || !mantra.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      updateQuizData({
        preferenciaAnimal: selectedPet === "dog" ? "Cachorro" : "Gato",
        fraseDefinicao: mantra,
      });

      const usuarioId = localStorage.getItem("usuarioId") || "";
      const preferenciaId = localStorage.getItem("preferenciaId") || null;

      console.log("preferenciaId carregado:", preferenciaId);
      console.log("edit mode?", isEditingPreferences);

      const completeData = {
        ...quizData,
        preferenciaAnimal: selectedPet === "dog" ? "Cachorro" : "Gato",
        fraseDefinicao: mantra,
        usuarioId,
      };

      // ⬇ Escolhe POST ou PUT + URL correta
      const url =
        isEditingPreferences && preferenciaId
          ? `/api/preferencias/${preferenciaId}`
          : `/api/preferencias`;

      const method = isEditingPreferences ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Falha ao enviar preferências");
      }

      resetQuizData();

      const redirectPath = isEditingPreferences
        ? "/home?message=As preferências foram alteradas"
        : "/home";

      router.push(redirectPath);
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao salvar suas preferências. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 py-12">
        <Logo />

        <div className="mt-8 w-full max-w-md space-y-10">
          <div className="text-center">
            <p className="mb-6 text-xl font-semibold italic">Personalidade.</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">16.Gosta mais de:</h2>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setSelectedPet("dog")}
                className={`flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-black transition-colors ${
                  selectedPet === "dog"
                    ? "bg-gray-500 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="text-6xl">🐕</div>
              </button>

              <span className="text-xl font-bold">OU</span>

              <button
                onClick={() => setSelectedPet("cat")}
                className={`flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-black transition-colors ${
                  selectedPet === "cat"
                    ? "bg-gray-500 text-white"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="text-6xl">🐱</div>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-center text-lg font-bold">
              17.Uma frase que defina você ou que seja seu mantra:
            </h2>

            <div className="relative">
              <textarea
                value={mantra}
                onChange={(e) => setMantra(e.target.value)}
                className="h-32 w-full resize-none rounded-[3rem] border-2 border-dashed border-black px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite aqui sua frase ou mantra pessoal..."
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <GradientButton onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar"}
            </GradientButton>
          </div>
        </div>
      </div>

      <Navigation backHref="/quiz/10" />
    </div>
  );
}
