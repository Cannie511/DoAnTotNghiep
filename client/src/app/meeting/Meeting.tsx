'use client';
import { Button } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { HiOutlineVideoCameraSlash } from "react-icons/hi2";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import { useToast } from '@/components/ui/use-toast';
import SearchInput from './SearchInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateRoom from './createRoom';
import { InviteMeeting } from './inviteMeeting';
export default function Meeting() {
    const { toast } = useToast();
    const videoRef = useRef<any>(null);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [video, setVideo] = useState<boolean>(false);
    const [audio, setAudio] = useState<boolean>(false);
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

    return (
        <div className='flex'>
            <Tabs defaultValue="inviteMeeting" className="w-full">
                <TabsList className='w-full flex'>
                     <TabsTrigger className='flex-1' value="inviteMeeting">Lời mời họp</TabsTrigger>
                    <TabsTrigger className='flex-1' value="device">Thiết bị của bạn</TabsTrigger>
                    <TabsTrigger className='flex-1' value="joinRoom">Tham gia phòng họp có sẵn</TabsTrigger>
                    <TabsTrigger className='flex-1' value="createRoom">Tạo phòng họp của bạn</TabsTrigger>
                </TabsList>
                <TabsContent value="device">
                    <div className='flex-1'>
                        <h1 className='text-2xl font-bold'>Thiết bị</h1>
                        <div className="flex space-x-2">
                            <div className='mx-auto md:m-0'>
                                {(video || (video && audio)) && <video className='mt-2 w-96 rounded-2xl' ref={videoRef} autoPlay playsInline />}
                                {video && !audio && <FaMicrophoneSlash className='text-md absolute -mt-6 ml-3' />}
                                {!video && !audio && 
                                    <div className='relative rounded-md flex items-center justify-center text-white dark:text-black bg-gray-500 h-[200px] w-96'>
                                        Máy ảnh và microphone đang tắt
                                    </div>
                                }
                                {!video && audio && 
                                    <div className='relative rounded-md flex items-center justify-center bg-gray-500 h-[200px] w-96'>
                                        Máy ảnh đang tắt
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col">
                                {video ?
                                    <Button size='' className='hidden md:block mx-2 mt-3 h-fit' color={'failure'} onClick={() => setVideo(false)}><HiOutlineVideoCameraSlash className='text-xl' /></Button>
                                    :
                                    <Button size='' className='hidden md:block mx-2 mt-3 h-fit' onClick={() => setVideo(true)}><HiOutlineVideoCamera className='text-xl' /></Button>
                                }
                                {audio ?
                                    <Button size='' className='hidden md:block mx-2 my-1 h-fit' color='warning' onClick={() => setAudio(false)}><FaMicrophoneSlash className='text-xl' /></Button>
                                    :
                                    <Button size='' className='hidden md:block mx-2 my-1 h-fit' color='warning' onClick={() => setAudio(true)}><FaMicrophone className='text-xl' /></Button>
                                }
                                
                            </div>
                        </div>
                        <div className='flex mt-5 space-x-2 px-2'>
                            {video ?
                                <Button className='flex-1 block md:hidden h-fit' color={'failure'} onClick={() => setVideo(false)}><HiOutlineVideoCameraSlash className='text-xl' />&nbsp; Máy ảnh</Button>
                                :
                                <Button className='flex-1 block md:hidden h-fit' onClick={() => setVideo(true)}><HiOutlineVideoCamera className='text-xl' />&nbsp; Máy ảnh</Button>
                            }
                            {audio ?
                                <Button className='flex-1 block md:hidden h-fit' color='warning' onClick={() => setAudio(false)}><FaMicrophoneSlash className='text-xl' />&nbsp;Microphone</Button>
                                :
                                <Button className='flex-1 block md:hidden h-fit' color='warning' onClick={() => setAudio(true)}><FaMicrophone className='text-xl' />&nbsp; Microphone</Button>
                            }
                        </div>
                        
                    </div>
                </TabsContent>
                <TabsContent value="joinRoom">
                    <SearchInput/>
                </TabsContent>
                <TabsContent value="createRoom">
                    <CreateRoom/>
                </TabsContent>
                <TabsContent value="inviteMeeting">
                    <InviteMeeting/>
                </TabsContent>
            </Tabs>
        </div>
    );
}
