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
import { IoPersonAdd } from "react-icons/io5";
import ModalInviteFriend from './ModalInviteFriend';
import { AppContext } from '@/Context/Context';
import { FaUserFriends } from "react-icons/fa";
import { PiRecordFill } from "react-icons/pi";

interface Props{
    room_key:string;
    setVideo: Dispatch<SetStateAction<boolean>>;
    setAudio: Dispatch<SetStateAction<boolean>>;
    audio: boolean;
    video: boolean;
    room_id:number;
    openChat: boolean;
    setOpenChat:Dispatch<SetStateAction<boolean>>; 
    user_amount:number;
    host_id: number;
    setLocalScreen: (streamScreen: MediaStream) => void;
    localScreen: MediaStream | null;
    remoteScreen: MediaStream | null;
    userJoinList:Array<any>;
    removeUser: (user_id:number)=>void;
    startRecord: ()=>void;
    stopRecord:()=>void;
}

/**
 * 
 * @param room_key: key room
 * @param room_id: id room
 * @param user_amount: số lượng người tham gia
 * @param host_id : id chủ phòng họp
 * 
 * @returns 
 */

export default function ControllerBar(
    {room_key, setVideo, setAudio, audio, video, room_id, openChat, setOpenChat, user_amount, host_id, setLocalScreen, localScreen,remoteScreen, userJoinList, removeUser, startRecord, stopRecord}
    :Props) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openInviteFriend, setOpenInviteFriend] = useState<boolean>(false);
    const [onRecord, setOnRecord] = useState<boolean>(false);
    const {user_id} = useContext(AppContext);

    async function startCapture() {  
        try {
            const videoStreamTrack = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"
                } as MediaTrackConstraints,
                audio: true
            });
            setLocalScreen(videoStreamTrack)
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    }
    return (
        <>
            <div className='w-fit fixed top-[90vh] left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full p-3 flex justify-center items-center space-x-4'>
                <Tooltip content={"ID phòng: "+room_key}>
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'><IoInformationOutline className='text-xl'/></Button>
                </Tooltip>
                {/* <Tooltip content="Tùy chọn khác">
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'><SlOptions className='text-xl'/></Button>
                </Tooltip> */}
                {user_id === host_id ? 
                    <Tooltip content="Mời tham gia">
                        <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'
                            onClick={()=>setOpenInviteFriend(true)}
                        >
                            <IoPersonAdd className='text-xl'/>
                            {user_amount}
                        </Button>
                    </Tooltip>
                    :
                    <Tooltip content="Danh sách người tham gia">
                        <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'
                            onClick={()=>setOpenInviteFriend(true)}
                        >
                            <FaUserFriends className='text-xl'/>
                            {user_amount}
                        </Button>
                    </Tooltip>
                }

                <Tooltip className='text-center' content="Ghi hình cuộc họp">
                    <Button color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <PiRecordFill className='text-xl'/>
                    </Button>
                </Tooltip>
                <Tooltip className='text-center' content={(remoteScreen || localScreen) ? "Bạn không thể chia sẻ màn hình khi có người đang chia sẻ":"Chia sẻ màn hình"}>
                    <Button onClick={startCapture} disabled={(remoteScreen || localScreen) ? true : false} color={"light"} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <LuScreenShare className='text-xl'/>
                    </Button>
                </Tooltip>
                <Tooltip content="Đoạn chat">
                    <Button color={"light"} onClick={()=>setOpenChat(!openChat)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        {openChat ? <RiChatOffFill className=' text-xl '/> : <MdMessage className=' text-xl '/>}
                    </Button>
                </Tooltip>
                <Tooltip content={audio ? "Microphone đang bật":"Microphone đang tắt"}>
                    <Button color={!audio ? "failure":"light"} onClick={audio ? ()=>setAudio(false) : ()=>setAudio(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        {audio ? <FaMicrophone className='text-xl'/> :<FaMicrophoneSlash className='text-xl'/>}
                    </Button>
                </Tooltip>
                <Tooltip content={video ? "Máy ảnh đang bật":"Máy ảnh đang tắt"}>
                    <Button color={!video ? "failure":"light"} onClick={video ? ()=>setVideo(false) : ()=>setVideo(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                       {video ? <HiMiniVideoCamera className='text-xl'/> : <HiMiniVideoCameraSlash className='text-xl'/>}
                    </Button>
                </Tooltip>
                
                <Tooltip className='w-40' content="Rời khỏi phòng họp">
                    <Button color={"failure"} onClick={()=>setOpenModal(true)} className='w-10 h-10 rounded-full flex justify-center items-center p-0'>
                        <MdCallEnd className='text-xl'/>
                    </Button>
                </Tooltip>
            </div>
            <ConfirmDialog id={room_id} openModal={openModal} setOpenModal={setOpenModal}/>
            <ModalInviteFriend host_id={host_id} room_id={room_id} userJoinList={userJoinList} openModal={openInviteFriend} setOpenModal={setOpenInviteFriend} removeUser={removeUser}/>
        </>
  )
}
