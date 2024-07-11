'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { IoNotifications } from "react-icons/io5";
import { getNotification, updateNotification } from '@/Services/notification.api';
import { AppContext } from '@/Context/Context';
import { useContext } from 'react';
import { Avatar } from 'flowbite-react';
import { url_img_default } from '@/images/image';
import { useRouter } from 'next/navigation';
export default function DropdownDefault() {
  const {user_id} = useContext(AppContext);
  const queryClient = useQueryClient();
  const router = useRouter();
  const {data, isLoading, error} = useQuery({
    queryKey:['notification_init'],
    queryFn:()=>getNotification({user_id: user_id, type: "message"}),
    enabled: !!user_id
  })
  const handleReadNoti = async(type:string ,id:number)=>{
    const url:string = type === "message" ? "/chat":"/";
    router.push(url);
    await updateNotification(id)
    .then((data)=>{
      queryClient.invalidateQueries({queryKey:['message_noti']});
      queryClient.invalidateQueries({queryKey:['notification_init']});
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  let notificationList:any = data?.data;
  return (
     <DropdownMenu>
      <DropdownMenuTrigger>
        <>
          <div className='w-5 h-5 flex items-center justify-center rounded-full bg-red-600 absolute ml-5 -mt-2 text-xs text-white'>1</div>
          <IoNotifications className='text-3xl'/>
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-3 py-1' align="end">
        {notificationList 
        && notificationList.map((noti:any, index:number)=>{
          return(
            <DropdownMenuItem className={noti?.status === 1 ? 'cursor-pointer':'cursor-pointer bg-gray-700'} key={index} onClick={()=>handleReadNoti(noti?.type, noti?.id)}>
              <div className='flex space-x-2 items-center'>
                <Avatar rounded img={ noti["Sender.avatar"] || url_img_default} size={"sm"}/>
                <div><b>{noti["Sender.display_name"]}</b>{noti?.message}</div>
              </div>
            </DropdownMenuItem>
          )
        })}
        {notificationList?.length === 0 &&
          <div>
            <strong>Chưa có thông báo nào</strong>
          </div>
        }
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
