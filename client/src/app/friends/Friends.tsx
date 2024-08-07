'use client'
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { AppContext } from '@/Context/Context';
import { getFriendRequest, getNotification } from '@/Services/notification.api';
import FriendView from './FriendView';
import { getSuggestFriend } from '@/Services/friend.api';
export default function Friends() {
    const {user_id} = useContext(AppContext);
    const {data:listUser, isLoading, error:err_user} = useQuery({
        queryKey:['List user'],
        queryFn: ()=>getSuggestFriend(Number(user_id),1),
        enabled:!!user_id
    })
    const {data:friendRequest, isLoading:loading_fr_req, error:err_fr_req} = useQuery({
        queryKey:['friend_request'],
        queryFn: ()=>getFriendRequest({send_by:user_id, type:"friend", status:0}),
        enabled: !!user_id 
    })
    const {data:friend_noti, isLoading:loading_fr_noti, error:err_fr} = useQuery({
        queryKey:['friend_noti'],
        queryFn: ()=>getNotification({user_id, type:"friend", status:0}),
        enabled: !!user_id  
    })
    const listFriend = listUser?.data?.data;
    const acceptedList:any = friend_noti?.data;
    const friendReq:any = friendRequest?.data;
  return (
    <>
        <FriendView header='Lời mời kết bạn' dataList={acceptedList} isLoading={isLoading} btn_content={"Xác nhận"} typeView='confirm'/>
        <FriendView header='Đã gửi lời mời' dataList={friendReq} isLoading={loading_fr_req} btn_content='Hủy lời mời' typeView='cancel'/>
        <FriendView header='Gợi ý cho bạn' dataList={listFriend} isLoading={loading_fr_noti} btn_content='Thêm bạn bè' typeView='request'/>
    </>
  )
}
