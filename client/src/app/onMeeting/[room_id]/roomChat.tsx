'use client'
import Message from '@/app/chat/Message';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { Button, TextInput, Tooltip } from 'flowbite-react';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
interface Props {
    openChat:boolean;
    setOpen:Dispatch<SetStateAction<boolean>>;
    room_id:number;
}
export default function RoomChat({openChat, setOpen, room_id}:Props) {
    const {user_id, socket} = useContext(AppContext);
    const [message, setMessage] = useState<string>('');
    const style = openChat ?  "fixed w-[25rem] h-[97vh] bg-white rounded-lg right-4 z-50 p-3 space-y-2 text-black block"  : "hidden";

    const handleSendMessage = () =>{
        if(socket && user_id && room_id){
            socket.emit("room-chat", {room_id, user_id, message})
        }
        setMessage('');
    }
  return (
    <div className={style}>
        <div className='flex justify-between'>
            <h1 className='text-2xl font-bold'>Đoạn chat phòng họp</h1>
            <Tooltip content="Đóng">
                <IoIosClose onClick={()=>setOpen(false)} className='text-4xl hover:text-gray-600 transition-all cursor-pointer'/>
            </Tooltip> 
        </div>
        <div className='w-full h-[85vh] overflow-x-hidden overflow-y-scroll'>
            <Message avatar={url_img_default} createAt={"10:00"} message='Hello huhbiuhuihaica ashcuascoi ịacijaisjcácnjasncjasncj' status={1} key={1} />
            <Message avatar={url_img_default} createAt={"10:00"} message='Hello huhbiuhuihaica ashcuascoi' status={1} key={2} me />
        </div>
        <div >
            <form className='flex items-center' onSubmit={handleSendMessage}>
                <input type="text" name="price" id="price" 
                className="block w-full rounded-full border-none 
                py-2 pl-5 pr-11 text-gray-900 ring-1 ring-inset 
                ring-gray-300 placeholder:text-gray-400 focus:ring-2 
                focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                onChange={(e)=>setMessage(e.target.value)}
                value={message}
                placeholder="Tin nhắn. . ."/>    
                <div className='absolute right-2'>
                    <Button type='submit' color={""} size={"sm"}>
                        <IoSend className='text-3xl text-gray-600 cursor-pointer hover:text-gray-400 transition-all'/>
                    </Button>
                </div>
            </form>
        </div>
    </div>
  )
}
