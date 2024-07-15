import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'flowbite-react'
import Image, { StaticImageData } from 'next/image'
import React, { useContext } from 'react'

interface Props{
    noti_id: number;
    avatar: string|StaticImageData;
    display_name:string;
    id:number;
    typeView:string;
}

export default function CardFriend({noti_id, avatar, display_name, id, typeView}:Props) {
    const {user_id, socket} = useContext(AppContext);
    const queryClient = useQueryClient();
    const {toast} = useToast();
    const handleAddFriend =()=>{
        queryClient.invalidateQueries({queryKey:['friend_request']});
        if(socket){
            socket.emit("friend_request",{noti_id, user_id, friend_id:id});
        }
        toast({
            title: "Đã gửi lời mời kết bạn thành công"
        });
    }
    const handleAcceptFriend = (action:number) => {
        if(socket){
            if(!id || !user_id) return;
            socket.emit("friend_response",{noti_id, user_id, friend_id:id, action});
        }
    }
  return (
    <div className='w-51 shadow-md dark:bg-slate-800 h-[22rem] rounded-xl overflow-hidden m-2'>
        <div className='h-[12rem] w-full overflow-hidden'>
            <Image src={avatar} height={192} width={208} alt="avatar"/>
        </div>
        <div className='font-semibold p-2 truncate'>
            {display_name}
            <br/>
            <small>
                0 bạn chung
            </small>
        </div>
        <div className='p-2 space-y-1'>
            <Button className='w-full' color={"blue"} size="sm" onClick={
                typeView === "request" ? handleAddFriend :
                typeView === "confirm" ? ()=>handleAcceptFriend(1) : ()=>{}
            }>
                {typeView === "confirm" && "Xác nhận"}
                {typeView === "cancel" && "Hủy lời mời"} 
                {typeView === "request" && "Thêm bạn bè"}
            </Button>
            <Button color="gray" className='w-full' size="sm" onClick={typeView === "confirm" ? ()=>handleAcceptFriend(0): ()=>{}}>Xóa</Button>
        </div>
    </div>
  )
}
