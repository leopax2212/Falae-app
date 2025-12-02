"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/bottom-navigation";

type Usuario = {
  id: string;
  nome: string;
  email: string;
  cidade: string;
};

type Local = {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
  ativo: boolean;
  imagemUrl: string;
};

type Encontro = {
  id: string;
  localId: string;
  local: Local;
  dataHora: string;
  status: string;
  dataCriacao: string;
  participantes: Usuario[];
  totalParticipantes: number;
};

type MatchingResponse = {
  sucesso: boolean;
  mensagem: string;
  participantesSugeridos: Usuario[];
  preferenciasCompativeis: number;
};

export default function HomePage() {
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [encontro, setEncontro] = useState<Encontro | null>(null);
  const [locais, setLocais] = useState<Local[]>([]);

  useEffect(() => {
    carregarDadosUsuario();
    carregarEncontro();
    carregarLocais();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const token = localStorage.getItem("token");
      const usuarioId = localStorage.getItem("usuarioId");

      if (!token || !usuarioId) {
        console.error("Token ou usuarioId não encontrado");
        return;
      }

      const response = await fetch(
        `http://localhost:8081/bff/usuarios/${usuarioId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        const usuarioData = await response.json();
        setUsuario(usuarioData);
      } else {
        // Fallback para dados do localStorage
        const usuarioLocal = localStorage.getItem("usuario");
        if (usuarioLocal) {
          setUsuario(JSON.parse(usuarioLocal));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      // Fallback para dados do localStorage
      const usuarioLocal = localStorage.getItem("usuario");
      if (usuarioLocal) {
        setUsuario(JSON.parse(usuarioLocal));
      }
    }
  };

  const carregarLocais = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token não encontrado");
        return;
      }

      const response = await fetch("http://localhost:8081/bff/locais", {
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const locaisData = await response.json();
        console.log("🏢 Locais carregados:", locaisData);
        setLocais(locaisData);
      } else {
        console.error("Erro ao carregar locais:", response.status);
      }
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
    }
  };

  const carregarEncontro = async () => {
    try {
      const token = localStorage.getItem("token");
      const usuarioId = localStorage.getItem("usuarioId");

      if (!token || !usuarioId) {
        return;
      }

      const response = await fetch(
        `http://localhost:8081/bff/encontros/usuario/${usuarioId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        const encontros = await response.json();

        if (Array.isArray(encontros) && encontros.length > 0) {
          setEncontro(encontros[0]); // pega o primeiro encontro
        } else {
          setEncontro(null); // não tem encontro → não exibir card
        }
      }
    } catch (error) {
      console.error("Erro ao carregar encontro:", error);
    }
  };

  const getProximosFinaisDeSemana = () => {
    const hoje = new Date();
    const diasParaSabado = (6 - hoje.getDay() + 7) % 7 || 7;
    const diasParaDomingo = (7 - hoje.getDay() + 7) % 7 || 7;

    const sabado = new Date(hoje);
    sabado.setDate(hoje.getDate() + diasParaSabado);
    sabado.setHours(20, 0, 0, 0);

    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() + diasParaDomingo);
    domingo.setHours(16, 0, 0, 0);

    return [
      {
        label: `Sábado ${sabado.toLocaleDateString("pt-BR")} 20:00`,
        value: sabado.toISOString(),
      },
      {
        label: `Domingo ${domingo.toLocaleDateString("pt-BR")} 16:00`,
        value: domingo.toISOString(),
      },
    ];
  };

  const handleCriarEncontro = async () => {
    if (!selectedDate) {
      alert("Por favor, selecione uma data");
      return;
    }

    if (locais.length === 0) {
      alert("Nenhum local disponível. Tente novamente mais tarde.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const usuarioId = localStorage.getItem("usuarioId");

      if (!token || !usuarioId) {
        alert("Usuário não autenticado");
        return;
      }

      console.log("🔑 Token:", token);
      console.log("👤 Usuario ID:", usuarioId);
      console.log("📅 Data selecionada:", selectedDate);

      // Escolher um local aleatório da lista de locais ativos
      const locaisAtivos = locais.filter((local) => local.ativo);
      if (locaisAtivos.length === 0) {
        alert("Nenhum local ativo disponível");
        return;
      }

      const localAleatorio =
        locaisAtivos[Math.floor(Math.random() * locaisAtivos.length)];
      console.log("🏢 Local escolhido:", localAleatorio);

      // CORREÇÃO: Payload corrigido conforme seu exemplo
      const matchingPayload = {
        localId: localAleatorio.id,
        dataHora: selectedDate,
        minimoPreferenciasIguais: 3,
        numeroParticipantes: 4,
      };

      console.log("📤 Payload do matching:", matchingPayload);

      // Fazer o matching
      const matchingResponse = await fetch(
        "http://localhost:8081/bff/encontros/matching",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchingPayload),
        }
      );

      console.log("📥 Response status:", matchingResponse.status);

      if (!matchingResponse.ok) {
        const errorText = await matchingResponse.text();
        console.error("❌ Erro no matching:", errorText);
        throw new Error(
          `Erro no matching: ${matchingResponse.status} - ${errorText}`
        );
      }

      const matchingData: MatchingResponse = await matchingResponse.json();
      console.log("✅ Matching response:", matchingData);

      if (!matchingData.sucesso) {
        alert(matchingData.mensagem || "Não foi possível fazer o matching");
        return;
      }

      // CORREÇÃO: Usar o endpoint que cria o encontro diretamente
      const criarPayload = {
        localId: localAleatorio.id,
        dataHora: selectedDate,
        minimoPreferenciasIguais: 3,
      };

      console.log("📤 Payload de criação:", criarPayload);

      const criarResponse = await fetch("http://localhost:8081/bff/encontros", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(criarPayload),
      });

      console.log("📥 Response status criação:", criarResponse.status);

      if (!criarResponse.ok) {
        const errorText = await criarResponse.text();
        console.error("❌ Erro ao criar encontro:", errorText);
        throw new Error(
          `Erro ao criar encontro: ${criarResponse.status} - ${errorText}`
        );
      }

      const encontroCriado = await criarResponse.json();
      console.log("✅ Encontro criado:", encontroCriado);

      // Adicionar o usuário logado como participante
      const encontroId = encontroCriado.id;

      const addParticipanteResponse = await fetch(
        `http://localhost:8081/bff/encontros/${encontroId}/participantes/${usuarioId}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (addParticipanteResponse.ok) {
        setMessage("Oba! Deu Match");
        setShowMessage(true);
        setShowModal(false);
        setSelectedDate("");

        // Recarregar o encontro
        await carregarEncontro();

        setTimeout(() => setShowMessage(false), 3000);
      } else {
        const errorText = await addParticipanteResponse.text();
        throw new Error(
          `Erro ao adicionar participante: ${addParticipanteResponse.status} - ${errorText}`
        );
      }
    } catch (error: any) {
      console.error("❌ Erro ao criar encontro:", error);
      alert(error.message || "Erro ao criar encontro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarEncontro = async () => {
    if (!encontro) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado");
        return;
      }

      const response = await fetch(
        `http://localhost:8081/bff/encontros/${encontro.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        setMessage("Que pena!");
        setShowMessage(true);
        setEncontro(null);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        const errorText = await response.text();
        throw new Error(`Erro ao cancelar: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      console.error("Erro ao cancelar encontro:", error);
      alert(error.message || "Erro ao cancelar encontro. Tente novamente.");
    }
  };

  const formatarDataHora = (dataHora: string) => {
    const data = new Date(dataHora);
    return {
      data: data.toLocaleDateString("pt-BR"),
      hora: data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const opcoesData = getProximosFinaisDeSemana();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        <h1 className="text-5xl font-bold mb-8">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-12">
          Olá {usuario?.nome || "Usuário"} 👋
        </h2>

        {encontro ? (
          <div className="w-full max-w-sm space-y-6">
            <div className="border-2 border-gray-900 rounded-2xl overflow-hidden">
              <div className="bg-white px-4 py-3 text-center border-b-2 border-gray-900">
                <h3 className="font-bold text-gray-900 text-sm">
                  ENCONTRO MARCADO
                </h3>
              </div>

              <div className="bg-white p-4 flex items-start gap-4">
                <div className="w-16 h-16 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-white text-3xl">🍽️</div>
                </div>

                <div className="flex-1 pt-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Encontro Social
                  </h4>
                  <p className="text-sm text-gray-700">
                    {formatarDataHora(encontro.dataHora).data}
                  </p>
                  <p className="text-sm text-gray-700 font-semibold mt-2">
                    {formatarDataHora(encontro.dataHora).hora}
                  </p>
                  <p className="text-sm text-gray-700">
                    {encontro.local?.endereco || "Local a definir"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {encontro.totalParticipantes} participantes
                  </p>
                </div>
              </div>

              <div className="flex border-t-2 border-gray-900">
                <button
                  onClick={handleCancelarEncontro}
                  className="flex-1 bg-[#F5A623] text-gray-900 font-bold py-3 text-sm border-r border-gray-900 hover:bg-[#e69515] transition-colors"
                >
                  CANCELAR
                </button>
                <button className="flex-1 bg-[#4A90E2] text-white font-bold py-3 text-sm hover:bg-[#3a7bc8] transition-colors">
                  CONFIRMAR
                </button>
              </div>
            </div>

            <button
              disabled
              className="w-full border-2 border-gray-900 rounded-full py-4 font-bold text-gray-500 bg-gray-100 cursor-not-allowed"
            >
              NOVO ENCONTRO
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <button
              onClick={() => setShowModal(true)}
              className="w-full border-2 border-gray-900 rounded-full py-4 font-bold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              NOVO ENCONTRO
            </button>
          </div>
        )}
      </div>

      {showMessage && (
        <div className="fixed top-4 left-4 right-4 bg-green-100 border-2 border-green-500 rounded-lg p-4 text-green-800 font-semibold text-center">
          {message}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-8 w-full max-w-lg shadow-xl animate-slide-up">
            <h3 className="text-center font-semibold text-gray-900 mb-2 text-lg">
              Escolha a data que você prefere e veja a mágica acontecer
            </h3>

            <div className="space-y-3 my-6">
              {opcoesData.map((opcao) => (
                <button
                  key={opcao.value}
                  onClick={() => setSelectedDate(opcao.value)}
                  className={`w-full border-2 rounded-full py-4 font-semibold transition-colors ${
                    selectedDate === opcao.value
                      ? "border-[#4A90E2] bg-blue-50 text-[#4A90E2]"
                      : "border-gray-900 text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {opcao.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCriarEncontro}
                disabled={loading || !selectedDate || locais.length === 0}
                className="w-full bg-[#4A90E2] text-white font-bold py-4 rounded-full hover:bg-[#3a7bc8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Criando..." : "Criar"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full border-2 border-gray-900 rounded-full py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
