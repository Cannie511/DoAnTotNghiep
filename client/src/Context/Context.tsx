'use client'
import { AuthLogout } from "@/Services/auth.api";
import { UserFindOne } from "@/Services/user.api";
import { useToast } from "@/components/ui/use-toast";
import { UserData } from "@/types/type";
import { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
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
    const [isLoading, setLoading] = useState<boolean>(false);
    const [user_data, setUser_data] = useState<UserData|null>(null);
    const [forceLogout, setForceLogout] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket|null>(null);
    const [current_friend, setCurrentFriend] = useState<UserData | null>(null);
    const user_id:number = Number(user_data?.id);
    const email:string = String(user_data?.email);
    const avatar:StaticImageData = user_data?.avatar as StaticImageData;
    const linked_account:string = String(user_data?.linked_account);
    useLayoutEffect(()=>{
        const user_data = sessionStorage.getItem('user_data');
        if (user_data) {
            setUser_data(JSON.parse(user_data));
        }
    },[])
    useLayoutEffect(()=>{
        const friend = localStorage.getItem('user_data');
        if (!current_friend) {
            setCurrentFriend(JSON.parse(friend as string));
        }
    },[current_friend])
    useLayoutEffect(() => {
        const user_data = sessionStorage.getItem('user_data');
        if (user_data) {
            setName(JSON.parse(user_data).display_name);
        }
    }, []);
    useEffect(()=>{
        async function forceLog(){
            const id = await user_data?.id;
            await AuthLogout(Number(id))
            .then(data=>{
                sessionStorage.removeItem('user_data');
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
                console.log('Connect to server successfully');
                socketIo.on('onChat', async(data:any) => {
                    console.log(data);
                    const notification = data.data[data.data.length-1];
                    const user = await UserFindOne(notification.Send_by);
                    if(pathname !== '/chat'){
                        toast({
                            title: user.data.data.display_name,
                            description:notification.Message
                        })
                    }
                });
            });
            return () => {
                socketIo.disconnect();
            };
        }
    }, [user_id, pathname]);
    useEffect(()=>{
        router.prefetch('/user');
        router.prefetch('/profile');
        router.prefetch('/chat');
        router.prefetch('/login');
        router.prefetch('/register');
        router.prefetch('/');
        router.prefetch('/local_');
        router.prefetch('/schedule');
    },[router])
    return (
        <AppContext.Provider value={{display_name, setName, 
            isLoading, setLoading, 
            user_data, setUser_data, 
            forceLogout, setForceLogout, 
            user_id, linked_account, 
            email, avatar, socket,
            current_friend, setCurrentFriend}}>
            {children}
        </AppContext.Provider>
    )
}