"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  participantes?: Usuario[] | string[];
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
  const [usuarioEncontroId, setUsuarioEncontroId] = useState<string | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // pega id do user logado
  const loggedUserId = useMemo(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("usuarioId")
          : null;
      if (!raw) return null;
      return raw;
    } catch {
      return null;
    }
  }, []);

  // token (opcional)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // refs para armazenar valores atuais e evitar dependências instáveis
  const usuariosRef = useRef<Usuario[]>([]);
  const tokenRef = useRef<string | null>(token);
  const loggedUserIdRef = useRef<string | null>(loggedUserId);
  const selectedLocalIdRef = useRef<string>(selectedLocalId);
  const eventosRef = useRef<Evento[]>([]);
  const encontrosBackendRef = useRef<EncontroBackend[]>([]);

  // sincroniza refs sempre que o state muda
  useEffect(() => {
    usuariosRef.current = usuarios;
  }, [usuarios]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    loggedUserIdRef.current = loggedUserId;
  }, [loggedUserId]);

  useEffect(() => {
    selectedLocalIdRef.current = selectedLocalId;
  }, [selectedLocalId]);

  useEffect(() => {
    eventosRef.current = eventos;
  }, [eventos]);

  useEffect(() => {
    encontrosBackendRef.current = encontrosBackend;
  }, [encontrosBackend]);

  // Verifica se usuário já tem encontro ao carregar a página
  useEffect(() => {
    if (usuarioEncontroId) {
      console.log("Usuário já tem encontro, redirecionando para home...");
      router.push("/home");
    }
  }, [usuarioEncontroId, router]);

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

  // =========================
  // Função: carregar encontros do BFF
  // =========================
  const carregarEncontros = useCallback(async (localId?: string) => {
    try {
      const currentToken = tokenRef.current;
      const currentLoggedUserId = loggedUserIdRef.current;
      const currentUsuarios = usuariosRef.current;
      const headers: HeadersInit = {};
      if (currentToken) headers.Authorization = currentToken;

      const rE = await fetch("http://localhost:8081/bff/encontros", {
        headers,
      });

      if (!rE.ok) {
        console.warn("Falha ao carregar encontros do BFF");
        setEncontrosBackend([]);
        setEventos([]);
        setUsuarioEncontroId(null);
        return;
      }

      const backendEncsRaw = await rE.json();
      const backendEncsArray: EncontroBackend[] = Array.isArray(backendEncsRaw)
        ? backendEncsRaw
        : [backendEncsRaw];

      setEncontrosBackend(backendEncsArray);
      encontrosBackendRef.current = backendEncsArray;

      // Descobre se loggedUser já está em algum encontro (backendId)
      if (currentLoggedUserId) {
        const encontroDoUsuario = backendEncsArray.find((eb) => {
          if (!eb.participantes) return false;
          return eb.participantes.some((p: any) =>
            typeof p === "string"
              ? p === currentLoggedUserId
              : p.id === currentLoggedUserId
          );
        });

        setUsuarioEncontroId(encontroDoUsuario ? encontroDoUsuario.id : null);
      } else {
        setUsuarioEncontroId(null);
      }

      // Reconstrói eventos
      const useLocal = localId ?? selectedLocalIdRef.current;
      const dateInfos = makeEventDates();

      const builtEvents: Evento[] = dateInfos.map((di) => {
        const found = backendEncsArray.find(
          (eb) =>
            new Date(eb.dataHora).toISOString() === di.iso &&
            eb.localId === useLocal
        );

        const localSaved = eventosRef.current.find(
          (ev) => ev.dataHoraISO === di.iso
        );

        let participantesUsers: Usuario[] = [];

        if (found?.participantes) {
          participantesUsers = found.participantes
            .map((pidOrObj: any) => {
              if (!pidOrObj) return null;
              if (typeof pidOrObj === "string") {
                return (
                  currentUsuarios.find((u) => u.id === pidOrObj) ??
                  ({ id: pidOrObj } as Usuario)
                );
              }
              return (
                currentUsuarios.find((u) => u.id === pidOrObj.id) ??
                (pidOrObj as Usuario)
              );
            })
            .filter((u): u is Usuario => u !== null);
        }

        if (
          localSaved &&
          localSaved.participantes.length > participantesUsers.length
        ) {
          participantesUsers = localSaved.participantes;
        }

        return {
          id: `auto-${di.days}`,
          localId: useLocal ?? "",
          dataHoraISO: di.iso,
          displayDate: di.displayDate,
          displayTime: di.displayTime,
          participantes: participantesUsers,
          backendId: found?.id ?? localSaved?.backendId,
        };
      });

      setEventos(builtEvents);
    } catch (e: any) {
      console.error("Erro em carregarEncontros:", e);
    }
  }, []);

  // carregamento principal
  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      try {
        // 1. Locais — VIA BFF
        try {
          const resLoc = await fetch("http://localhost:8081/bff/locais");
          if (resLoc.ok) {
            const data = await resLoc.json();
            const arr = Array.isArray(data) ? data : [data];
            if (!mounted) return;
            setLocais(arr);
            setSelectedLocalId((prev) => prev ?? arr[0]?.id ?? "");
          } else {
            throw new Error("Falha ao carregar locais");
          }
        } catch {
          if (!mounted) return;
          // Mock fixo com restaurante já definido
          setLocais([
            {
              id: "1",
              nome: "Restaurante Bella Itália",
              endereco: "Rua das Flores, 123 - Centro, Blumenau",
              capacidade: 20,
              ativo: true,
              imagemUrl: "https://picsum.photos/200",
            },
          ]);
          setSelectedLocalId((prev) => prev ?? "1");
        }

        // 2. Usuários — VIA BFF
        try {
          const resUsers = await fetch("http://localhost:8081/bff/usuarios");
          if (!resUsers.ok) throw new Error("Falha ao carregar usuários");

          const udata = await resUsers.json();
          const usersArray = Array.isArray(udata)
            ? udata
            : udata.items
            ? udata.items
            : [udata];

          if (!mounted) return;
          setUsuarios(usersArray);
          usuariosRef.current = usersArray;
        } catch (e) {
          console.warn("Erro carregando usuarios:", e);
          if (!mounted) return;
          setUsuarios([]);
          usuariosRef.current = [];
        }

        // 3. Preferências por usuário
        const prefsMap: Record<string, string[]> = {};
        setUsuariosPrefs(prefsMap);

        // 4. Encontros
        await carregarEncontros();
      } catch (e: any) {
        console.error(e);
        if (!mounted) return;
        setError(e.message ?? "Erro desconhecido");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, [carregarEncontros]);

  // Polling para atualizar lista de encontros a cada 5s
  useEffect(() => {
    const iv = setInterval(() => {
      carregarEncontros();
    }, 5000);

    return () => clearInterval(iv);
  }, [carregarEncontros]);

  // Quando trocar o local selecionado, recarrega encontros
  useEffect(() => {
    if (!selectedLocalId) return;
    selectedLocalIdRef.current = selectedLocalId;
    carregarEncontros(selectedLocalId);
  }, [selectedLocalId, carregarEncontros]);

  // compatibilidade
  function countCompatibles(evento: Evento): number {
    if (!loggedUserId) return 0;
    const loggedPrefs = usuariosPrefs[loggedUserId] ?? [];

    if (loggedPrefs.length === 0) return 0;

    let count = 0;

    evento.participantes.forEach((p) => {
      if (p.id === loggedUserId) return; // não contar a si mesmo
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

  // =========================
  // Função: participar (POST)
  // =========================
  async function handleParticipar(evento: Evento) {
    console.log("🔍 DEBUG handleParticipar - usuarioId:", loggedUserId);

    if (!loggedUserId) {
      alert("Você precisa estar logado para participar.");
      return;
    }

    if (busyEncontroIds[evento.id]) return;
    setBusyEncontroIds((s) => ({ ...s, [evento.id]: true }));

    try {
      const headersBase: HeadersInit = {};
      if (token) headersBase.Authorization = token;
      headersBase["Content-Type"] = "application/json";

      let backendId: string | undefined = evento.backendId;

      // 0. Se usuário já participa deste encontro
      if (evento.participantes.some((p) => p.id === loggedUserId)) {
        setBusyEncontroIds((s) => {
          const c = { ...s };
          delete c[evento.id];
          return c;
        });
        alert("Você já está inscrito neste encontro.");
        return;
      }

      // 1. Se usuário está em outro encontro, remover dele primeiro
      if (usuarioEncontroId && usuarioEncontroId !== backendId) {
        const respRem = await fetch(
          `http://localhost:8081/bff/encontros/${usuarioEncontroId}/participantes/${loggedUserId}`,
          {
            method: "DELETE",
            headers: token ? { Authorization: token } : {},
          }
        );
        if (!respRem.ok) {
          console.warn("Falha ao remover inscrição do encontro anterior");
        } else {
          setEventos((prev) =>
            prev.map((ev) =>
              ev.backendId === usuarioEncontroId
                ? {
                    ...ev,
                    participantes: ev.participantes.filter(
                      (p) => p.id !== loggedUserId
                    ),
                  }
                : ev
            )
          );
          setUsuarioEncontroId(null);
        }
      }

      // 2. Criar encontro se ainda não existir
      if (!backendId) {
        const payload = {
          localId: selectedLocalId,
          dataHora: evento.dataHoraISO,
          minimoPreferenciasIguais: 0,
        };

        const resp = await fetch("http://localhost:8081/bff/encontros", {
          method: "POST",
          headers: headersBase,
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(txt || "Erro ao criar encontro");
        }

        const created = await resp.json();
        backendId = created.id;
      }

      // 3. Inscrever usuário no encontro alvo
      const resp2 = await fetch(
        `http://localhost:8081/bff/encontros/${backendId}/participantes/${loggedUserId}`,
        {
          method: "POST",
          headers: token ? { Authorization: token } : {},
        }
      );

      if (!resp2.ok) {
        const txt = await resp2.text();
        try {
          const j = JSON.parse(txt);
          throw new Error(j.message ?? j.error ?? txt);
        } catch {
          throw new Error(txt || "Erro ao inscrever no encontro");
        }
      }

      // 4. Atualiza estado local
      const currentUsuarios = usuariosRef.current;
      const userData =
        currentUsuarios.find((u) => u.id === loggedUserId) ??
        ({ id: loggedUserId, nome: "Você" } as Usuario);

      setEventos((prev) =>
        prev.map((ev) => {
          const matchByBackend =
            backendId != null && ev.backendId === backendId;
          const matchByLocalId = ev.id === evento.id;
          if (matchByBackend || matchByLocalId) {
            if (ev.participantes.some((p) => p.id === userData.id)) return ev;
            return {
              ...ev,
              backendId: backendId ?? ev.backendId,
              participantes: [...ev.participantes, userData],
            };
          }
          return ev;
        })
      );

      eventosRef.current = eventosRef.current.map((ev) => {
        const matchByBackend = backendId != null && ev.backendId === backendId;
        const matchByLocalId = ev.id === evento.id;
        if (matchByBackend || matchByLocalId) {
          if (ev.participantes.some((p) => p.id === userData.id)) return ev;
          return {
            ...ev,
            backendId: backendId ?? ev.backendId,
            participantes: [...ev.participantes, userData],
          };
        }
        return ev;
      });

      setUsuarioEncontroId(backendId ?? null);

      // Mostra modal de sucesso ao invés de alert
      // Mostra modal de sucesso e redireciona para home após um tempo
      setShowSuccessModal(true);

      // Atualiza os dados imediatamente antes do redirecionamento
      await carregarEncontros();

      // Redireciona para home após 2 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/home");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Erro ao participar");
    } finally {
      setBusyEncontroIds((s) => {
        const c = { ...s };
        delete c[evento.id];
        return c;
      });
    }
  }

  // =========================
  // RENDER
  // =========================
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

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Olá {usuarios.find((u) => u.id === loggedUserId)?.nome ?? "amigo"} 👋
        </h2>

        <p className="text-lg font-medium text-gray-900 mb-6">
          Escolha a data do seu encontro:
        </p>

        {/* Local fixo - não mais selecionável */}
        <div className="border-2 border-gray-900 rounded-full px-4 py-3 mb-6 w-full max-w-sm text-center bg-gray-50">
          <p className="font-semibold">Restaurante Bella Itália</p>
          <p className="text-sm text-gray-600">
            Rua das Flores, 123 - Centro, Blumenau
          </p>
        </div>

        <p className="text-lg font-medium text-gray-900 mb-4">
          Reserve seu próximo evento:
        </p>

        <div className="w-full max-w-md space-y-4">
          {eventos
            .filter((ev) => !isLotado(ev))
            .map((ev) => {
              const compat = countCompatibles(ev);
              const vagas = 5 - ev.participantes.length;

              const usuarioJaAqui =
                !!loggedUserId &&
                ev.participantes.some((p) => p.id === loggedUserId);

              const usuarioEmOutro =
                !!usuarioEncontroId &&
                usuarioEncontroId !== ev.backendId &&
                usuarioEncontroId !== null;

              const disabledBecauseOther = !usuarioJaAqui && usuarioEmOutro;
              const disabledBecauseBusy = busyEncontroIds[ev.id] ?? false;
              const buttonDisabled =
                disabledBecauseOther || disabledBecauseBusy;

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
                      <p className="text-sm text-gray-600 font-medium mt-1">
                        Local: Restaurante Bella Itália
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!usuarioJaAqui && (
                      <button
                        onClick={() => handleParticipar(ev)}
                        disabled={buttonDisabled}
                        className={`text-white px-4 py-2 rounded-full font-semibold ${
                          buttonDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#4A90E2]"
                        }`}
                      >
                        {disabledBecauseOther
                          ? "Você já está em outro encontro"
                          : disabledBecauseBusy
                          ? "Aguarde..."
                          : "Participar"}
                      </button>
                    )}

                    {usuarioJaAqui && (
                      <div className="text-sm text-green-700 font-semibold">
                        Inscrito
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inscrição Realizada!
              </h3>
              <p className="text-gray-600 mb-6">
                Você foi inscrito no encontro com sucesso. Aguarde a confirmação
                dos outros participantes.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/home");
                }}
                className="w-full bg-[#4A90E2] text-white rounded-full py-3 font-semibold hover:bg-[#3a80d2] transition-colors"
              >
                Voltar para Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}