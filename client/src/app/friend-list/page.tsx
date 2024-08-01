import React from 'react'
import { FaUserFriends } from "react-icons/fa";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
const FriendComponent = dynamic(()=>import("../friends/FriendComponent"),{
  loading: ()=><Skeleton className="w-full h-[80vh]"/>
})

export const metadata: Metadata = {
  title:'Danh sách bạn bè',
  description:'List Friend Page'
}
export default function friendListHaveAccepted() {
  return (
    <div>
      <h1 className='text-2xl font-bold mt-3 flex'><FaUserFriends className="text-3xl me-2 relative "/> Danh sách bạn bè</h1>
        <FriendComponent/>
    </div>
  )
}
