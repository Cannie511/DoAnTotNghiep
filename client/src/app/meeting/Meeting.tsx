'use client'
import { Button } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { HiOutlineVideoCameraSlash } from "react-icons/hi2";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";

export default function Meeting() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [video, setVideo] = useState<boolean>(false);
    const [audio, setAudio] = useState<boolean>(false);

    useEffect(() => {
        const getMedia = async () => {
            try {
                if (video) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: audio });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setMediaStream(stream);
                    }
                } else {
                    if (mediaStream) {
                        mediaStream.getTracks().forEach(track => track.stop());
                        setMediaStream(null);
                    }
                }
            } catch (error) {
                console.error('Lỗi thiết bị: ', error);
            }
        };
        getMedia();
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            }
        };
    }, [video, audio]);

    return (
        <>
            <h1 className='text-2xl font-bold'>Thiết bị</h1>
            <div className="flex space-x-2">
            {video ?
                <>
                    <video className=' mt-2 w-96 rounded-2xl' ref={videoRef} autoPlay playsInline />
                     <div className="flex flex-col">
                        <Button size='' className='mx-2 mt-3 h-fit' color={'failure'} onClick={() => setVideo(false)}><HiOutlineVideoCameraSlash className='text-xl' /></Button>
                        <Button size='' className='mx-2 my-1 h-fit' color='warning' onClick={() => setVideo(true)}><FaMicrophoneSlash className='text-xl' /></Button>
                    </div>
                </>
                :
                <>
                    <div className='mt-2 w-96 h-72 rounded-2xl bg-slate-800 flex justify-center items-center text-xl'>Máy ảnh đang tắt</div>
                     <div className="flex flex-col">
                        <Button size='' className='mx-2 mt-3 h-fit' onClick={() => setVideo(true)}><HiOutlineVideoCamera className='text-xl' /></Button>
                        <Button size='' className='mx-2 my-1 h-fit' color='warning' onClick={() => setVideo(true)}><FaMicrophone className='text-xl' /></Button>
                    </div>
                </>
            }
            </div>
        </>
    )
}
