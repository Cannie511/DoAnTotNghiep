'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import RoomID from './Room_id';
import ControllerBar from './ControllerBar';
import { useParams, useRouter } from 'next/navigation';
import { formatRoomKey } from '@/Utils/formatDate';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '@/Context/Context';
import { findRoom } from '@/Services/room.api';
import ToastInfo from './ToastInfo';
import Peer from 'peerjs';
import { joinRoom, userJoin } from '@/Services/user_join.api';
import MediaDiv from './mediaDiv';
import RoomChat from './roomChat';


export default function MotionBackground() {
  const {room_id} = useParams();
  const {user_id, socket} = useContext(AppContext);
  const router = useRouter();
  const {toast} = useToast();
  const motionDiv = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [openChat, setOpenChat] = useState<boolean>(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [video, setVideo] = useState<boolean>(false);
  const [audio, setAudio] = useState<boolean>(false);
  const {data:checkHost, error:errHost} = useQuery({
    queryKey:["check_host"],
    queryFn: ()=>findRoom(Number(room_id)),
    enabled:!!room_id
  });
  
  const roomData:any = checkHost?.data;
  const {data:userJoinIn, error:errUserJoin} = useQuery({
    queryKey:["user_join"],
    queryFn: ()=>userJoin(Number(user_id), Number(roomData?.id)),
    enabled:!!user_id && !!roomData
  });

  const {data:joinInRoom, error:errJoinIn} = useQuery({
    queryKey:["join_room"],
    queryFn: ()=>joinRoom(Number(user_id), Number(roomData?.id)),
    enabled:!!user_id && !!roomData
  });

  const userJoinRoom = joinInRoom?.data;

  useEffect(()=>{
    if(userJoinRoom){
      socket.emit("join-in", room_id, user_id);
    }
  },[userJoinRoom]);

  const userJoinList:any = userJoinIn?.data;
  //console.log(roomData)
  useEffect(()=>{
    if(errJoinIn){
      toast({
        title:"Lỗi tham gia phòng!!!",
        variant:"destructive"
      })
      return;
    }
    if(errHost){
      router.push("/meeting");
      return;
    }
    if(errUserJoin){
      toast({
        title:"Lỗi kết nối!!!",
        variant:"destructive"
      });
      return;
    }
  },[errJoinIn, errHost, errUserJoin]);


  useEffect(()=>{
    if(motionDiv && motionDiv.current)
    setSize({
      width: motionDiv.current["clientWidth"],
      height: motionDiv.current["clientHeight"],
    });
  },[motionDiv]);
  
  useEffect(() => {
    if (user_id && userJoinList) {
      const peer = new Peer(user_id.toString(), {
        host: 'localhost',
        port: 1234,
        path: '/peer-server'
      });

      peer.on('open', (id: string) => {
        console.log('Peer ID: ', id);
      });
      
      if (video || audio) {
        navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
          .then(async(stream) => {
            setVideoStream(stream);
            //console.log(stream)
            if (userJoinList && userJoinList.length > 0) {
              userJoinList.forEach((user:any) => {
                const call = peer.call(user?.User_ID.toString(), stream);
                console.log(call)
                call.on('stream', function(remoteStream) {
                  // call.answer(remoteStream as MediaStream|undefined)
                  // console.log("Callee: ", remoteStream)
                  // setRemoteStream(remoteStream);
                });
              });
            }
        });
      }
      if(video) socket.emit('onCam',room_id, user_id);
      else socket.emit('offCam',room_id, user_id)
      if(audio) socket.emit('onMic',room_id, user_id)
      else socket.emit('offMic',room_id, user_id)
      if (videoStream) {
        if (!video) {
          const videoTrack = videoStream.getVideoTracks().find(track => track.kind === "video");
          videoTrack?.stop();
        }
        if (!audio) {
          const audioTrack = videoStream.getAudioTracks().find(track => track.kind === "audio");
          audioTrack?.stop();
        }
      }

      peer.on("call",(call)=>{
        console.log("Cuộc gọi đến", remoteStream);
          call.answer(remoteStream as MediaStream|undefined)
          call.on('stream', (remoteStream:MediaStream)=>{
            setRemoteStream(remoteStream);
          })
      })

      return () => {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
        }
        peer.destroy();
      };
      
    }
  }, [user_id,video, audio, userJoinList]);
  return (
    <div ref={motionDiv} className="p-3 w-full h-[100vh] overflow-hidden text-white bg-black">
      <RoomChat openChat={openChat} setOpen={setOpenChat} room_id={roomData?.id}/>
      {
        size && <RoomID x={size.width} y={Number(size.height)} video={video} audio={audio} stream={videoStream}/>
      }
      <div className='flex space-x-2'>
        {
        userJoinList && userJoinList.map((user:any) => {
          return (
            <MediaDiv 
              key={user?.id} 
              remoteStream={remoteStream}
              avatar={user?.["User.avatar"]} 
              displayName={user?.["User.display_name"]} 
            />
          )
        })
        }
      </div>
      {roomData && 
        <ControllerBar 
        setVideo={setVideo} 
        setAudio={setAudio} 
        audio={audio} 
        video={video} 
        audioStream={audioStream} 
        room_key={formatRoomKey(room_id.toString())}
        room_id={roomData?.id}
        setOpenChat={setOpenChat} openChat={openChat}
        />
      }
      {+user_id === roomData?.Host_id && <ToastInfo room_id={Number(room_id)}/>} 
    </div>
  )
}
