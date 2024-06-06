import React, { MutableRefObject, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import Peer, { SignalData } from "simple-peer"
import { Button, Input } from "@nextui-org/react"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export const ChatRoom = () => {
  const socket = useRef<Socket<any, any>>()
  const [me, setMe] = useState("")
  const [stream, setStream] = useState<MediaStream>()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal, setCallerSignal] = useState<Peer.SignalData>()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState("")
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState("")
  const [videoButtonText, setVideoButtonText] = useState("")
  const [audioButtonText, setAudioButtonText] = useState("")

  const myVideo = useRef<HTMLVideoElement | null>(null)
  const userVideo = useRef<HTMLVideoElement | null>(null)
  const connectionRef = useRef<Peer.Instance>()
  console.log(me)
  console.log(caller)
  console.log(idToCall)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        if (!myVideo.current) return
        myVideo.current.srcObject = stream
        setVideoButtonText("Turn off video")
        setAudioButtonText("Turn off audio")
      })
      .catch((error) => console.log(error))

    socket.current = io("http://localhost:3001", {
      transports: ["websocket"],
    })

    socket.current.on("me", (id) => {
      setMe(id)
    })

    socket.current.on("callUser", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })
  }, [])

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    })

    peer.on("signal", (data) => {
      socket.current?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      })
    })

    peer.on("stream", (stream) => {
      if (!userVideo.current) return
      userVideo.current.srcObject = stream
    })

    peer.on("close", () => {
      console.log("peer closed")
      socket.current?.off("callAccepted")
    })

    socket.current?.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })

    peer.on("signal", (data) => {
      socket.current?.emit("answerCall", {
        signal: data,
        to: caller,
      })
    })

    peer.on("stream", (stream) => {
      if (!userVideo.current) return
      userVideo.current.srcObject = stream
    })
    peer.on("close", () => {
      console.log("peer closed")
      socket.current?.off("callAccepted")
    })

    if (callerSignal) {
      peer.signal(callerSignal)
    }

    connectionRef.current = peer
  }

  const resetCallState = () => {
    setCallAccepted(false)
    setCallEnded(false)
    setCaller("")
    setReceivingCall(false)
    setName("")
  }

  const leaveCall = () => {
    setCallEnded(true)
    if (!connectionRef.current) return
    connectionRef.current.destroy()
    resetCallState()
  }

  const handleVideoButtonClick = () => {
    const videoTrack = stream?.getVideoTracks()?.[0]

    if (!videoTrack) return

    if (videoTrack.enabled) {
      videoTrack.enabled = false
      setVideoButtonText("Turn on video")
      return
    }

    videoTrack.enabled = true
    setVideoButtonText("Turn off video")
  }

  const handleMicroButtonClick = () => {
    const audioTrack = stream?.getAudioTracks()?.[0]

    if (!audioTrack) return

    if (audioTrack.enabled) {
      audioTrack.enabled = false
      setAudioButtonText("Turn on audio")
      return
    }
    audioTrack.enabled = true
    setAudioButtonText("Turn off audio")
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <div className="container">
        <div className="video">
          <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
          <Button onClick={handleVideoButtonClick}>{videoButtonText}</Button>
          <Button onClick={handleMicroButtonClick}>{audioButtonText}</Button>
        </div>
        <div className="video">
          {callAccepted && !callEnded ? (
            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
          ) : null}
        </div>
        <div>
          <Input label={"name"} value={name} onValueChange={setName} />
          <div>{me}</div>
          <Input label={"ID to call"} value={idToCall} onValueChange={setIdToCall} />
          <div>
            {callAccepted && !callEnded ? (
              <Button onClick={leaveCall}>End Call</Button>
            ) : (
              <Button onClick={() => callUser(idToCall)}>Call user</Button>
            )}
            {idToCall}
          </div>
          <div>
            {receivingCall && !callAccepted ? (
              <>
                <h1>{name} is calling</h1>
                <Button onClick={answerCall}></Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
