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
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<boolean>(true);
  const [audio, setAudio] = useState<boolean>(true);
  const [localScreen, setLocalScreen] = useState<MediaStream|null>(null);
  const [remoteScreen, setRemoteScreen] = useState<MediaStream|null>(null);
  const localScreenRef = useRef<HTMLVideoElement>(null);
  const remoteScreenRef = useRef<HTMLVideoElement>(null); 
  const [peers, setPeers] = useState<PeerType[]>([]);
  const peerRef = useRef<Peer | null>(null);
  const peersRef = useRef<Set<string>>(new Set());
  const peerScreenRef = useRef<Peer | null>();
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const peer = new Peer(user_id.toString(), {
        host: 'localhost',
        port: 1234,
        path: '/peer-server'
      });

      peerRef.current = peer;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      peer.on('open', (id) => {
        //console.log('Peer ID: ', id);
      });
      // Xử lý cuộc gọi đến
      peer.on("call", (call) => {
        console.log("type: ", call.metadata?.type);
        call.answer(stream);
        call.on("stream", async (remoteStream) => {
          console.log("stream", peer.call)
          if(call.peer[0] === "s" && call.peer[1] === "c"){
            const id = call.peer.split("-")[1];
            const user_data = await UserFindOne(Number(id));
            setPeers(prevPeers => [
              ...prevPeers,
              { id: Number(call.peer), display_name: user_data.data.data.display_name, avatar: user_data.data.data.avatar, stream: remoteStream, type: "screen" }
            ]);
            peersRef.current.add(call.peer);
            return;
          }
          const user_data = await UserFindOne(Number(call.peer));
          if (user_data && !peersRef.current.has(call.peer)) {
            setPeers(prevPeers => [
              ...prevPeers,
              { id: Number(call.peer), display_name: user_data.data.data.display_name, avatar: user_data.data.data.avatar, stream: remoteStream, type: "user" }
            ]);
            peersRef.current.add(call.peer);
          }
        });
      });

      socket.on("stop-screen",(user_id:number, display_name:string)=>{
        console.log(display_name + " đã dừng share màn hình " );
        setRemoteScreen(null);
        if(peersRef.current){
          peersRef.current.delete("sc-"+user_id);
        }
        setPeers(prevPeers => prevPeers.filter(peer => peer.type !== "screen"));
      })
      
      socket.on("user-joinIn", async (user: any) => {
        console.log("User joined: ", user?.id);
        if (!peersRef.current.has(user?.id) ) {
          const call = await peer.call(user?.id.toString(), stream);
          call?.on("stream", (remoteStream) => {
            if (!peersRef.current.has(user?.id)) {
              queryClient.invalidateQueries({ queryKey: ["user_media_div"] });
              setPeers(prevPeers => [...prevPeers, { id: user?.id, display_name: user?.display_name, avatar: user?.avatar, stream: remoteStream, type: "user" }]);
              peersRef.current.add(user?.id);
            }
          });
          if(peerScreenRef.current && localScreen){
            const sharedScreen = peerScreenRef.current?.call(user?.id.toString(), localScreen);
          }
        }
      });
      
      // Xử lý người dùng rời khỏi phòng
      socket.on("user-leftRoom", (user: any) => {
        console.log("User left: ", user?.id);
        peersRef.current.delete(user?.id);
        setPeers(prevPeers => prevPeers.filter(peer => peer.id !== user?.id));
      });

      return () => {
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

  }, [localScreen, peers, socket, toast]);
  
  useEffect(()=>{
    if(remoteScreen) {
      if(remoteScreenRef.current){
        remoteScreenRef.current.srcObject = remoteScreen;
      }
    }
  },[remoteScreen])
  
  const shareScreen = async (streamScreen:MediaStream) =>{
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
  return (
    <div ref={motionDiv} className="p-3 w-full h-[100vh] overflow-hidden text-white bg-black">
      <RoomChat openChat={openChat} setOpen={setOpenChat} room_id={roomData?.id} />
      <motion.div
        className="overflow-hidden fixed z-40 w-[22rem] h-[200px] bg-gray-700 rounded-xl flex justify-center items-center cursor-move"
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
              className='mt-2 w-96 rounded-2xl'
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
            <MediaDiv key={user.id} id={user.id} remoteStream={user.stream} display_name={user?.display_name} />
          ))
        }
        
      </div>
      {localScreen &&
        <div className='h-[98vh] w-[22rem] bg-gray-900 fixed top-2 right-2 space-y-2'>
          {
            localScreen && peers && peers.length > 0 && peers.filter(user => user.type !== "screen").map((user) => (
              <MediaDiv key={user.id} id={user.id} remoteStream={user.stream} display_name={user?.display_name} />
            ))
          }
        </div>
      }
      {remoteScreen &&
        <div className='h-[98vh] w-[22rem] bg-gray-900 fixed top-2 right-2 space-y-2 overflow-y-scroll'>
          {
            remoteScreen && peers && peers.length > 0 && peers.filter(user => user.type !== "screen").map((user) => (
              <MediaDiv key={user.id} id={user.id} remoteStream={user.stream} display_name={user?.display_name} />
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
          user_amount={userJoinList?.length + 1}
          setLocalScreen={shareScreen}
        />
      }
      {+user_id === roomData?.Host_id && <ToastInfo room_id={Number(room_id)} />} 
    </div>
  );
}
