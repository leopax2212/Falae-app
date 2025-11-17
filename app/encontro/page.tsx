"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

// Tipagens simples
interface Usuario {
  id?: string;
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
  cidade?: string;
  email?: string;
  senha?: string;
  preferencias?: string[]; // opcional localmente
}

interface PreferenciasResp {
  preferencias: string[] | string[]; // se seu endpoint devolver só array, ajuste
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
  participantes?: string[]; // array de usuarioId
  minimoPreferenciasIguais?: number;
}

interface Evento {
  id: string; // local id ou "auto-<dias>"
  localId: string;
  dataHoraISO: string;
  displayDate: string;
  displayTime: string;
  participantes: Usuario[]; // participantes completos (obj Usuario)
  backendId?: string; // se existir ja criado no backend
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

  // pega id do usuário logado (assumo localStorage 'user' com campo id)
  const loggedUserId = useMemo(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.id ?? parsed?.userId ?? null;
    } catch {
      return null;
    }
  }, []);

  // Datas: hoje + 7, +9, +10 dias às 20:00 (dinâmico)
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
      const iso = dt.toISOString();
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
      };
      const displayDate = dt.toLocaleDateString("pt-BR", options);
      const displayTime = dt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { days: d, iso, displayDate, displayTime };
    });
  }

  // Carrega tudo no mount
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        // 1) locais (mock por enquanto)
        try {
          const resLoc = await fetch(
            "http://localhost:5245/api/LocaisEncontro"
          );
          if (resLoc.ok) {
            const data = await resLoc.json();
            // suportar array ou objeto
            setLocais(Array.isArray(data) ? data : [data]);
            if ((Array.isArray(data) ? data : [data]).length > 0) {
              setSelectedLocalId(
                ((Array.isArray(data) ? data : [data])[0] as LocalEncontro)
                  .id ?? ""
              );
            }
          } else {
            // fallback: locais estáticos
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

        // 2) usuarios
        const resUsers = await fetch("http://localhost:8081/bff/usuarios");
        if (!resUsers.ok) throw new Error("Falha ao carregar usuários.");
        let udata = await resUsers.json();
        // lidar com retorno único ou array
        let usersArray: Usuario[] = [];
        if (Array.isArray(udata)) usersArray = udata;
        else if (udata && typeof udata === "object") {
          // às vezes o backend envia um objeto wrapper
          if (udata.items && Array.isArray(udata.items))
            usersArray = udata.items;
          else usersArray = [udata];
        }
        setUsuarios(usersArray);

        // 3) buscar preferencias de cada usuario (paralelo)
        const prefsMap: Record<string, string[]> = {};
        await Promise.allSettled(
          usersArray.map(async (u) => {
            const uid = u.id ?? u.email ?? u.cpf ?? JSON.stringify(u); // fallback id
            try {
              const r = await fetch(
                `http://localhost:5245/api/Preferencias/usuario/${uid}`
              );
              if (!r.ok) {
                prefsMap[uid] = u.preferencias ?? [];
                return;
              }
              const p = await r.json();
              // caso endpoint retorne array diretamente
              if (Array.isArray(p)) prefsMap[uid] = p;
              else if (p && (p.preferencias || p.data))
                prefsMap[uid] = p.preferencias ?? p.data ?? [];
              else prefsMap[uid] = [];
            } catch {
              prefsMap[uid] = u.preferencias ?? [];
            }
          })
        );
        setUsuariosPrefs(prefsMap);

        // 4) buscar encontros no backend (se existir)
        try {
          const rE = await fetch("http://localhost:5245/api/Encontros");
          if (rE.ok) {
            const backendEncs = await rE.json();
            setEncontrosBackend(
              Array.isArray(backendEncs) ? backendEncs : [backendEncs]
            );
          }
        } catch {
          // sem encontros no backend -> ok, vamos criar localmente
        }

        // 5) criar eventos locais (7,9,10 dias) e vincular participantes caso backend tenha encontros com mesma data/local
        const dateInfos = makeEventDates();
        const builtEvents: Evento[] = dateInfos.map((di, idx) => {
          // tentar achar encontro backend com mesma data (mesmo iso) para anexar participantes
          const found = (encontrosBackend ?? []).find((eb) => {
            try {
              // comparar datas simplificadas
              return (
                new Date(eb.dataHora).toISOString() ===
                new Date(di.iso).toISOString()
              );
            } catch {
              return false;
            }
          });

          const participantsUsers: Usuario[] = [];
          if (
            found &&
            found.participantes &&
            Array.isArray(found.participantes)
          ) {
            // mapear ids -> usuarios completos (se achados)
            found.participantes.forEach((pid) => {
              const u = usersArray.find(
                (uu) => uu.id === pid || uu.email === pid || uu.cpf === pid
              );
              if (u) participantsUsers.push(u);
            });
          }

          return {
            id: `auto-${di.days}`,
            localId: selectedLocalId || (locais[0] && locais[0].id) || "1",
            dataHoraISO: di.iso,
            displayDate: di.displayDate,
            displayTime: di.displayTime,
            participantes: participantsUsers,
            backendId: found?.id,
          };
        });

        setEventos(builtEvents);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recalcula compatíveis para o user logado dentro de um evento
  function countCompatibles(evento: Evento): number {
    if (!loggedUserId) return 0;
    // preferências do logado
    const loggedPrefs = usuariosPrefs[loggedUserId] ?? [];
    if (!loggedPrefs || loggedPrefs.length === 0) {
      // sem prefs do logado: não conseguimos determinar, mostrar 0
      return 0;
    }
    let count = 0;
    evento.participantes.forEach((p) => {
      const pid = p.id ?? p.email ?? p.cpf ?? "";
      const pPrefs = usuariosPrefs[pid] ?? [];
      const intersection = pPrefs.filter((x) => loggedPrefs.includes(x));
      if (intersection.length > 0) count++;
    });
    return count;
  }

  // checa se evento está lotado (>=5)
  function isLotado(evento: Evento) {
    return evento.participantes.length >= 5;
  }

  // Quando usuário clicar para participar
  async function handleParticipar(evento: Evento) {
    if (!loggedUserId) {
      alert("Você precisa estar logado para participar.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado — precisa logar novamente.");
      return;
    }

    if (busyEncontroIds[evento.id]) return;
    setBusyEncontroIds((s) => ({ ...s, [evento.id]: true }));

    try {
      let backendId = evento.backendId;

      // 1. Criar encontro no backend, via BFF
      if (!backendId) {
        const payload = {
          localId: evento.localId,
          dataHora: evento.dataHoraISO,
          minimoPreferenciasIguais: 0,
        };

        const createResp = await fetch("http://localhost:8081/bff/encontros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!createResp.ok) throw new Error("Falha ao criar encontro");

        const created = await createResp.json();
        backendId = created?.id ?? created?.data?.id;
        setEncontrosBackend((s) => [...s, created]);
      }

      // 2. Inscrever usuário no encontro via BFF
      const inscricaoResp = await fetch(
        `http://localhost:8081/bff/encontros/${backendId}/participantes/${loggedUserId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!inscricaoResp.ok) throw new Error("Falha ao inscrever no encontro.");

      // 3. Atualizar lista local
      setEventos((prev) =>
        prev.map((ev) => {
          if (ev.backendId === backendId || ev.id === evento.id) {
            const already = ev.participantes.some((p) => p.id === loggedUserId);
            if (already) return ev;

            const u = usuarios.find((uu) => uu.id === loggedUserId) ?? {
              id: loggedUserId,
              nome: "Você",
            };

            return {
              ...ev,
              participantes: [...ev.participantes, u],
              backendId,
            };
          }
          return ev;
        })
      );

      alert("Inscrição realizada com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao participar: " + err.message);
    } finally {
      setBusyEncontroIds((s) => {
        const copy = { ...s };
        delete copy[evento.id];
        return copy;
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando encontros e usuários...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Erro: {error}</p>
      </div>
    );
  }

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
            .map((ev) => ({ ...ev, localId: selectedLocalId || ev.localId }))
            .filter((ev) => !isLotado(ev)) // esconde lotados
            .map((ev) => {
              const compat = countCompatibles(ev);
              const vagas = 5 - ev.participantes.length;
              return (
                <div
                  key={ev.id}
                  className="w-full border-2 border-gray-900 rounded-2xl p-4 flex items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-white text-2xl">🍽️</div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {ev.displayDate} — {ev.displayTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        {compat > 0
                          ? `${compat} pessoas compatíveis estão nesse encontro ✨`
                          : "Nenhuma compatibilidade encontrada — ainda assim você pode participar ❤️"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {vagas} vaga(s) restante(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() =>
                        handleParticipar({ ...ev, localId: selectedLocalId })
                      }
                      disabled={busyEncontroIds[ev.id]}
                      className="bg-[#4A90E2] text-white px-4 py-2 rounded-full font-semibold hover:opacity-95 disabled:opacity-60"
                    >
                      Participar
                    </button>

                    <button
                      onClick={() => {
                        // mostrar modal simples com participantes
                        const names =
                          ev.participantes
                            .map((p) => p.nome ?? p.email ?? p.id)
                            .join(", ") || "Nenhum participante ainda";
                        alert(`Participantes:\n${names}`);
                      }}
                      className="text-sm text-gray-700 underline"
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
