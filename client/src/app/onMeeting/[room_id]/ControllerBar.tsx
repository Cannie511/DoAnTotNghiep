import { Button, Tooltip } from 'flowbite-react'
import { MdCallEnd } from "react-icons/md";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { FaMicrophone } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import { LuScreenShare } from "react-icons/lu";
import { IoInformationOutline } from "react-icons/io5";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { FaMicrophoneSlash } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import ConfirmDialog from './ConfirmDialog';
import { AppContext } from '@/Context/Context';
interface Props{
    room_key:string;
    setVideo: Dispatch<SetStateAction<boolean>>;
    setAudio: Dispatch<SetStateAction<boolean>>;
    audio: boolean;
    video: boolean;
    audioStream: MediaStream | null;
    room_id:number;
}
export default function ControllerBar({room_key, setVideo, setAudio, audio, video, audioStream, room_id}:Props) {
    const {peer} = useContext(AppContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    // useEffect(()=>{
    //      window.addEventListener('beforeunload', ()=>setOpenModal(true));
    //      return () => {
    //         window.removeEventListener('beforeunload', ()=>setOpenModal(true));
    //     };
    // },[]);
    const handleTestCall = () =>{
        console.log("call")
        peer.call("60", audioStream);
    }
    return (
        <>
            <div className='w-fit fixed top-[90vh] left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-3 flex justify-center items-center space-x-4'>
                <Tooltip content={"ID phòng: "+room_key}>
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'><IoInformationOutline className='text-xl'/></Button>
                </Tooltip>
                <Tooltip content="Tùy chọn khác">
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'><SlOptions className='text-xl'/></Button>
                </Tooltip>
                <Tooltip content={audio ? "Microphone đang bật":"Microphone đang tắt"}>
                    <Button color={"light"} onClick={audio ? ()=>setAudio(false) : ()=>setAudio(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        {audio ? <FaMicrophoneSlash className='text-xl'/> :<FaMicrophone className='text-xl'/>}
                    </Button>
                </Tooltip>
                <Tooltip content={video ? "Máy ảnh đang bật":"Máy ảnh đang tắt"}>
                    <Button color={"light"} onClick={video ? ()=>setVideo(false) : ()=>setVideo(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                       {video ? <HiMiniVideoCameraSlash className='text-xl'/> : <HiMiniVideoCamera className='text-xl'/>}
                    </Button>
                </Tooltip>
                <Tooltip content="Chia sẻ màn hình">
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <LuScreenShare className='text-xl'/>
                    </Button>
                </Tooltip>
                <Tooltip content="Test call">
                    <Button color={"light"} onClick={handleTestCall} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <IoIosCall className='text-xl'/>
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
