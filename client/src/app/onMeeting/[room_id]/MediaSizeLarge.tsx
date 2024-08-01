'use client'
import { url_img_default } from '@/images/image'
import { UserFindOne } from '@/Services/user.api';
import { useQuery } from '@tanstack/react-query';
import { Avatar } from 'flowbite-react'
import React, { useEffect, useRef } from 'react'

interface Props {
    id:number;
    remoteStream:MediaStream|null;
    display_name:string;
    avatar: string;
}

export default function MediaDivLarge({id, remoteStream, display_name ,avatar}:Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    //console.log("remote: ", user_data)
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="overflow-hidden relative w-full h-[87vh] bg-gray-700 rounded-xl flex justify-center items-center flex-col">
        {remoteStream ? (
          <>
            <video
              className='mt-2 w-full rounded-2xl'
              ref={videoRef}
              autoPlay
              playsInline
            />
            <div className='absolute top-[48rem] left-3 text-2xl'>{display_name}</div>
          </>
        ) : (
          <>
            <Avatar
              size={"xl"}
              img={avatar||url_img_default}
              rounded
              bordered
              color="success"
              placeholderInitials="Fr"
            />
            <div className='mt-2 text-2xl'>{display_name}</div>
          </>
          
        )}
        
    </div>
  )
}
