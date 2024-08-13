'use client'
import { Avatar, Button, TextInput, Tooltip } from 'flowbite-react';
import { FaSearch } from "react-icons/fa";
import React, { useContext, useEffect } from 'react'
import Image from 'next/image';
import { url_img_default } from '@/images/image';
import { leftRoom } from '@/Services/user_join.api';
import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { FaSignOutAlt } from "react-icons/fa";
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
interface Props {
    listUserInRoom: Array<any>;
    room_id?:number;
    host_id:number;
    removeUser?:(user_id:number)=>void
}

export default function UserInRoom({listUserInRoom,room_id,host_id,removeUser}:Props) {
    const {toast} = useToast();
    const {user_id, socket} = useContext(AppContext);
    const onKickUser = async(user_id:number, display_name:string) =>{
        if(!user_id || !socket) return;
        if(socket){
            socket.emit('kick-out',user_id);
            toast({
                title:"Bạn đã mời " + display_name + " ra khỏi phòng!"
            })
        }
    }
    useEffect(()=>{
        console.log(listUserInRoom)
    },[listUserInRoom])
  return (
    <div>
        <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Danh sách người tham gia </h3>
            <div className='flex space-x-2'>
                <TextInput className='flex-auto' type="text" placeholder="Nhập tên người tham gia hoặc email..." />
                <Button className='flex-none w-10'><FaSearch className='text-xl'/></Button>
            </div>
        </div>
        <div className='mt-2 max-h-96 overflow-y-auto'>
            {/* {
                isLoading && !list_friend_accepted && 
                <>
                    <Skeleton className='w-full h-14'/>
                    <Skeleton className='w-full h-14'/>
                    <Skeleton className='w-full h-14'/>
                </>
            } */}
            {listUserInRoom && listUserInRoom?.length > 0 && listUserInRoom.map((item:any)=>{
                return(
                <div key={item?.User_ID}
                className="
                cursor-pointer dark:hover:bg-gray-900 transition-all 
                hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 
                bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 
                    p-2 items-center">
                    <div className='flex-auto'>
                        <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                            <Avatar
                                size={"sm"}
                                alt="avatar"
                                img={item["User.avatar"].toString() || url_img_default}
                                rounded
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item["User.display_name"]} {item?.User_ID === host_id && "[Chủ phòng]"}</p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item["User.email"]}</p>
                        </div>
                        </div>
                    </div>
                    { user_id === host_id && 
                        <div>
                            <Tooltip className='w-40' content="Mời ra khỏi phòng">
                                <FaSignOutAlt className='text-red-500 hover:text-red-400 transition-all'
                                    onClick={()=>onKickUser(item?.User_ID, item["User.display_name"])}
                                />
                            </Tooltip>
                        </div>
                    }
                </div>
                )
            })}
        </div>
    </div>
    
  )
}
