import QB from "@/lib/quickblox";

let currentSession: any = null;
let currentUserType: "admin" | "client" | null = null;
let incomingCallCallback: ((session: any) => void) | null = null;

const PASSWORD = "12345678QWERTY"; // senha comum para todos os usuários

// Função para admin iniciar chamada
export const startVideoCall = async (
  userLogin: string,
  opponentId: number,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
) => {
  console.log("Iniciando chamada como admin...");
  currentUserType = "admin";

  try {
    // 1. Login como o próprio usuário (admin)
    console.log("Fazendo login com:", userLogin);
    const userLogged = await loginToQB(userLogin);

    // 2. Criar sessão
    await createSession(userLogin, PASSWORD);
    console.log("Login do usuário realizado com sucesso.");

    // 3. Conectar ao chat
    await connectChat(userLogged.id, PASSWORD);
    console.log("Conectado ao chat com sucesso.");

    // 4. Configurar listeners para chamadas recebidas
    setupCallListeners(localVideoRef, remoteVideoRef);
    console.log("SETUP FEITO");

    // 5. Iniciar chamada
    await initiateCall(opponentId, localVideoRef, remoteVideoRef);
    console.log("Chamada iniciada com sucesso!");
  } catch (error) {
    console.error("Erro ao iniciar chamada:", error);
    throw error;
  }
};

// Função para cliente se conectar e aguardar chamadas
export const initializeClientForCalls = async (
  clientEmail: string,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>,
  onIncomingCall?: (session: any) => void
) => {
  console.log("Inicializando cliente para receber chamadas...");
  currentUserType = "client";
  incomingCallCallback = onIncomingCall || null;

  try {
    // 1. Login como cliente
    console.log("Fazendo login do cliente:", clientEmail);
    const userLogged = await loginToQB(clientEmail);

    // 2. Criar sessão
    await createSession(clientEmail, PASSWORD);
    console.log("Login do cliente realizado com sucesso.");

    // 3. Conectar ao chat
    await connectChat(userLogged.id, PASSWORD);
    console.log("Cliente conectado ao chat com sucesso.");

    // 4. Configurar listeners para chamadas recebidas
    setupCallListeners(localVideoRef, remoteVideoRef);
    console.log("Cliente pronto para receber chamadas!");

    return userLogged;
  } catch (error) {
    console.error("Erro ao inicializar cliente:", error);
    throw error;
  }
};

// ---------- Funções auxiliares -----------

export const loginToQB = (login: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log("Fazendo login com:", login, "senha:", PASSWORD);
    QB.login({ login, password: PASSWORD }, (err: any, res: any) => {
      if (err) {
        console.error("Erro no login QB:", err);
        return reject(err);
      }
      console.log("LOGIN FEITO com sucesso:", res);
      resolve(res);
    });
  });
};

const createSession = (login: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const params = { login: login, password: password };
    QB.createSession(params, function (error: any, result: any) {
      if (error) {
        console.error("Erro ao criar sessão:", error);
        return reject(error);
      }
      console.log("SESSAO CRIADA com sucesso");
      resolve(result);
    });
  });
};

const connectChat = async (userId: number, password: string): Promise<any> => {
  const userCredentials = {
    userId: userId,
    password: password,
  };

  return new Promise((resolve, reject) => {
    QB.chat.connect(userCredentials, function (error: any, contactList: any) {
      if (error) {
        console.error("Erro ao conectar chat:", error);
        return reject(error);
      }
      console.log("Conectado ao chat com sucesso");
      resolve(contactList);
    });
  });
};

const setupCallListeners = (
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
) => {
  console.log("Configurando listeners de chamada...");

  // Limpar listener anterior se existir
  QB.webrtc.onCallListener = null;

  // Configurar novo listener
  QB.webrtc.onCallListener = (session: any, extension: any) => {
    console.log("=== CHAMADA RECEBIDA ===");
    console.log("De:", session.initiatorID);
    console.log("Tipo de usuário:", currentUserType);
    console.log("Session:", session);

    currentSession = session;

    // Configurar eventos da sessão imediatamente
    setupSessionEvents(session, localVideoRef, remoteVideoRef);

    if (currentUserType === "client" && incomingCallCallback) {
      console.log("Notificando cliente sobre chamada recebida");
      incomingCallCallback(session);
    } else if (currentUserType === "admin") {
      console.log("Admin recebeu chamada - auto-aceitando para demo");
      // Auto-aceitar para admin (caso receba chamada)
      setTimeout(() => {
        acceptCall(session, localVideoRef, remoteVideoRef);
      }, 1000);
    }
  };

  console.log("Listeners configurados com sucesso");
};

