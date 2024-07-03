import { getUsers } from "@/Services/auth.api";
import { useQuery } from "@tanstack/react-query";
import Image, { StaticImageData } from "next/image";
import { FaUserFriends } from "react-icons/fa";
import logoNext from "@/app/favicon.ico"
import { Skeleton } from "@/components/ui/skeleton";
import { UserData } from "@/types/type";
import { useContext } from "react";
import { AppContext } from "@/Context/Context";
interface Props{
    setFriend: React.Dispatch<React.SetStateAction<UserData | null >>
}
export default function ListFriend({setFriend}:Props) {
    const {socket, user_id} = useContext(AppContext);
    const {data, isLoading, error} = useQuery({
        queryKey:['List user'],
        queryFn: ()=>getUsers(3),
    })
    const {setForceLogout} = useContext(AppContext);
    if(error) setForceLogout(true);
    const handleFriend = (friend:UserData|null)=>{
        //socket.join(user_id as string + friend?.id as string);
        setFriend(friend);
        localStorage.setItem('friend', JSON.stringify(friend));
    }
  return (
    <div className='hidden md:flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col flex-none w-72 px-1 py-4 overflow-y-auto'>
      <div className='w-full relative top-0 p-2 rounded-md dark:text-white text-black'>
        <h1 className='text-2xl text-black dark:text-white flex'><FaUserFriends className="text-3xl me-2 relative"/> Bạn bè</h1>
      </div>
      <div className='h-[43rem] w-full rounded-sm space-y-1'>
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
        {data?.data?.data?.map((item:UserData)=>{
            return (
                <div key={item?.id} className='cursor-pointer dark:hover:bg-gray-700 transition-all hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col flex-none px-2 py-4'
                    onClick={()=>handleFriend(item)}
                >
                    <div className="flex items-center space-x-3">
                    <div className="shrink-0">
                        <Image
                        alt="Neil image"
                        height="32"
                        src={item?.avatar as StaticImageData || logoNext}
                        width="32"
                        className="rounded-full"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item?.display_name}</p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item?.email}</p>
                    </div>
                    {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div> */}
                    </div>
                </div>
            )
        })}
        
      </div>
      
    </div>
  )
}
