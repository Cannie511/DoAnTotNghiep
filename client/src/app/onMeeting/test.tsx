'use client'
import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

const App: React.FC = () => {
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerId, setRemotePeerId] = useState<string>('');
  const [peers, setPeers] = useState<string[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const peersRef = useRef<Map<string, MediaConnection>>(new Map());

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('My peer ID is: ' + id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current && !localVideoRef.current.srcObject) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
          }
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            addRemoteVideo(call.peer, remoteStream);
          });
        });
    });

    peerRef.current = peer;

    return () => peer.destroy();
  }, []);

  const addRemoteVideo = (id: string, stream: MediaStream) => {
    let videoElement = document.getElementById(id) as HTMLVideoElement;
    if (!videoElement) {
      videoElement = document.createElement('video');
      videoElement.id = id;
      videoElement.autoplay = true;
      document.body.append(videoElement);
    }
    videoElement.srcObject = stream;
  };

  const callPeer = () => {
    if (!remotePeerId) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current && !localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }

        const call = peerRef.current?.call(remotePeerId, stream);
        if (call) {
          peersRef.current.set(remotePeerId, call);
          call.on('stream', (remoteStream) => {
            addRemoteVideo(call.peer, remoteStream);
          });
        }
      });
  };

  const handleJoinRoom = () => {
    if (!remotePeerId) return;

    setPeers([...peers, remotePeerId]);
    callPeer();
  };

  return (
    <div>
      <h1>PeerJS Meeting Room</h1>
      <div>
        <p>Your ID: {peerId}</p>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
      <div>
        <video ref={localVideoRef} muted />
      </div>
    </div>
  );
};

export default App;
