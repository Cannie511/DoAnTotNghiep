import React, { useContext } from 'react'
import SkeletonFriendComponent from './SkeletonFriendCoponent';
import { Button } from 'flowbite-react';
import { url_img_default } from '@/images/image';
import CardFriend from './CardFriend';
import { AppContext } from '@/Context/Context';
interface Props{
    dataList: [];
    isLoading:boolean;
    header:string;
    btn_content:string;
    typeView:string;
}
export default function FriendView({dataList,isLoading, header, btn_content, typeView}:Props) {
    const {user_id} = useContext(AppContext)
    if(dataList && dataList.length !== 0)
  return (
    <>
        <h1 className='text-2xl font-bold mt-3'>{header}</h1>
        <div className='flex flex-wrap my-2'>
            {isLoading &&
                <>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                    <SkeletonFriendComponent/>
                </>
            }
            {!isLoading && dataList && dataList.map((item:any)=>{
                return(
                    <CardFriend typeView={typeView} key={item?.id} noti_id={item?.id} avatar={item?.avatar||url_img_default} id={item?.send_by || item?.id} id_delete={item?.user_id} display_name={item?.display_name}/>
                )
            })} 
        </div>
        <Button className='w-full border-none my-2' color={"gray"}>Xem thêm</Button>
        <hr />
    </>
  )
}
