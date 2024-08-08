'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import ControllerBar from './ControllerBar';
import { useParams, useRouter } from 'next/navigation';
import { formatRoomKey } from '@/Utils/formatDate';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '@/Context/Context';
import { findRoom } from '@/Services/room.api';
import ToastInfo from './ToastInfo';
import Peer from 'peerjs';
import { joinRoom, userJoin } from '@/Services/user_join.api';
import MediaDiv from './mediaDiv';
import RoomChat from './roomChat';
import { Avatar } from 'flowbite-react';
import { url_img_default } from '@/images/image';
import { UserFindOne } from '@/Services/user.api';
import MediaDivLarge from './MediaSizeLarge';
import ModalKickOut from './ModalKickout';

interface PeerType {
  id: number;
  display_name:string;
  avatar:string;
  stream: MediaStream;
  type: "user" | "screen";
}

export default function MotionBackground() {
  const { room_id } = useParams();
  const { user_id, socket } = useContext(AppContext);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const motionDiv = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [openChat, setOpenChat] = useState<boolean>(false);
  const [openModalKickOut, setOpenModalKickOut] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement|null>(null);
  const [video, setVideo] = useState<boolean>(true);
  const [audio, setAudio] = useState<boolean>(true);
  const [peers, setPeers] = useState<PeerType[]>([]);
  const [localScreen, setLocalScreen] = useState<MediaStream|null>(null);
  const [remoteScreen, setRemoteScreen] = useState<MediaStream|null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream|null>(null);
  const localScreenRef = useRef<HTMLVideoElement>(null);
  const remoteScreenRef = useRef<HTMLVideoElement>(null); 
  const peerScreenRef = useRef<Peer | null>();
  const peerRef = useRef<Peer | null>(null);
  const peersRef = useRef<Set<string>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { data: checkHost, error: errHost } = useQuery({
    queryKey: ["check_host"],
    queryFn: () => findRoom(Number(room_id)),
    enabled: !!room_id
  });

  const roomData: any = checkHost?.data;
  const { data: userJoinIn, error: errUserJoin } = useQuery({
    queryKey: ["user_join"],
    queryFn: () => userJoin(Number(user_id), Number(roomData?.id)),
    enabled: !!user_id && !!roomData
  });

  const { data: joinInRoom, error: errJoinIn } = useQuery({
    queryKey: ["join_room"],
    queryFn: () => joinRoom(Number(user_id), Number(roomData?.id)),
    enabled: !!user_id && !!roomData
  });

  const userJoinRoom = joinInRoom?.data;
  const removeUser = (id:number) =>{
    peersRef.current.delete(id.toString())
    setPeers(prevPeers => prevPeers.filter(peer => peer.id !== id));
  }

  const recorderMeeting = async () => {
    
  };  

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    } else {
      console.error("No recording in progress");
    }
  };


  const shareScreen = async (streamScreen:MediaStream) =>{
    if(remoteScreen){
      toast({
        title:"Thông báo!!!",
        description:"Bạn không thể chia sẻ khi có người khác đang chia sẻ màn hình",
        variant:"destructive"
      })
      return;
    }
    setLocalScreen(streamScreen);
    const peerScreen = new Peer("sc-" + user_id.toString(), {
      host: 'localhost',
      port: 1234,
      path: '/peer-server'
    })
    peerScreenRef.current = peerScreen;
    peers.forEach(async(item)=>{
      const call = await peerScreen.call(item?.id.toString(), streamScreen);
    }) 
  }

  useEffect(() => {
    if (userJoinRoom) {
      socket.emit("join-in", room_id, user_id);
    }
  }, [userJoinRoom]);

  const userJoinList: any = userJoinIn?.data;

  useEffect(() => {
    if (errJoinIn) {
      toast({
        title: "Lỗi tham gia phòng!!!",
        variant: "destructive"
      });
      return;
    }
    if (errHost) {
      router.push("/meeting");
      return;
    }
    if (errUserJoin) {
      toast({
        title: "Lỗi kết nối!!!",
        variant: "destructive"
      });
      return;
    }
  }, [errJoinIn, errHost, errUserJoin]);

  useEffect(() => {
    if (motionDiv && motionDiv.current) {
      setSize({
        width: motionDiv.current["clientWidth"],
        height: motionDiv.current["clientHeight"],
      });
    }
  }, [motionDiv]);

  useEffect(() => {
    if (user_id && socket) {
      const initPeer = async () => {
        if (!streamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
        }

        const peer = new Peer(user_id.toString(), {
          host: 'localhost',
          port: 1234,
          path: '/peer-server',
        });

        peerRef.current = peer;
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
          localVideoRef.current.muted = true;
        }

        peer.on('open', (id) => {
          // console.log('Peer ID: ', id);
        });

        peer.on("call", (call) => {
          if (streamRef.current) {
            call.answer(streamRef.current);
            call.on("stream", async (remoteStream) => {
              if (call.peer.startsWith("sc-")) {
                const id = call.peer.split("-")[1];
                const user_data = await UserFindOne(Number(id));
                setPeers(prevPeers => [
                  ...prevPeers,
                  { id: Number(call.peer), display_name: user_data.data.data.display_name, avatar: user_data.data.data.avatar, stream: remoteStream, type: "screen" },
                ]);
                peersRef.current.add(call.peer);
                return;
              }
              const user_data = await UserFindOne(Number(call.peer));
              if (user_data && !peersRef.current.has(call.peer)) {
                setPeers(prevPeers => [
                  ...prevPeers,
                  { id: Number(call.peer), display_name: user_data.data.data.display_name, avatar: user_data.data.data.avatar, stream: remoteStream, type: "user" },
                ]);
                peersRef.current.add(call.peer);
              }
            });
          }
        });

        socket.on("stop-screen", (user_id: number, display_name: string) => {
          setRemoteScreen(null);
          peersRef.current.delete("sc-" + user_id);
          setPeers(prevPeers => prevPeers.filter(peer => peer.type !== "screen"));
          toast({
            title:display_name + " đã dừng chia sẻ màn hình"
          })
        });

        socket.on("kick-out", () => {
          if (socket) {
            setOpenModalKickOut(true);
          }
        });

        socket.on("user-joinIn", async (user: any) => {
          console.log("User joined: ", peersRef.current.has(user?.id));
          if (!peersRef.current.has(user?.id) && streamRef.current) {
            const call = await peer.call(user?.id.toString(), streamRef.current);
            call?.on("stream", (remoteStream) => {
              if (!peersRef.current.has(user?.id)) {
                queryClient.invalidateQueries({ queryKey: ["user_media_div"] });
                setPeers(prevPeers => [
                  ...prevPeers,
                  { id: user?.id, display_name: user?.display_name, avatar: user?.avatar, stream: remoteStream, type: "user" },
                ]);
                peersRef.current.add(user?.id);
              }
            });
            if (peerScreenRef.current && localScreen) {
              const sharedScreen = peerScreenRef.current?.call(user?.id.toString(), localScreen);
            }
          }
        });

        socket.on("user-leftRoom", (user: any) => {
          peersRef.current.delete(user?.id);
          setPeers(prevPeers => prevPeers.filter(peer => peer.id !== user?.id));
        });

        return () => {
          socket.emit("user-left", user_id, room_id);
          peer.destroy();
          socket.off("user-joinIn");
          socket.off("user-leftRoom");
          socket.off("share-screen");
        };
      };

      initPeer().catch(error => {
        console.error("Error accessing media devices.", error);
      });
    }
  }, [user_id, socket, localScreen]);

  useEffect(()=>{
    if(peers.length > 0){
      const screenShared = peers.find(x=>x.type === "screen");
      console.log("screen shared: ",screenShared);
      if(screenShared)
        setRemoteScreen(screenShared?.stream);
    }
  },[peers])
  useEffect(() => {
    if(localScreen) {
      if(localScreenRef.current){
        localScreenRef.current.srcObject = localScreen;
        if(socket && localScreen){
          socket.emit("share-screen",user_id);
        }
      }
      const localScreenVideoTrack = localScreen.getVideoTracks()[0];
      localScreenVideoTrack.addEventListener('ended', () => {
        if(peerScreenRef.current && socket){
          console.log(peerScreenRef.current.id?.split("-")[1]);
          socket.emit("stop-screen", peerScreenRef.current.id?.split("-")[1]);
          peerScreenRef.current.destroy();
        }
        setLocalScreen(null)
        toast({
          title:"Bạn đã dừng chia sẻ màn hình!"
        })
      });
    }

  }, [localScreen, socket]);
  
  useEffect(()=>{
    if(remoteScreen) {
      if(remoteScreenRef.current){
        remoteScreenRef.current.srcObject = remoteScreen;
      }
    }
  },[remoteScreen])
  useEffect(() => {
    if (streamRef.current) {
      if (!video) {
        if(socket){
          socket.emit("offCam", room_id, user_id);
        }
        streamRef.current.getVideoTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
      } else {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(async (newStream) => {
            streamRef.current = newStream;
            if(socket){
              socket.emit("onCam", room_id, user_id);
            }
            setVideoStream(newStream)
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = streamRef.current;
              localVideoRef.current.muted = true;
            }
            if (streamRef.current && peerRef.current) {
              Object.values(peerRef.current.connections).forEach((connectionArray: any) => {
                connectionArray.forEach((connection: any) => {
                  connection.peerConnection.getSenders().forEach((sender: any) => {
                    if (sender.track && sender.track.kind === 'video') {
                      // console.log()
                      sender.replaceTrack(newStream.getVideoTracks()[0]);
                    }
                  });
                });
              });
            }
          })
          .catch((error) => {
            console.error('Failed to get local stream:', error);
          });
      }
    }
  }, [video, socket, peers]);

   useEffect(() => {
    if(socket){
      socket.on("off-Cam",(userId:number)=>{
        setPeers(prevPeers => prevPeers.map(peer => {
          if (peer.id === userId && peer.stream) {
            peer.stream.getVideoTracks().forEach(track => track.enabled = false);
          }
          return peer;
        }));
      });

      socket.on("on-Cam",(userId:number)=>{
        setPeers(prevPeers => prevPeers.map(peer => {
          if (peer.id === userId && peer.stream) {
            peer.stream.getVideoTracks().forEach(track => track.enabled = true);
          }
          return peer;
        }));
      });
    }
  }, [socket]);
  
  return (
    <div ref={motionDiv} className="p-3 w-full h-[100vh] overflow-hidden text-white bg-black">
      <RoomChat openChat={openChat} setOpen={setOpenChat} room_id={roomData?.id} />
      <motion.div
        className="overflow-hidden fixed z-40 w-[22rem] h-[200px] border border-white bg-gray-700 rounded-xl flex justify-center items-center cursor-move"
        drag
        initial={{ x: 3000, y: 1000 }}
        animate={{ x: size.width - 372, y: size.height - 222 }}
        dragConstraints={{
          top: 0,
          left: 0,
          right: size.width - 372,
          bottom: size.height - 222,
        }}
      >
        {(video || (video && audio)) ? (
          <>
            <video
              className='mt-2 w-96 rounded-2xl transform -scale-x-100'
              ref={localVideoRef}
              autoPlay
              playsInline
            />
            <div className='absolute mt-40 left-3'>Tôi</div>
          </>
        ) : (
          <Avatar
            size={"lg"}
            img={url_img_default}
            rounded
            bordered
            color="success"
            placeholderInitials="Fr"
          />
        )}
      </motion.div>
      {localScreen && 
        <div className='w-[80vw] h-[87vh] bg-gray-900 rounded-md'>
          <video className='w-full h-full'
              ref={localScreenRef}
              autoPlay
              playsInline
          />
        </div>
      }
      {remoteScreen && 
        <div className='w-[80vw] h-[87vh] bg-gray-900 rounded-md'>
          <video className='w-full h-full'
              ref={remoteScreenRef}
              autoPlay
              playsInline
          />
        </div>
      }
      <div className='flex space-x-2'>
        {
          !remoteScreen && !localScreen && peers && peers.length === 1 && peers[0].type !== "screen" &&
            <MediaDivLarge key={peers[0].id} id={peers[0].id} remoteStream={peers[0].stream} avatar={peers[0]?.avatar} display_name={peers[0]?.display_name} />
        }
        {
          !remoteScreen && !localScreen && peers && peers.length > 1 && peers.filter(user => user.type !== "screen").map((user) => (
            <MediaDiv key={user.id} id={user.id} remoteStream={user.stream} display_name={user?.display_name} avatar={user?.avatar}/>
          ))
        }
        
      </div>
      {localScreen &&
        <div className='h-[98vh] w-[22rem] bg-gray-900 fixed top-2 right-2 space-y-2'>
          {
            localScreen && peers && peers.length > 0 && peers.filter(user => user.type !== "screen").map((user) => (
              <MediaDiv key={user.id} id={user.id} remoteStream={user.stream} display_name={user?.display_name} avatar={user?.avatar}/>
            ))
          }
        </div>
      }
      {remoteScreen &&
        <div className='h-[98vh] w-[22rem] bg-gray-900 fixed top-2 right-2 space-y-2 overflow-y-scroll'>
          {
            remoteScreen && peers && peers.length > 0 && peers.filter(user => user.type !== "screen").map((user) => (
              <MediaDiv key={user.id} id={user.id} remoteStream={user.stream} display_name={user?.display_name} avatar={user?.avatar}/>
            ))
          }
        </div>
      }
      {roomData && userJoinList &&
        <ControllerBar 
          host_id={roomData?.Host_id}
          setVideo={setVideo} 
          setAudio={setAudio} 
          audio={audio} 
          video={video} 
          room_key={formatRoomKey(room_id.toString())}
          room_id={roomData?.id}
          setOpenChat={setOpenChat} openChat={openChat}
          userJoinList={userJoinList}
          user_amount={userJoinList?.length + 1}
          localScreen={localScreen}
          remoteScreen={remoteScreen}
          setLocalScreen={shareScreen}
          removeUser={removeUser}
          startRecord={recorderMeeting}
          stopRecord={stopRecording}
        />
      }
      {+user_id === roomData?.Host_id && <ToastInfo room_id={Number(room_id)} />} 
      <ModalKickOut openModal={openModalKickOut} setOpenModal={setOpenModalKickOut} id={Number(roomData?.id)}/>
    </div>
  );
}
