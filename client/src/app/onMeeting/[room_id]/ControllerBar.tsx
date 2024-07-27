'use client'
import { Button, Tooltip } from 'flowbite-react'
import { MdCallEnd } from "react-icons/md";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { FaMicrophone } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { LuScreenShare } from "react-icons/lu";
import { IoInformationOutline } from "react-icons/io5";
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { FaMicrophoneSlash } from "react-icons/fa";
import ConfirmDialog from './ConfirmDialog';
import { MdMessage } from "react-icons/md";
import { RiChatOffFill } from "react-icons/ri";
interface Props{
    room_key:string;
    setVideo: Dispatch<SetStateAction<boolean>>;
    setAudio: Dispatch<SetStateAction<boolean>>;
    audio: boolean;
    video: boolean;
    audioStream: MediaStream | null;
    room_id:number;
    openChat: boolean;
    setOpenChat:Dispatch<SetStateAction<boolean>>; 
}
export default function ControllerBar({room_key, setVideo, setAudio, audio, video, audioStream, room_id, openChat, setOpenChat}:Props) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    // useEffect(()=>{
    //      window.addEventListener('beforeunload', ()=>setOpenModal(true));
    //      return () => {
    //         window.removeEventListener('beforeunload', ()=>setOpenModal(true));
    //     };
    // },[]);
    return (
        <>
            <div className='w-fit fixed top-[90vh] left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-3 flex justify-center items-center space-x-4'>
                <Tooltip content={"ID phòng: "+room_key}>
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'><IoInformationOutline className='text-xl'/></Button>
                </Tooltip>
                <Tooltip content="Tùy chọn khác">
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'><SlOptions className='text-xl'/></Button>
                </Tooltip>
                <Tooltip content="Chia sẻ màn hình">
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <LuScreenShare className='text-xl'/>
                    </Button>
                </Tooltip>
                <Tooltip content="Đoạn chat">
                    <Button color={"light"} onClick={()=>setOpenChat(!openChat)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        {openChat ? <RiChatOffFill className=' text-xl '/> : <MdMessage className=' text-xl '/>}
                    </Button>
                </Tooltip>
                <Tooltip content={audio ? "Microphone đang bật":"Microphone đang tắt"}>
                    <Button color={audio ? "failure":"light"} onClick={audio ? ()=>setAudio(false) : ()=>setAudio(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        {audio ? <FaMicrophoneSlash className='text-xl'/> :<FaMicrophone className='text-xl'/>}
                    </Button>
                </Tooltip>
                <Tooltip content={video ? "Máy ảnh đang bật":"Máy ảnh đang tắt"}>
                    <Button color={video ? "failure":"light"} onClick={video ? ()=>setVideo(false) : ()=>setVideo(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                       {video ? <HiMiniVideoCameraSlash className='text-xl'/> : <HiMiniVideoCamera className='text-xl'/>}
                    </Button>
                </Tooltip>
                
                <Tooltip className='w-40' content="Rời khỏi phòng họp">
                    <Button color={"failure"} onClick={()=>setOpenModal(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <MdCallEnd className='text-xl'/>
                    </Button>
                </Tooltip>
            </div>
            <ConfirmDialog id={room_id} openModal={openModal} setOpenModal={setOpenModal}/>
        </>
  )
}
