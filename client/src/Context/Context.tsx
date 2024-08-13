'use client'
import { AuthLogout } from "@/Services/auth.api";
import { createNotification } from "@/Services/notification.api";
import { UserFindOne } from "@/Services/user.api";
import { useToast } from "@/components/ui/use-toast";
import { NotificationRequestType, UserData } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Toast } from "flowbite-react";
import { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Peer from "peerjs";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import { FaSignOutAlt } from "react-icons/fa";
import { ToastAction } from "@/components/ui/toast";
interface AppContextType {
    display_name: string | null;
    setName: React.Dispatch<React.SetStateAction<string | null>>;
    isLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    user_data: UserData|null;
    setUser_data: React.Dispatch<React.SetStateAction<UserData|null>>;
    forceLogout: boolean;
    setForceLogout: React.Dispatch<React.SetStateAction<boolean>>;
    user_id:number;
    linked_account:string|null;
    email:string|null;
    avatar:StaticImageData|String|null;
    socket:Socket|null;
    current_friend: UserData|null;
    peer: Peer|null;
}

const defaultValue: AppContextType = {
    display_name: null,
    setName: () => {},
    isLoading: false,
    setLoading: ()=>{},
    user_data: null,
    setUser_data: ()=>{},
    forceLogout: false,
    setForceLogout: ()=>{},
    user_id:-1,
    linked_account:null,
    email: null,
    avatar: null,
    socket:null,
    current_friend:null,
    peer: null,
};

export const AppContext = createContext<any>(defaultValue);

export const useSocket = () => {
  return useContext(AppContext);
};

export default function AppProvider({children}:{children: ReactNode}){
    const router = useRouter();
    const {toast} = useToast();
    const [showToast, setShowToast] = useState(false);
    const pathname = usePathname();
    const [display_name, setName] = useState<string|null>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [user_data, setUser_data] = useState<UserData|null>(null);
    const [forceLogout, setForceLogout] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket|null>(null);
    const [current_friend, setCurrentFriend] = useState<UserData | null>(null);
    const user_id:number = Number(user_data?.id);
    const email:string = String(user_data?.email);
    const avatar:StaticImageData = user_data?.avatar as StaticImageData;
    const linked_account:string = String(user_data?.linked_account);
    const queryClient = useQueryClient();
    useEffect(()=>{
        const user_data = localStorage.getItem('user_data');
        if (user_data) {
            setUser_data(JSON.parse(user_data));
        }
    },[])
    useEffect(()=>{
        const friend = localStorage.getItem('user_data');
        if (!current_friend) {
            setCurrentFriend(JSON.parse(friend as string));
        }
    },[current_friend])
    useEffect(() => {
        const user_data = localStorage.getItem('user_data');
        if (user_data) {
            setName(JSON.parse(user_data).display_name);
        }
    }, []);
    useEffect(()=>{
        async function forceLog(){
            await AuthLogout(Number(user_id))
            .then(async(data)=>{
                //localStorage.removeItem('user_data');
                window.location.reload();
            })
            .catch(err=>{
                console.log(err)
            })
        }
        if(forceLogout) forceLog();
    },[forceLogout]);
    useEffect(() => {
        if(user_id){
            const socketIo:Socket = io('http://localhost:8888', {query:{user_id}});
            setSocket(socketIo);
            socketIo.on('connect', () => {
                socketIo.on('onChat', async(data:any) => {
                    const notification = data.data[data.data.length-1];
                    const user = await UserFindOne(notification.Send_by);
                    if(pathname !== '/chat'){
                        const noti:NotificationRequestType = {
                            user_id: user_id,
                            message: " đã gửi tin nhắn ",
                            send_by: notification?.Send_by,
                            type: "message",
                            status: 0,
                        }
                        await createNotification(noti)
                        .then(data=>{
                            toast({
                                title: user.data.data.display_name,
                                description:notification.Message
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    }
                });
            });
            socketIo.on("online",(friend)=>{
                queryClient.invalidateQueries({queryKey:['active_sts']});
                queryClient.invalidateQueries({queryKey:['message_noti']});
            });
            socketIo.on("addFriend_notification", async(friend)=>{
                toast({
                    title:`Bạn có một lời mời kết bạn mới `
                })
                queryClient.invalidateQueries({queryKey:["friend_noti"]});
                queryClient.invalidateQueries({queryKey:["List user"]});
            });
            socketIo.on("friend_res_noti",(friend)=>{
                toast({
                    title:`Bạn và ${friend?.display_name} đã trở thành bạn bè`
                })
                queryClient.invalidateQueries({queryKey:["friend_noti"]});
            });
            socketIo.on("resFriend_notification", (friend)=>{
                toast({
                    title:`${friend?.display_name} đã đồng ý lời mời kết bạn`
                })
                queryClient.invalidateQueries({queryKey:["friend_request"]});
            });
            
            socketIo.on("user-joinIn", (userJoin:any)=>{
                if(pathname.includes("/onMeeting/")){
                    queryClient.invalidateQueries({queryKey:['user_join']});
                    toast({
                        title: userJoin?.display_name + " đã tham gia phòng họp"
                    })
                }
            })
            socketIo.on("cancel_request",()=>{
                queryClient.invalidateQueries({queryKey:["List user"]});
                queryClient.invalidateQueries({queryKey:["friend_request"]});
                queryClient.invalidateQueries({queryKey:["friend_noti"]});
            })
            socketIo.on("room-chat",(user_id, message)=>{
                if(pathname.includes("/onMeeting/")){
                    queryClient.invalidateQueries({queryKey:['room_message_list']})
                }
            })

            socketIo.on("reject_meeting",(display_name, message)=>{
                if(pathname.includes("/onMeeting/")){
                    toast({
                        title:display_name+ " đã từ chối tham gia phòng họp ",
                        description: "Lý do: " + message
                    })
                }
            })

            socketIo.on("user-leftRoom",(userJoin:any)=>{
                if(pathname.includes("/onMeeting/")){
                    queryClient.invalidateQueries({queryKey:['user_join']});
                    toast({
                        title: userJoin?.display_name + " đã rời phòng họp"
                    })
                }
            })
            
            socketIo.on("meeting_invitation",()=>{
                queryClient.invalidateQueries({queryKey:['list_invite']})
                toast({
                    title:"Cuộc họp mới",
                    description: "Bạn có lời mời họp mới"
                })
            })

            window.addEventListener('beforeunload', async () => {
                socketIo.emit('user_disconnected', { user_id });
            });
            return () => {
                socketIo.disconnect();
            };
        }
    }, [user_id, pathname]);

    useEffect(()=>{
        // router.prefetch('/user');
        // router.prefetch('/profile');
        // router.prefetch('/chat');
        // router.prefetch('/login');
        // router.prefetch('/register');
        // router.prefetch('/');
        // router.prefetch('/local_');
        // router.prefetch('/schedule');
        // router.prefetch('/friends');
        // router.prefetch('/onMeeting/:room_id');
        router.prefetch('/meeting');
    },[router, user_id])
    return (
        <AppContext.Provider value={{display_name, setName, 
            isLoading, setLoading, 
            user_data, setUser_data, 
            forceLogout, setForceLogout, 
            user_id, linked_account, 
            email, avatar, socket,
            current_friend, setCurrentFriend}}>
            {children}
            {showToast && 
                <Toast className="flex flex-col items-center justify-center fixed right-2 bottom-2">
                    <Toast.Toggle onDismiss={() => setShowToast(false)} />
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full  bg-red-700 text-red-500 dark:bg-red-800">
                        <FaSignOutAlt/>
                    </div>
                    <div className="mt-3 font-bold text-xl text-center">Bạn đã bị chủ phòng mời ra khỏi phòng</div>
                </Toast>
            }
        </AppContext.Provider>
    )
}