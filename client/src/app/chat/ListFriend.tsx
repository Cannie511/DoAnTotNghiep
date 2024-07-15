import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image, { StaticImageData } from "next/image";
import { FaUserFriends } from "react-icons/fa";
import logoNext from "@/app/favicon.ico"
import { Skeleton } from "@/components/ui/skeleton";
import { UserData } from "@/types/type";
import { useContext, useEffect } from "react";
import { AppContext } from "@/Context/Context";
import { getLatestMessage } from "@/Services/message.api";
import { TextInput } from "flowbite-react";
interface Props{
    friend: UserData | null;
    setFriend: React.Dispatch<React.SetStateAction<UserData | null >>
}
export default function ListFriend({setFriend, friend}:Props) {
    const {user_id} = useContext(AppContext);
    const {data, isLoading, error} = useQuery({
        queryKey:['list friend'],
        queryFn: ()=>getLatestMessage(user_id),
    })
    const messageList = data?.data?.data;
    const {setForceLogout} = useContext(AppContext);
    if(error) setForceLogout(true);
    const handleFriend = (friend:any)=>{
        const data = {
            id: friend?.Send_by === user_id ? friend.Received_by : friend?.Send_by,
            display_name: friend.Send_by === user_id ? friend.receiver_display_name : friend?.sender_display_name,
            avatar: friend?.Send_by === user_id ? friend?.receiver_avt as StaticImageData : friend?.sender_avt as StaticImageData,
        }
        setFriend(data as UserData);
        localStorage.setItem('friend', JSON.stringify(data));
    }
  return (
    <div className='hidden md:flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col flex-none w-72 px-1 py-4 overflow-y-auto'>
      <div className='w-full relative top-0 p-2 rounded-md dark:text-white text-black'>
        <h1 className='text-2xl text-black dark:text-white flex'><FaUserFriends className="text-3xl me-2 relative"/> Bạn bè</h1>
      </div>
      <TextInput placeholder="Tìm kiếm" color="info"/>
      <div className='h-[43rem] w-full rounded-sm space-y-1 mt-2'>
        {isLoading && 
        <>
            <div className='flex rounded-lg border w-full border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col flex-none px-2 py-4'>
                <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
                </div>
            </div>
        </>}
        {messageList && messageList.map((item:any)=>{
            return (
                <div key={item?.id} className=
                {friend?.id === item?.Send_by || friend?.id === item.Received_by ? 
                    'cursor-pointer dark:hover:bg-gray-700 transition-all hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 bg-gray-300 shadow-md dark:border-gray-700 dark:bg-gray-700 flex-col flex-none px-2 py-4':
                    'cursor-pointer dark:hover:bg-gray-700 transition-all hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col flex-none px-2 py-4'
                }
                    onClick={()=>handleFriend(item)}
                >
                    <div className="flex items-center space-x-3">
                    <div className="shrink-0">
                        <Image
                        alt="Neil image"
                        height="32"
                        src={item?.Send_by === user_id ? item?.receiver_avt as StaticImageData : item?.sender_avt as StaticImageData || logoNext}
                        width="32"
                        className="rounded-full"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item?.Send_by === user_id ? item?.receiver_display_name : item?.sender_display_name}</p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item?.Send_by === user_id ? "Bạn:":""} {item?.Message}</p>
                    </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}
