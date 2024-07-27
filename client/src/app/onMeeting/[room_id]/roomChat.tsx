'use client'
import Message from '@/app/chat/Message';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { getRoomMessage } from '@/Services/room_message.api';
import { useQuery } from '@tanstack/react-query';
import { Button, Tooltip } from 'flowbite-react';
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useRef, useState } from 'react'
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
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef<NodeJS.Timeout | null>(null);
    const style = openChat ?  "absolute w-[27rem] h-[97vh] bg-white rounded-lg right-4 z-50 p-3 space-y-2 text-black block"  : "hidden";
    const {data:room_message_list, refetch} = useQuery({
        queryKey:["room_message_list"],
        queryFn:()=>getRoomMessage(room_id),
        enabled:!!room_id
    })
    const room_message:any = room_message_list?.data;
    const handleScroll = () => {
        if (messageBoxRef.current) {
            if (isScrollingRef.current) {
                clearTimeout(isScrollingRef.current);
            }
            messageBoxRef.current.classList.remove('hide-scrollbar');
            isScrollingRef.current = setTimeout(() => {
                if (messageBoxRef.current) {
                    messageBoxRef.current.classList.add('hide-scrollbar');
                }
            }, 200);
        }
    };
    const setTimeScroll = () =>{
        
        const messageBox = messageBoxRef.current;
            if (messageBox) {
                messageBox.addEventListener('scroll', handleScroll);
                messageBox.classList.add('hide-scrollbar');
                messageBox.scrollTop = messageBox.scrollHeight;
            }
        return () => {
            if (messageBox) {
                messageBox.removeEventListener('scroll', handleScroll);
            }
            if (isScrollingRef.current) {
                clearTimeout(isScrollingRef.current);
            }
        };
    }
    setTimeout(()=>{
        setTimeScroll();
    },200)
    const handleSendMessage = (e:ChangeEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(socket && user_id && room_id){
            socket.emit("room-chat", {room_id, user_id, message})
        }
        refetch();
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
        <div ref={messageBoxRef} className='w-full h-[82vh] px-1 overflow-x-hidden overflow-y-scroll flex flex-col'>
            {room_message && room_message.map((message:any)=>{
                return(
                    <Message avatar={message["User.avatar"] || url_img_default} createAt={message?.createdAt} message={message?.Message} status={1} key={message?.id} me={message.Send_by === user_id} />
                )
            })}
        </div>
        <div >
            <form className='flex items-center' onSubmit={handleSendMessage}>
                <input type="text" name="price" id="price" 
                className="block w-full rounded-full border-none 
                py-2 pl-5 pr-11 text-gray-900 ring-1 ring-inset 
                ring-gray-300 placeholder:text-gray-400 placeholder:font-bold focus:ring-2 
                focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                onChange={(e)=>setMessage(e.target.value)}
                value={message}
                placeholder="Tin nhắn phòng họp. . ."/>    
                <div className='absolute right-2'>
                    <Tooltip content="Gửi">
                        <Button type='submit' color={""} size={"sm"}>
                            <IoSend className='text-3xl text-gray-600 cursor-pointer hover:text-gray-400 transition-all'/>
                        </Button>
                    </Tooltip>
                    
                </div>
            </form>
        </div>
    </div>
  )
}
