'use client'
import { url_img_default } from '@/images/image'
import { Avatar } from 'flowbite-react'
import React, { useEffect, useRef } from 'react'

interface Props {
    avatar: string;
    displayName: string;
    remoteStream:MediaStream|null;
}

export default function MediaDiv({avatar, displayName, remoteStream}:Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    console.log("remote: ", remoteStream)
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
    console.log("remote",remoteStream)
  }, [remoteStream]);

  return (
    <div className="overflow-hidden relative w-[22rem] h-[200px] bg-gray-700 rounded-xl flex justify-center items-center flex-col">
        {remoteStream && remoteStream.getVideoTracks().find(track => track.kind === "video") ? (
          <>
            <video
              className='mt-2 w-96 rounded-2xl'
              ref={videoRef}
              autoPlay
              playsInline
            />
            <div className='absolute mt-40 left-3'>{displayName}</div>
          </>
        ) : (
          <>
            <Avatar
              size={"lg"}
              img={avatar||url_img_default}
              rounded
              bordered
              color="success"
            />
            <div className='mt-2'>{displayName}</div>
          </>
          
        )}
        
    </div>
  )
}
