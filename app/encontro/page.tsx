"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

// Tipagens
interface Usuario {
  id?: string;
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
  cidade?: string;
  email?: string;
  senha?: string;
  preferencias?: string[];
}

interface LocalEncontro {
  id: string;
  nome: string;
  endereco: string;
  capacidade: number;
  ativo: boolean;
  imagemUrl?: string;
}

interface EncontroBackend {
  id: string;
  localId: string;
  dataHora: string;
  participantes?: string[];
  minimoPreferenciasIguais?: number;
}

interface Evento {
  id: string;
  localId: string;
  dataHoraISO: string;
  displayDate: string;
  displayTime: string;
  participantes: Usuario[];
  backendId?: string;
}

export default function EncontroPage() {
  const router = useRouter();

  const [locais, setLocais] = useState<LocalEncontro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPrefs, setUsuariosPrefs] = useState<Record<string, string[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLocalId, setSelectedLocalId] = useState<string>("");
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [encontrosBackend, setEncontrosBackend] = useState<EncontroBackend[]>(
    []
  );

  const [busyEncontroIds, setBusyEncontroIds] = useState<
    Record<string, boolean>
  >({});

  // pega id do user logado - VERSÃO MAIS ROBUSTA
  // pega id do user logado - CORRIGIDO
  const loggedUserId = useMemo(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("usuarioId") : null;
      console.log('🔍 DEBUG - usuarioId do localStorage:', raw);

      if (!raw) {
        console.log('❌ Nenhum usuarioId encontrado no localStorage');
        return null;
      }

      // Como você está salvando diretamente o ID como string, não precisa fazer JSON.parse
      return raw;
    } catch {
      return null;
    }
  }, []);

  // gerar datas automáticas (7,9,10 dias)
  function makeEventDates() {
    const base = new Date();
    const addDays = (n: number) => {
      const d = new Date(base);
      d.setDate(base.getDate() + n);
      d.setHours(20, 0, 0, 0);
      return d;
    };
    const days = [7, 9, 10];

    return days.map((d) => {
      const dt = addDays(d);
      return {
        days: d,
        iso: dt.toISOString(),
        displayDate: dt.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
        }),
        displayTime: dt.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }

  // carregamento principal
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        // 1. Locais — AGORA VIA BFF
        try {
          const resLoc = await fetch("http://localhost:8081/bff/locais");
          if (resLoc.ok) {
            const data = await resLoc.json();
            const arr = Array.isArray(data) ? data : [data];
            setLocais(arr);
            setSelectedLocalId(arr[0]?.id ?? "");
          } else {
            throw new Error("Falha ao carregar locais");
          }
        } catch {
          setLocais([
            {
              id: "1",
              nome: "Restaurante Bella Itália",
              endereco: "Rua das Flores, 123",
              capacidade: 20,
              ativo: true,
              imagemUrl: "https://picsum.photos/200",
            },
            {
              id: "2",
              nome: "Hamburgueria Smash House",
              endereco: "Av. Central, 456",
              capacidade: 15,
              ativo: true,
              imagemUrl: "https://picsum.photos/201",
            },
          ]);
          setSelectedLocalId("1");
        }

        // 2. Usuários — VIA BFF
        const resUsers = await fetch("http://localhost:8081/bff/usuarios");
        if (!resUsers.ok) throw new Error("Falha ao carregar usuários");

        const udata = await resUsers.json();
        const usersArray = Array.isArray(udata)
          ? udata
          : udata.items
            ? udata.items
            : [udata];

        setUsuarios(usersArray);

        // CORREÇÃO TEMPORÁRIA NO FRONTEND - apenas para teste
        // 3. Preferências por usuário — CORREÇÃO DA URL
        const prefsMap: Record<string, string[]> = {};

        await Promise.allSettled(
          usersArray.map(async (u: Usuario) => {
            const uid = u.id!;
            try {
              // ENQUANTO O BFF NÃO É CORRIGIDO, podemos testar chamando o .NET diretamente:
              const r = await fetch(`http://localhost:8081/bff/preferencias/usuario/${uid}`);

              if (!r.ok) {
                console.warn(`Erro ${r.status} ao buscar preferências do usuário ${uid}`);
                prefsMap[uid] = [];
                return;
              }

              const prefResp = await r.json();
              console.log(`✅ Resposta do backend .NET para usuário ${uid}:`, prefResp);

              // Processamento normal...
              if (Array.isArray(prefResp)) {
                const preferencias: string[] = [];
                prefResp.forEach((prefObj) => {
                  const camposPreferencia = [
                    'horarioFavorito', 'tipoComidaFavorito', 'preferenciaLocal',
                    'preferenciaAmbiente', 'posicaoPolitica', 'genero',
                    'preferenciaMusical', 'moodFilmesSeries', 'statusRelacionamento',
                    'preferenciaAnimal', 'idiomaPreferido', 'investimentoEncontro', 'fraseDefinicao'
                  ];

                  camposPreferencia.forEach((campo) => {
                    const valor = prefObj[campo];
                    if (valor && typeof valor === 'string' && valor.trim() !== '') {
                      preferencias.push(valor.trim());
                    }
                  });
                });

                prefsMap[uid] = [...new Set(preferencias)];
              } else {
                prefsMap[uid] = [];
              }

            } catch (error) {
              console.error(`Erro ao processar preferências do usuário ${uid}:`, error);
              prefsMap[uid] = [];
            }
          })
        );

        // 4. Encontros — VIA BFF
        try {
          const rE = await fetch("http://localhost:8081/bff/encontros");
          if (rE.ok) {
            const backendEncs = await rE.json();
            setEncontrosBackend(
              Array.isArray(backendEncs) ? backendEncs : [backendEncs]
            );
          }
        } catch { }

        // 5. Criar eventos locais + anexar inscritos vindos do backend
        const dateInfos = makeEventDates();

        const builtEvents: Evento[] = dateInfos.map((di) => {
          const found = (encontrosBackend ?? []).find(
            (eb) =>
              new Date(eb.dataHora).toISOString() === di.iso &&
              eb.localId === selectedLocalId
          );

          let participantesUsers: Usuario[] = [];

          if (found?.participantes) {
            participantesUsers = found.participantes
              .map((pid) => usersArray.find((u: Usuario) => u.id === pid) ?? null)
              .filter((u): u is Usuario => u !== null);
          }

          return {
            id: `auto-${di.days}`,
            localId: selectedLocalId,
            dataHoraISO: di.iso,
            displayDate: di.displayDate,
            displayTime: di.displayTime,
            participantes: participantesUsers,
            backendId: found?.id,
          };
        });

        setEventos(builtEvents);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  // compatibilidade
  function countCompatibles(evento: Evento): number {
    if (!loggedUserId) return 0;
    const loggedPrefs = usuariosPrefs[loggedUserId] ?? [];

    if (loggedPrefs.length === 0) return 0;

    let count = 0;

    evento.participantes.forEach((p) => {
      const pid = p.id!;
      const pPrefs = usuariosPrefs[pid] ?? [];
      const inter = pPrefs.filter((x) => loggedPrefs.includes(x));
      if (inter.length > 0) count++;
    });

    return count;
  }

  function isLotado(ev: Evento) {
    return ev.participantes.length >= 5;
  }

  // Clique "Participar"
  // Clique "Participar" - CORRIGIDO
  async function handleParticipar(evento: Evento) {
    console.log('🔍 DEBUG handleParticipar - usuarioId:', loggedUserId);

    if (!loggedUserId) {
      alert("Você precisa estar logado para participar.");
      return;
    }

    // Como você não está salvando token no login, vamos verificar se tem o usuarioId
    const token = localStorage.getItem("token"); // Isso pode ser null
    console.log('🔍 DEBUG - token:', token);

    if (busyEncontroIds[evento.id]) return;

    setBusyEncontroIds((s) => ({ ...s, [evento.id]: true }));

    try {
      let backendId = evento.backendId;

      // 1. Criar encontro se ainda não existir
      if (!backendId) {
        const payload = {
          localId: selectedLocalId,
          dataHora: evento.dataHoraISO,
          minimoPreferenciasIguais: 0,
        };

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Só adiciona Authorization se tiver token
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const resp = await fetch("http://localhost:8081/bff/encontros", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        });

        if (!resp.ok) throw new Error("Erro ao criar encontro");

        const created = await resp.json();
        backendId = created.id;
      }

      // 2. Inscrever usuário
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const resp2 = await fetch(
        `http://localhost:8081/bff/encontros/${backendId}/participantes/${loggedUserId}`,
        {
          method: "POST",
          headers: headers,
        }
      );

      if (!resp2.ok) throw new Error("Erro ao inscrever no encontro");

      // 3. Atualizar lista local
      const userData = usuarios.find((u) => u.id === loggedUserId) ?? ({ id: loggedUserId } as Usuario);

      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === evento.id
            ? {
              ...ev,
              backendId,
              participantes: [...ev.participantes, userData],
            }
            : ev
        )
      );

      alert("Inscrição realizada com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setBusyEncontroIds((s) => {
        const c = { ...s };
        delete c[evento.id];
        return c;
      });
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Erro: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-8">
      <button onClick={() => router.back()} className="self-start mb-8">
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-12">
          <span className="text-[#4A90E2]">Fala</span>
          <span className="text-[#F5A623]">ê!</span>
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Olá {usuarios.find((u) => u.id === loggedUserId)?.nome ?? "amigo"} 👋
        </h2>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Conheça Pessoas em Blumenau!
        </h3>

        <p className="text-lg font-medium text-gray-900 mb-6">
          Escolha o local do encontro:
        </p>

        <select
          value={selectedLocalId}
          onChange={(e) => setSelectedLocalId(e.target.value)}
          className="border-2 border-gray-900 rounded-full px-4 py-3 mb-6 w-full max-w-sm"
        >
          {locais.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome} – {l.endereco}
            </option>
          ))}
        </select>

        <p className="text-lg font-medium text-gray-900 mb-4">
          Reserve seu próximo evento:
        </p>

        <div className="w-full max-w-md space-y-4">
          {eventos
            .filter((ev) => !isLotado(ev))
            .map((ev) => {
              const compat = countCompatibles(ev);
              const vagas = 5 - ev.participantes.length;

              return (
                <div
                  key={ev.id}
                  className="w-full border-2 border-gray-900 rounded-2xl p-4 flex items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center">
                      <div className="text-white text-2xl">🍽️</div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {ev.displayDate} — {ev.displayTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        {compat > 0
                          ? `${compat} pessoas compatíveis nesse encontro ✨`
                          : "Nenhuma compatibilidade ainda ❤️"}
                      </p>
                      <p className="text-sm text-gray-600">{vagas} vaga(s)</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleParticipar(ev)}
                      className="bg-[#4A90E2] text-white px-4 py-2 rounded-full font-semibold"
                    >
                      Participar
                    </button>

                    <button
                      onClick={() => {
                        const names =
                          ev.participantes
                            .map((p) => p.nome ?? p.email ?? p.id)
                            .join(", ") || "Nenhum participante";
                        alert(`Participantes:\n${names}`);
                      }}
                      className="text-sm underline text-gray-700"
                    >
                      Ver participantes ({ev.participantes.length})
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
