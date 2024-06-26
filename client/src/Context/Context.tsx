'use client'
import { AuthLogout } from "@/Services/auth.api";
import { UserData } from "@/types/type";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useEffect, useLayoutEffect, useState } from "react";

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
};

export const AppContext = createContext<any>(defaultValue);

export default function AppProvider({children}:{children: ReactNode}){
    const router = useRouter();
    
    const [display_name, setName] = useState<string|null>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [user_data, setUser_data] = useState<UserData|null>(null);
    const [forceLogout, setForceLogout] = useState<boolean>(false); 
    const user_id:number = Number(user_data?.id);
    const email:string = String(user_data?.email);
    const avatar:StaticImageData = user_data?.avatar as StaticImageData;
    const linked_account:string = String(user_data?.linked_account)
    useLayoutEffect(()=>{
        const user_data = sessionStorage.getItem('user_data');
        if (user_data) {
            setUser_data(JSON.parse(user_data));
        }
    },[])
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
    },[forceLogout])
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
            email, avatar}}>
            {children}
        </AppContext.Provider>
    )
}