'use client'
import SkeletonFriendComponent from './SkeletonFriendCoponent';
import CardFriend from './CardFriend';
import { Button } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/Services/auth.api';
import { url_img_default } from "@/images/image";
import { useContext } from 'react';
import { AppContext } from '@/Context/Context';
import { getNotification } from '@/Services/notification.api';
import CardAccept from './CardAccepted';
export default function Friends() {
    const {user_id} = useContext(AppContext);
    const {data:listUser, isLoading, error} = useQuery({
        queryKey:['List user'],
        queryFn: ()=>getUsers(1),
    })
    const {data:friend_noti, error:err_fr} = useQuery({
        queryKey:['friend_noti'],
        queryFn: ()=>getNotification({user_id, type:"friend"}),
        enabled: !!user_id  
    })
    console.log(friend_noti)
    const listFriend = listUser?.data.data.filter((x:any)=>x.id!==user_id);
    const acceptedList:any = friend_noti?.data;
  return (
    <>
        <h1 className='text-2xl font-bold'>Gợi ý cho bạn</h1>
        <div className='flex flex-wrap my-2'>
            {listFriend && listFriend.map((item:any)=>{
                return(
                    <CardFriend key={item?.id} avatar={item.avatar||url_img_default} id={item?.id} display_name={item.display_name}/>
                )
            })} 
            {isLoading &&
                <>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                </>
            }
        </div>
        <Button className='w-full border-none my-2' color={"gray"}>Xem thêm</Button>
        <hr />

        <h1 className='text-2xl font-bold mt-5'>Lời mời kết bạn</h1>
        <div className='flex flex-wrap my-2'>
            {acceptedList && acceptedList.map((item:any)=>{
                return(
                    <CardAccept key={item?.id} avatar={item["Sender.avatar"]||url_img_default} id={item?.id} display_name={item["Sender.display_name"]}/>
                )
            })} 
            {isLoading &&
                <>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                </>
            }
        </div>
        <Button className='w-full border-none my-2' color={"gray"}>Xem thêm</Button>
        <hr />
    </>
  )
}
