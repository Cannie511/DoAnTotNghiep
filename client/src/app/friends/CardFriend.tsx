import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { createNotification, deleteNotification } from '@/Services/notification.api';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'flowbite-react'
import Image, { StaticImageData } from 'next/image'
import React, { useContext } from 'react'

interface Props{
    noti_id?: number;
    avatar: string|StaticImageData;
    display_name:string;
    id:number;
    typeView: "confirm" | "request" | "cancel" | string;
    id_delete: number;
}

/**
 * 
 * @param noti_id :id thông báo
 * @param id : id Friend
 * @param typeView : loại view được chọn trong component 
 *
 * @returns 
 */

export default function CardFriend({noti_id, avatar, display_name, id, typeView, id_delete}:Props) {
    const {user_id, socket} = useContext(AppContext);
    const queryClient = useQueryClient();
    const {toast} = useToast();

    const handleDeleteRequest = async() =>{
        if(!noti_id) return;
        await deleteNotification(noti_id)
        .then((data)=>{
            if(socket) socket.emit("cancel_request", user_id, id_delete, 0)
            toast({
                title: "Đã xóa lời mời!"
            })
            queryClient.invalidateQueries({queryKey:["List user"]});
            queryClient.invalidateQueries({queryKey:["friend_request"]});
            queryClient.invalidateQueries({queryKey:["friend_noti"]});
        })
        .catch((err)=>{
            toast({
                title: "Lỗi: " + err.message,
                variant: "destructive"
            });
        })
    }

    const handleAddFriend = async()=>{
        await createNotification({
            user_id: Number(id),
            message:" đã gửi lời mời kết bạn ",
            send_by: Number(user_id),
            type: "friend",
            status: 0
        })
        .then((data)=>{
            queryClient.invalidateQueries({queryKey:["List user"]});
            queryClient.invalidateQueries({queryKey:['friend_request']});
            queryClient.invalidateQueries({queryKey:["friend_noti"]});
            if(socket){
                socket.emit("friend_request",{user_id, friend_id:id});
            }
            toast({
                title: "Đã gửi lời mời kết bạn thành công"
            });
        })
        .catch((err)=>{
            toast({
                title: "Lỗi: " + err.message,
                variant: "destructive"
            });
        })
        
    }
    const handleAcceptFriend = (action:number) => {
        if(socket){
            if(!id || !user_id) return;
            socket.emit("friend_response",{noti_id, user_id, friend_id:id, action});
        }
        queryClient.invalidateQueries({queryKey:["List user"]});
        queryClient.invalidateQueries({queryKey:['friend_request']});
        queryClient.invalidateQueries({queryKey:["friend_noti"]});
    }
  return (
    <div className='md:w-52 w-36  shadow-md dark:bg-slate-800 h-fit rounded-xl overflow-hidden m-2'>
        <div className='md:h-[12rem] w-full overflow-hidden'>
            <Image src={avatar} height={192} width={208} alt="avatar"/>
        </div>
        <div className='font-semibold p-2 truncate'>
            {display_name}
            <br/>
        </div>
        <div className='p-2 space-y-1'>
            <Button className='w-full' color={"blue"} size="sm" onClick={
                typeView === "request" ? handleAddFriend :
                typeView === "confirm" ? ()=>handleAcceptFriend(1) : 
                typeView === "cancel" ? handleDeleteRequest : ()=>{}
            }>
                {typeView === "confirm" && "Xác nhận"}
                {typeView === "cancel" && "Hủy lời mời"} 
                {typeView === "request" && "Thêm bạn bè"}
            </Button>
            {typeView === "confirm" &&
                <Button color="gray" className='w-full' size="sm" onClick={typeView === "confirm" ? ()=>handleAcceptFriend(0): ()=>{}}>Xóa</Button>
            }
        </div>
    </div>
  )
}
