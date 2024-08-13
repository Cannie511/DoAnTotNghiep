'use client'
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image'
import { Avatar } from 'flowbite-react'
import React, { useContext, useEffect, useRef, useState } from 'react'

interface Props {
    id:number;
    remoteStream:MediaStream|null;
    display_name:string;
    avatar: string;
    host_id:number;
}

export default function MediaDivLarge({id, remoteStream, display_name ,avatar, host_id}:Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [video, setVideo] = useState<boolean>();
  const [audio, setAudio] = useState<boolean>();
  const { socket } = useContext(AppContext);
  useEffect(() => {
    if (videoRef.current && remoteStream) {
      if(remoteStream?.getVideoTracks()[0])
        setVideo(true)
      else setVideo(false)
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, video]);

  useEffect(()=>{
    if(socket){
      socket.on("off-Cam",(userId:number)=>{
        if(+userId === +id){
          console.log("cam: ", userId + " đã tắt cam");
          setVideo(false)
          if(remoteStream)
          {
            const videoTrack = remoteStream.getVideoTracks()[0];
            videoTrack.enabled = false;
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          }
        } 
      })
      socket.on("on-Cam",(userId:number)=>{
        if(+userId === +id){
          console.log("cam: ", userId + " đã bật cam")
          setVideo(true)
          if(remoteStream)
          {
            const videoTrack = remoteStream.getVideoTracks()[0];
            videoTrack.enabled = true;
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          }
        } 
      })

      socket.on("off-Mic",(userId:number)=>{
        if(+userId === +id){
          console.log("cam: ", userId + " đã tắt mic")
          console.log(remoteStream?.getAudioTracks()[0])
          console.log("host: ",host_id)
        }
      })
      return () => {
        socket.off("off-Cam");
        socket.off("on-Cam");
      };
    }
  },[socket])

  return (
    <div className="overflow-hidden relative w-full h-[87vh] bg-gray-700 rounded-xl flex justify-center items-center flex-col">
        <audio
          className='absolute opacity-0 -z-10'
          ref={videoRef}
          autoPlay
          playsInline
        />
        {remoteStream && video ? (
          <>
            <video
              className='mt-2 w-full rounded-2xl'
              ref={videoRef}
              autoPlay
              playsInline
            />
            <div className='absolute top-[48rem] left-3 text-2xl'>{display_name} {id === host_id && "[ Chủ phòng ]"}</div>
          </>
        ) : (
          <>
            <Avatar
              size={"xl"}
              img={avatar||url_img_default}
              rounded
              bordered
              color="success"
              className='relative z-30'
              placeholderInitials="Fr"
            />
           
            <div className='mt-2 text-2xl'>{display_name} {id === host_id && "[Chủ phòng]"}</div>
          </>
          
        )}
    </div>
  )
}
