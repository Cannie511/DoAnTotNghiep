'use client'
import { AuthLogout } from "@/Services/auth.api";
import { createNotification } from "@/Services/notification.api";
import { UserFindOne } from "@/Services/user.api";
import { useToast } from "@/components/ui/use-toast";
import { NotificationRequestType, UserData } from "@/types/type";
import { useQueryClient } from "@tanstack/react-query";
import { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Peer from "peerjs";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';

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
    const pathname = usePathname();
    const [display_name, setName] = useState<string|null>('');
    const [peer, setPeer] = useState<Peer | null>(null);
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
                const noti:NotificationRequestType = {
                    user_id: user_id,
                    message: " đã gửi lời mời kết bạn ",
                    send_by: friend?.id,
                    type: "friend",
                    status: 0,
                }
                await createNotification(noti)
                .then(()=>{
                    queryClient.invalidateQueries({queryKey:["friend_noti"]})
                    toast({
                        title: "Lời mời kết bạn",
                        description:"Bạn có 1 lời mời kết bạn từ " + friend?.display_name
                    });
                })
                .catch((err)=>{
                    toast({
                        title: "Lỗi: " + err.message,
                        variant:"destructive"
                    });
                })
            })
            socketIo.on("friend_res_noti",(friend)=>{
                toast({
                    title:`Bạn và ${friend?.display_name} đã trở thành bạn bè`
                })
                queryClient.invalidateQueries({queryKey:["friend_noti"]});
            })
            socketIo.on("resFriend_notification", (friend)=>{
                toast({
                    title:`${friend?.display_name} đã đồng ý lời mời kết bạn`
                })
                queryClient.invalidateQueries({queryKey:["friend_request"]});
            })
            
            socketIo.on("user-joinIn", (userJoin:any)=>{
                if(pathname.includes("/onMeeting/")){
                    queryClient.invalidateQueries({queryKey:['user_join']});
                    toast({
                        title: userJoin?.display_name + " đã tham gia phòng họp"
                    })
                }
            })
            socketIo.on("room-chat",(user_id, message)=>{
                if(pathname.includes("/onMeeting/")){
                    console.log(user_id + " :" + message)
                }
            })
            socketIo.on("on-Mic",(user_id)=>{
                if(pathname.includes("/onMeeting/")){
                    console.log(user_id + " bật mic")
                    queryClient.invalidateQueries({queryKey:["user_join"]});
                }
            })
            socketIo.on("off-Mic",(user_id)=>{
                if(pathname.includes("/onMeeting/")){
                    console.log(user_id + " tắt mic")
                    queryClient.invalidateQueries({queryKey:["user_join"]});
                }
            })

            socketIo.on("on-Cam",(user_id)=>{
                if(pathname.includes("/onMeeting/")){
                    console.log(user_id + " bật cam");
                    queryClient.invalidateQueries({queryKey:["user_join"]});
                }
            })

            socketIo.on("off-Cam",(user_id)=>{
                if(pathname.includes("/onMeeting/")){
                    console.log(user_id + " tắt cam");
                    queryClient.invalidateQueries({queryKey:["user_join"]});
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
        
            window.addEventListener('beforeunload', async () => {
                socketIo.emit('user_disconnected', { user_id });
            });
            return () => {
                socketIo.disconnect();
            };
        }
    }, [user_id, pathname]);

    useEffect(()=>{
        // if(user_id){
        //     const peer = new Peer(user_id.toString(), {
        //         host: 'localhost',
        //         port: 1234,
        //         path: '/peer-server'
        //     });
        //     setPeer(peer);
        // }
    },[user_id])

    useEffect(()=>{
        router.prefetch('/user');
        router.prefetch('/profile');
        router.prefetch('/chat');
        router.prefetch('/login');
        router.prefetch('/register');
        router.prefetch('/');
        router.prefetch('/local_');
        router.prefetch('/schedule');
        router.prefetch('/onMeeting/:room_id');
    },[router])
    return (
        <AppContext.Provider value={{display_name, setName, 
            isLoading, setLoading, 
            user_data, setUser_data, 
            forceLogout, setForceLogout, 
            user_id, linked_account, 
            email, avatar, socket,
            current_friend, setCurrentFriend, peer}}>
            {children}
        </AppContext.Provider>
    )
}