const setupSessionEvents = (
  session: any,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
) => {
  console.log("Configurando eventos da sessão...");

  session.on(
    QB.webrtc.SessionConnectionEvents.REMOTE_STREAM_RECEIVED,
    (session: any, userID: any, remoteStream: MediaStream) => {
      console.log("=== STREAM REMOTO RECEBIDO ===");
      console.log("De usuário:", userID);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current
          .play()
          .catch((e: any) =>
            console.error("Erro ao reproduzir vídeo remoto:", e)
          );
      }
    }
  );

  session.on(
    QB.webrtc.SessionConnectionEvents.USER_ACCEPT,
    (session: any, userID: any) => {
      console.log("=== USUÁRIO ACEITOU CHAMADA ===");
      console.log("Usuário:", userID);
    }
  );

  session.on(
    QB.webrtc.SessionConnectionEvents.USER_REJECT,
    (session: any, userID: any) => {
      console.log("=== USUÁRIO REJEITOU CHAMADA ===");
      console.log("Usuário:", userID);
      currentSession = null;
    }
  );

  session.on(QB.webrtc.SessionConnectionEvents.CLOSED, (session: any) => {
    console.log("=== CHAMADA ENCERRADA ===");
    cleanupCall(localVideoRef, remoteVideoRef);
  });
};

const initiateCall = (
  opponentId: number,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
): Promise<void> => {
  console.log("=== INICIANDO CHAMADA ===");
  console.log("Para usuário ID:", opponentId);

  return new Promise((resolve, reject) => {
    // Criar nova sessão de vídeo
    const session = QB.webrtc.createNewSession(
      [opponentId],
      QB.webrtc.CallType.VIDEO
    );
    currentSession = session;

    // Configurar eventos da sessão
    setupSessionEvents(session, localVideoRef, remoteVideoRef);

    // Primeiro obter mídia do usuário
    QB.webrtc.getUserMedia(
      { audio: true, video: true },
      (stream: MediaStream) => {
        console.log("Mídia local obtida com sucesso");

        /*
          No quickblox recomenda iniciar a chamada primeiro antes de salvar a midia do user,
          mas o claude passa como primeiro, e mesmo assim retorna erro.
        */
        session.call({}, (callErr: any) => {
          if (callErr) {
            console.error("Erro ao fazer chamada:", callErr);
            return reject(callErr);
          }
          console.log("Chamada iniciada com sucesso");
          resolve();
        });

        // Configurar vídeo local
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current
            .play()
            .catch((e: any) =>
              console.error("Erro ao reproduzir vídeo local:", e)
            );
        }

        // Depois fazer a chamada
      },
      (mediaErr: any) => {
        console.error("Erro ao obter mídia:", mediaErr);
        reject(mediaErr);
      }
    );
  });
};

export const acceptCall = (
  session: any,
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log("=== ACEITANDO CHAMADA ===");
    currentSession = session;

    QB.webrtc.getUserMedia(
      { audio: true, video: true },
      (stream: MediaStream) => {
        console.log("Mídia local obtida para aceitar chamada");

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current
            .play()
            .catch((e: any) =>
              console.error("Erro ao reproduzir vídeo local:", e)
            );
        }

        session.accept({});
        console.log("Chamada aceita com sucesso");
        resolve();
      },
      (err: any) => {
        console.error("Erro ao aceitar chamada:", err);
        reject(err);
      }
    );
  });
};

export const rejectCall = (session?: any) => {
  const sessionToReject = session || currentSession;
  if (sessionToReject) {
    console.log("=== REJEITANDO CHAMADA ===");
    sessionToReject.reject({});
    currentSession = null;
  }
};

export const hangUpCall = () => {
  if (currentSession) {
    console.log("=== ENCERRANDO CHAMADA ===");
    currentSession.stop({});
    currentSession = null;
  }
};

const cleanupCall = (
  localVideoRef: React.RefObject<HTMLVideoElement | null>,
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
) => {
  console.log("=== LIMPANDO RECURSOS DA CHAMADA ===");

  if (localVideoRef.current && localVideoRef.current.srcObject) {
    const stream = localVideoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    localVideoRef.current.srcObject = null;
  }

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }

  currentSession = null;
};

export const getUserMedia = async (
  localVideoRef: React.RefObject<HTMLVideoElement | null>
): Promise<MediaStream> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current
        .play()
        .catch((e: any) => console.error("Erro ao reproduzir vídeo local:", e));
    }

    return stream;
  } catch (error) {
    console.error("Erro ao obter mídia do usuário:", error);
    throw error;
  }
};

// Função para controlar áudio
export const toggleAudio = (enabled: boolean) => {
  if (currentSession && currentSession.mediaStreams) {
    const localStream = Object.values(
      currentSession.mediaStreams
    )[0] as MediaStream;
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = enabled;
      });
    }
  }
};

// Função para controlar vídeo
export const toggleVideo = (enabled: boolean) => {
  if (currentSession && currentSession.mediaStreams) {
    const localStream = Object.values(
      currentSession.mediaStreams
    )[0] as MediaStream;
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = enabled;
      });
    }
  }
};

// Função para verificar se há uma chamada ativa
export const isCallActive = (): boolean => {
  return currentSession !== null;
};

// Função para obter informações da sessão atual
export const getCurrentSession = () => {
  return currentSession;
};
