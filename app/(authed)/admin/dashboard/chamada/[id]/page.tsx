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
  Users
} from "lucide-react";
import { 
  startVideoCall, 
  hangUpCall, 
  getUserMedia,
  toggleAudio,
  toggleVideo,
  isCallActive,
  getCurrentSession
} from "@/services/qb-call";

type VideoServiceData = {
  id: number;
  client_name: string;
  subject: string;
  datetime: string;
  user_qb_id: number;
  owner_id: string;
  owner_email: string;
};

export default function VideoCallPage() {
  const [callData, setCallData] = useState<VideoServiceData | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState("Aguardando...");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const params = useParams();
  const videoId = params?.id;

  // 🔄 Buscar dados do Supabase
  useEffect(() => {
    const fetchCall = async () => {
      console.log("Buscando dados da chamada...");
      
      const supabase = createClient();

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

      // Buscar o email do owner
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", videoData.owner_id)
        .single();

      if (profileError || !profileData) {
        console.error("Erro ao buscar email do owner:", profileError);
        setError("Erro ao buscar dados do usuário");
        return;
      }

      setCallData({
        ...videoData,
        owner_email: profileData.email,
      });

      setCallStatus("Pronto para chamada");
    };

    if (videoId) fetchCall();
  }, [videoId]);

  // Verificar status da chamada periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setIsInCall(isCallActive());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Inicializar preview da câmera
  useEffect(() => {
    const initPreview = async () => {
      try {
        await getUserMedia(localVideoRef);
        setCallStatus("Câmera iniciada");
      } catch (error) {
        console.error("Erro ao inicializar câmera:", error);
        setError("Erro ao acessar câmera/microfone");
      }
    };

    if (callData) {
      initPreview();
    }
  }, [callData]);
  
  const formattedTime = callData
    ? new Date(callData.datetime).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const formattedDate = callData
    ? new Date(callData.datetime).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleStartCall = async () => {
    if (!callData?.user_qb_id || !callData?.owner_email) {
      setError("Dados da chamada não encontrados");
      return;
    }

    setIsLoading(true);
    setError("");
    setCallStatus("Iniciando chamada...");

    try {
      console.log("Iniciando chamada com", callData.user_qb_id);
      
      await startVideoCall(
        callData.owner_email,
        callData.user_qb_id,
        localVideoRef,
        remoteVideoRef
      );
      
      setIsInCall(true);
      setCallStatus("Chamada conectada");
    } catch (error) {
      console.error("Erro ao iniciar chamada:", error);
      setError("Erro ao iniciar chamada");
      setCallStatus("Erro na chamada");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = () => {
    console.log("Encerrando chamada");
    hangUpCall();
    setIsInCall(false);
    setCallStatus("Chamada encerrada");
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

  if (!callData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da chamada...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-8 bg-gray-50 min-h-screen">
      {/* Detalhes da chamada */}
      <div className="bg-white rounded-lg p-6 w-full lg:w-1/3 shadow-sm">
        {/* Informações da chamada */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-1">Hora / Data</p>
          <p className="text-lg font-bold mb-4">
            {formattedTime} | {formattedDate}
          </p>

          <p className="text-gray-600 text-sm mb-1">Nome</p>
          <p className="text-lg font-bold mb-4">{callData.client_name}</p>

          <p className="text-gray-600 text-sm mb-1">Assunto</p>
          <p className="text-lg font-bold mb-6">{callData.subject}</p>
        </div>

        {/* Status da chamada */}
        <div className="mb-6">
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            isInCall 
              ? 'bg-green-100 text-green-800' 
              : error 
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {error || callStatus}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 border border-blue-500 text-blue-500 rounded px-4 py-2 font-medium hover:bg-blue-50 transition-colors">
            NOTAS
          </button>
          <button className="flex-1 border border-blue-500 text-blue-500 rounded px-4 py-2 font-medium hover:bg-blue-50 transition-colors">
            CHAT
          </button>
          <button className="flex-1 border border-blue-500 text-blue-500 rounded px-4 py-2 font-medium hover:bg-blue-50 transition-colors">
            SIGMA VA
          </button>
        </div>

        {/* Controles de mídia */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={handleToggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
        </div>
      </div>

      {/* Área do vídeo */}
      <div className="relative w-full lg:w-2/3 bg-black rounded-lg overflow-hidden shadow-sm">
        {/* Vídeo remoto (principal) */}
        <div className="relative w-full h-[480px]">
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
                <Users size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-lg">Aguardando conexão...</p>
              </div>
            </div>
          )}
        </div>

        {/* Vídeo local (miniatura) */}
        <div className="absolute top-4 left-4 w-32 h-32 rounded-md overflow-hidden border border-white">
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
              <VideoOff size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Botões da chamada */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
          {!isInCall ? (
            <button
              onClick={handleStartCall}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-full p-4 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Phone size={20} />
              )}
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors"
            >
              <PhoneOff size={20} />
            </button>
          )}
        </div>

        {/* Indicador de status no vídeo */}
        {isInCall && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            AO VIVO
          </div>
        )}
      </div>

      {/* Modal de erro (se necessário) */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md">
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