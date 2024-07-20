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
export default function MotionBackground() {
  const {room_id} = useParams();
  const {user_id} = useContext(AppContext);
  const router = useRouter();
  const {toast} = useToast();
  const motionDiv = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const videoRef = useRef<any>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [video, setVideo] = useState<boolean>(false);
  const [audio, setAudio] = useState<boolean>(false);
  const {data:checkHost, error:errHost} = useQuery({
    queryKey:["check_host"],
    queryFn: ()=>findRoom(Number(room_id)),
    enabled:!!user_id
  })
  if(errHost){
    router.push("/meeting");
  }
  const roomData:any = checkHost?.data;
  const getVideoStream = async () => {
    try {
      if (video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
            const combinedStream = new MediaStream([...(stream.getVideoTracks()), ...(audioStream ? audioStream.getAudioTracks() : [])]);
            videoRef.current.srcObject = combinedStream;
        }
      } else {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            setVideoStream(null);
            }
            if (audioStream && videoRef.current) {
                videoRef.current.srcObject = new MediaStream(audioStream.getAudioTracks());
            }
        }
      } catch (error) {
          console.error('Lỗi thiết bị video: ', error);
          toast({
              title: "Lỗi thiết bị video!",
              variant: "destructive"
          });
      }
  };

  const getAudioStream = async () => {
    try {
      if (audio) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setAudioStream(stream);
          if (videoRef.current) {
              const combinedStream = new MediaStream([...(videoStream ? videoStream.getVideoTracks() : []), ...(stream.getAudioTracks())]);
              videoRef.current.srcObject = combinedStream;
          } else if (videoRef.current) {
              videoRef.current.srcObject = new MediaStream(stream.getAudioTracks());
          }
      } else {
          if (audioStream) {
              audioStream.getTracks().forEach(track => track.stop());
              setAudioStream(null);
          }
          if (videoStream && videoRef.current) {
              videoRef.current.srcObject = new MediaStream(videoStream.getVideoTracks());
          }
      }
    } catch (error) {
      console.error('Lỗi thiết bị audio: ', error);
      toast({
          title: "Lỗi thiết bị audio!",
          variant: "destructive"
      });
    }
  };

  useEffect(() => {
    getVideoStream();
    getAudioStream();
    return () => {
      if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
      }
      if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop());
          setAudioStream(null);
      }
    };
  }, [video, audio]);
  useEffect(()=>{
    if(motionDiv && motionDiv.current)
    setSize({
      width: motionDiv.current["clientWidth"],
      height: motionDiv.current["clientHeight"],
    });
  },[motionDiv])
  return (
    <div ref={motionDiv} className="p-3 w-full h-[100vh] overflow-hidden text-white bg-black">
      {
        size && <RoomID x={size.width} y={Number(size.height)} video={video} audio={audio} stream={videoStream}/>
      }
      <ControllerBar setVideo={setVideo} setAudio={setAudio} audio={audio} video={video} room_id={formatRoomKey(room_id.toString())}/>
      {+user_id === roomData?.Host_id && <ToastInfo room_id={Number(room_id)}/>} 
    </div>
  )
}
