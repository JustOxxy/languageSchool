import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { useRouter } from "next/router";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";

export const ChatRoom = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const socketRef = useRef<Socket<any, any>>();
  const currentUserVideo = useRef<HTMLVideoElement | null>(null);
  const otherUserVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance>();
  const peersRef = useRef<{ peer: Peer.Instance; peerId: string }[]>([]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!currentUserVideo.current || !socketRef.current) return;

        currentUserVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomId, currentUser?.id);

        socketRef.current.on("disconnect old tab", async () => {
          // stop stream in old tab
          stopVideoStream();
          socketRef.current?.disconnect();
          await router.push("/");
        });

        socketRef.current.on("all users", (users) => {
          const peers: { peer: Peer.Instance; peerId: string }[] = [];

          users.forEach((userId) => {
            const peer = createPeer(userId, socketRef.current?.id, stream);
            peers.push({ peer, peerId: userId });
          });

          peersRef.current = peers;
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({ peer, peerId: payload.callerID });
        });

        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((peer) => peer.peerId === id);

          if (peerObj) {
            peerObj?.peer.destroy();
            peersRef.current = peersRef.current.filter((peer) => peer.peerId !== id);
            if (otherUserVideo.current) {
              otherUserVideo.current.srcObject = null;
            }
          }
        });
      })
      .catch((error) => console.log(error));
    return () => {
      connectionRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopVideoStream = () => {
    const stream = currentUserVideo.current?.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current?.emit("sending signal", { userToSignal, callerID, signal });
    });

    peer.on("stream", (stream) => {
      if (!otherUserVideo.current) return;
      otherUserVideo.current.srcObject = stream;
    });

    peer.on("close", () => {
      console.log("peer closed");
      peer.destroy();
      socketRef.current?.off("receiving returned signal");
    });

    socketRef.current?.on("receiving returned signal", (payload) => {
      peer.signal(payload.signal);
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.signal(incomingSignal);

    peer.on("signal", (signal) => {
      socketRef.current?.emit("returning signal", { signal, callerID });
    });

    peer.on("stream", (stream) => {
      if (!otherUserVideo.current) return;
      otherUserVideo.current.srcObject = stream;
    });

    peer.on("close", () => {
      console.log("peer closed");
      peer.destroy();
      socketRef.current?.off("receiving returned signal");
    });

    connectionRef.current = peer;
    return peer;
  };
  console.log(otherUserVideo);
  return (
    <div>
      <video playsInline muted ref={currentUserVideo} autoPlay style={{ width: "300px" }} />

      <video playsInline ref={otherUserVideo} autoPlay style={{ width: "300px" }} />
    </div>
  );
};
