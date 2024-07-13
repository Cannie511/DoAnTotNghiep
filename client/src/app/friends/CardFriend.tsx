import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { addFriend } from '@/Services/friend.api';
import { createNotification } from '@/Services/notification.api';
import { Button } from 'flowbite-react'
import Image, { StaticImageData } from 'next/image'
import React, { useContext } from 'react'
import { MdPersonAddAlt1 } from "react-icons/md";

interface Props{
    avatar: string|StaticImageData;
    display_name:string;
    id:number;
}

export default function CardFriend({avatar, display_name, id}:Props) {
    const {user_id, socket} = useContext(AppContext);
    const {toast} = useToast();
    const handleAddFriend = async()=>{
        // await addFriend(user_id, id)
        // .then(async(data)=>{
        //     await createNotification({user_id: id, message: " đã gửi lời mời kết bạn ", send_by: user_id, type:"friend", status:0 })
        //     .then((res)=>{
        //         toast({
        //             title: "Đã gửi lời mời kết bạn thành công"
        //         });
        //         if(socket){
        //             socket.emit("friend_request",{user_id, friend_id:id});
        //         }
        //     })
        //     .catch((err)=>{
        //         console.log(err);
        //         toast({
        //             title: "Đã có lỗi xảy ra",
        //             variant:"destructive"
        //         })
        //     })
        // })
        // .catch((err)=>{
        //     console.log(err);
        //     toast({
        //         title: "Đã có lỗi xảy ra",
        //         variant:"destructive"
        //     })
        // })

         toast({
            title: "Đã gửi lời mời kết bạn thành công"
        });
        if(socket){
            socket.emit("friend_request",{user_id, friend_id:id});
        }
    }
  return (
    <div className='w-51 shadow-md dark:bg-slate-800 h-[22rem] rounded-md overflow-hidden m-2'>
        <div className='h-[12rem] w-full overflow-hidden'>
            <Image src={avatar} height={192} width={208} alt="avatar"/>
        </div>
        <div className='font-semibold p-2 truncate'>
            {display_name}
            <br/>
            <small>
                {/* <Avatar.Group>
                    <Avatar img={"@/app/favicon.ico"} rounded stacked />
                    <Avatar img={"@/app/favicon.ico"} rounded stacked />
                    <Avatar.Counter total={2} href="#" />
                </Avatar.Group> */}
                3 bạn chung
            </small>
        </div>
        <div className='p-2 space-y-1'>
            <Button className='w-full' color={"blue"} size="sm" onClick={handleAddFriend}>
                Thêm bạn bè 
                <MdPersonAddAlt1 className='text-lg ml-1'/>
            </Button>
            <Button color="gray" className='w-full' size="sm">Xóa</Button>
        </div>
    </div>
  )
}
