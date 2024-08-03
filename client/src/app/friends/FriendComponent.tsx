'use client'
import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { AppContext } from '@/Context/Context';
import { getFriend } from '@/Services/friend.api';
import Image from 'next/image';
import { url_img_default } from '@/images/image';
import { Skeleton } from '@/components/ui/skeleton';
import { AiFillMessage } from "react-icons/ai";
import { HiUserRemove } from "react-icons/hi";
import { Tooltip } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import ConfirmDeleteFriend from './ConfirmDeleteFriend';

interface FriendType {
  Friend_id: number;
  display_name: string;
}

export default function FriendComponent() {
    const {user_id} = useContext(AppContext);
    const router = useRouter();
    const [friendData, setFriendData] = useState<FriendType>({Friend_id: -1, display_name: ""});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {data:list_friend, isLoading} = useQuery({
        queryKey:["list_friend_1"],
        queryFn:()=>getFriend(Number(user_id), 1),
        enabled: !!user_id
    })
    const handleChangFriend = (friend:any) =>{
      const chosenFriend = {
        id:friend?.Friend_ID,
        display_name:friend["Friend.display_name"],
        avatar: friend["Friend.avatar"]
      }
      localStorage.setItem("friend",JSON.stringify(chosenFriend));
      router.push("/chat")
    }
    const list_friend_accepted:any = list_friend?.data?.data;
    const onConfirmDelete = ({Friend_id, display_name}:FriendType)=>{
      setFriendData({Friend_id, display_name});
      setOpenModal(true);
    }
  return (
    <div>
      <div className='space-y-2 mt-10'>
        {isLoading || !list_friend_accepted &&
          <>
            <Skeleton className='w-[32rem] h-20'/>
            <Skeleton className='w-[32rem] h-20'/>
            <Skeleton className='w-[32rem] h-20'/>
          </>
        }
        {list_friend_accepted && list_friend_accepted.map((item:any)=>{
          return(
            <div key={item?.id} 
            className="
            cursor-pointer dark:hover:bg-gray-700 transition-all 
            hover:bg-slate-100 flex rounded-lg border w-[32rem] border-gray-200 
            bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 
              p-4 items-center">
              <div className='flex-auto'>
                  <div className="flex items-center space-x-3">
                  <div className="shrink-0">
                      <Image
                      alt="Neil image"
                      height="50"
                      src={item["Friend.avatar"].toString() || url_img_default}
                      width="50"
                      className="rounded-full"
                      />
                  </div>
                  <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item["Friend.display_name"]}</p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">0 bạn bè</p>
                  </div>
                  </div>
              </div>
              
              <div className='flex flex-none space-x-2'>
                <Tooltip content="Nhắn tin">
                    <AiFillMessage className='text-gray-500 hover:text-gray-200 transition-all text-3xl '
                      onClick={()=>handleChangFriend(item)}
                    />
                </Tooltip>
                <Tooltip content="Xóa bạn bè">
                    <HiUserRemove className='text-red-600 hover:text-red-400 transition-all text-3xl ' 
                    onClick={()=>onConfirmDelete({Friend_id: item?.Friend_ID, display_name: item["Friend.display_name"]})}/>
                </Tooltip>
              </div>
            </div>
          )
        })}
      </div>
      {friendData && friendData?.Friend_id !== -1 && 
        <ConfirmDeleteFriend openModal={openModal} setOpenModal={setOpenModal} display_name={friendData?.display_name} friend_id={friendData?.Friend_id}/>
      }
    </div>
  )
}
