import { RefObject, useEffect } from "react";
import QB from "@/lib/quickblox";
import { acceptCall, startVideoCall, hangUpCall } from "@/services/qb-call";

type Props = {
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
};

export const useQuickBlox = ({ localVideoRef, remoteVideoRef }: Props) => {
  useEffect(() => {
    QB.webrtc.onCallListener = (session: any, extension: any) => {
      console.log("Chamada recebida!");
      acceptCall(session, localVideoRef, remoteVideoRef);
    };

    QB.webrtc.onUserNotAnswerListener = (session: any, userId: number) => {
      console.warn(`Usuário ${userId} não respondeu.`);
    };

    QB.webrtc.onStopCallListener = (session: any, userId: number) => {
      console.log("Chamada finalizada por", userId);
    };

    QB.webrtc.onRemoteStreamListener = (
      session: any,
      userId: number,
      stream: MediaStream
    ) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play();
      }
    };

    QB.webrtc.onSessionCloseListener = () => {
      console.log("Sessão encerrada.");
    };
  }, [localVideoRef, remoteVideoRef]);

  const startCall = async (opponentId: number) => {
    await startVideoCall(opponentId, localVideoRef, remoteVideoRef);
  };

  const endCall = () => {
    hangUpCall();
  };

  return { startCall, endCall };
};
