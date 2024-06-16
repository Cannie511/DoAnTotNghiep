'use client'
import { AuthCheckSession, AuthLogout } from "@/Services/auth.api";
import { UserData } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
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
};

export const AppContext = createContext<any>(defaultValue);

export default function AppProvider({children}:{children: ReactNode}){
    const [display_name, setName] = useState<string|null>('');
    const [isLoading, setLoading] = useState<boolean>(true);
    const [user_data, setUser_data] = useState<UserData|null>(null);
    const [forceLogout, setForceLogout] = useState<boolean>(false); 
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
            await AuthLogout();
            window.location.reload();
        }
        if(forceLogout) forceLog();
    },[forceLogout])
    return (
        <AppContext.Provider value={{display_name, setName, isLoading, setLoading, user_data, setUser_data, forceLogout, setForceLogout}}>
            {children}
        </AppContext.Provider>
    )
}