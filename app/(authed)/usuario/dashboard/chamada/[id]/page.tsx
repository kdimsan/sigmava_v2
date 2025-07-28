"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Users,
  Clock,
  User,
} from "lucide-react";
import {
  initializeClientForCalls,
  hangUpCall,
  getUserMedia,
  toggleAudio,
  toggleVideo,
  isCallActive,
  acceptCall,
  rejectCall,
} from "@/services/qb-call";

type VideoServiceData = {
  id: number;
  client_name: string;
  subject: string;
  datetime: string;
  user_qb_id: number;
  client_id: string;
  client_email: string;
  admin_email: string;
  admin_qb_id: number;
};

export default function UserVideoCallPage() {
  const [callData, setCallData] = useState<VideoServiceData | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState("Carregando...");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [isWaitingForAdmin, setIsWaitingForAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const params = useParams();
  const videoId = params?.id;

  // 🔄 Buscar dados do Supabase (cliente)
  useEffect(() => {
    const fetchCall = async () => {
      console.log("Buscando dados da chamada para cliente...");

      const supabase = createClient();

      // Buscar dados do serviço de vídeo
      const { data: videoData, error: videoError } = await supabase
        .from("video_services")
        .select("*")
        .eq("id", videoId)
        .single();

      if (videoError || !videoData) {
        console.error("Erro ao buscar dados da chamada:", videoError);
        setError("Erro ao carregar dados da chamada");
        return;
      }

      // Buscar dados do cliente
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("email, name")
        .eq("id", videoData.client_id)
        .single();

      if (clientError || !clientData) {
        console.error("Erro ao buscar dados do cliente:", clientError);
        setError("Erro ao buscar dados do cliente");
        return;
      }

      // Buscar dados do admin/owner
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", videoData.owner_id)
        .single();

      if (profileError || !profileData) {
        console.error("Erro ao buscar email do admin:", profileError);
        setError("Erro ao buscar dados do administrador");
        return;
      }

      setCallData({
        ...videoData,
        client_email: clientData.email,
        client_name: clientData.name || videoData.client_name,
        admin_email: profileData.email,
        admin_qb_id: videoData.user_qb_id,
      });

      setCallStatus("Dados carregados com sucesso");
    };

    if (videoId) fetchCall();
  }, [videoId]);

  // Verificar status da chamada periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      const callActive = isCallActive();
      if (callActive !== isInCall) {
        setIsInCall(callActive);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isInCall]);

  // Inicializar cliente QuickBlox
  useEffect(() => {
    const initializeClient = async () => {
      if (!callData || isInitialized) return;

      try {
        setCallStatus("Iniciando câmera...");
        // Primeiro obter acesso à câmera
        await getUserMedia(localVideoRef);

        setCallStatus("Conectando ao servidor...");
        // Depois inicializar QuickBlox com callback para chamadas recebidas
        await initializeClientForCalls(
          callData.client_email,
          localVideoRef,
          remoteVideoRef,
          handleIncomingCall
        );

        setIsInitialized(true);
        setCallStatus("Aguardando chamada do administrador...");
        setIsWaitingForAdmin(true);
        
        console.log("Cliente inicializado com sucesso!");
      } catch (error) {
        console.error("Erro ao inicializar cliente:", error);
        setError("Erro ao conectar. Verifique sua câmera e microfone.");
        setCallStatus("Erro na inicialização");
      }
    };

    initializeClient();
  }, [callData, isInitialized]);

  // Callback chamado quando uma chamada é recebida
  /*
    O que eu acho que está acontecendo: não consigo resgatar a mesma session de quando é criada
    pelo admin, então acaba não chamando pelo user...
  */
  const handleIncomingCall = (session: any) => {
    console.log("=== CALLBACK: CHAMADA RECEBIDA ===", session);
    setIncomingCall(session);
    setCallStatus("Chamada recebida do administrador");
    setIsWaitingForAdmin(false);
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) {
      console.error("Nenhuma chamada para aceitar");
      return;
    }

    setIsLoading(true);
    setError("");
    setCallStatus("Aceitando chamada...");

    try {
      console.log("Aceitando chamada...");
      await acceptCall(incomingCall, localVideoRef, remoteVideoRef);
      
      setIsInCall(true);
      setIncomingCall(null);
      setIsWaitingForAdmin(false);
      setCallStatus("Chamada conectada");
      
      console.log("Chamada aceita com sucesso!");
    } catch (error) {
      console.error("Erro ao aceitar chamada:", error);
      setError("Erro ao aceitar chamada");
      setCallStatus("Erro na chamada");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      console.log("Rejeitando chamada...");
      rejectCall(incomingCall);
      setIncomingCall(null);
      setCallStatus("Chamada rejeitada - Aguardando nova chamada...");
      setIsWaitingForAdmin(true);
    }
  };

  const handleEndCall = () => {
    console.log("Encerrando chamada");
    hangUpCall();
    setIsInCall(false);
    setIncomingCall(null);
    setIsWaitingForAdmin(true);
    setCallStatus("Chamada encerrada - Aguardando nova chamada...");
  };

  const handleToggleVideo = () => {
    const newVideoState = !isVideoEnabled;
    setIsVideoEnabled(newVideoState);
    toggleVideo(newVideoState);
  };

  const handleToggleAudio = () => {
    const newAudioState = !isAudioEnabled;
    setIsAudioEnabled(newAudioState);
    toggleAudio(newAudioState);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!callData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da consulta...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header simplificado para cliente */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Video className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Consulta Online
                </h1>
                <p className="text-sm text-gray-500">{callData.subject}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(callData.datetime)}
              </div>
              <div className="text-xs text-gray-400">
                {formatDate(callData.datetime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Status da chamada */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {callData.client_name}
                </p>
                <p className="text-sm text-gray-500">Cliente</p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isInCall
                  ? "bg-green-100 text-green-800"
                  : incomingCall
                  ? "bg-yellow-100 text-yellow-800"
                  : isWaitingForAdmin
                  ? "bg-blue-100 text-blue-800"
                  : error
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {error || callStatus}
            </div>
          </div>
        </div>

        {/* Área principal do vídeo */}
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          {/* Vídeo remoto (administrador) */}
          <div className="relative w-full h-[400px] md:h-[500px]">
            {isInCall ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  {isWaitingForAdmin ? (
                    <>
                      <Users size={48} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-lg mb-2">
                        Aguardando o administrador...
                      </p>
                      <p className="text-sm text-gray-400">
                        A consulta começará quando o administrador iniciar a
                        chamada
                      </p>
                    </>
                  ) : (
                    <>
                      <Video size={48} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-lg">Preparando consulta...</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Vídeo local (cliente) - miniatura */}
            <div className="absolute top-4 right-4 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-white">
              {isVideoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <VideoOff size={16} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Controles da chamada */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              {incomingCall ? (
                // Botões para chamada recebida
                <div className="flex gap-4">
                  <button
                    onClick={handleRejectCall}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors"
                  >
                    <PhoneOff size={20} />
                  </button>
                  <button
                    onClick={handleAcceptCall}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-full p-4 transition-colors"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Phone size={20} />
                    )}
                  </button>
                </div>
              ) : isInCall ? (
                // Controles durante a chamada
                <div className="flex gap-3">
                  <button
                    onClick={handleToggleVideo}
                    className={`p-3 rounded-full transition-colors ${
                      isVideoEnabled
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {isVideoEnabled ? (
                      <Video size={18} />
                    ) : (
                      <VideoOff size={18} />
                    )}
                  </button>

                  <button
                    onClick={handleToggleAudio}
                    className={`p-3 rounded-full transition-colors ${
                      isAudioEnabled
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {isAudioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors"
                  >
                    <PhoneOff size={18} />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Indicador de chamada ativa */}
            {isInCall && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                AO VIVO
              </div>
            )}
          </div>
        </div>

        {/* Instruções para o cliente */}
        {!isInCall && !incomingCall && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  Aguardando início da consulta
                </h3>
                <p className="text-sm text-blue-700">
                  Sua câmera e microfone estão prontos. O administrador iniciará
                  a consulta no horário agendado. Mantenha esta página aberta.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de chamada recebida */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <div className="mb-4">
              <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chamada Recebida
              </h3>
              <p className="text-gray-600">
                O administrador está iniciando a consulta
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRejectCall}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Recusar
              </button>
              <button
                onClick={handleAcceptCall}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isLoading ? "Conectando..." : "Aceitar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de erro */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Erro</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => setError("")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
