'use client'
import { ReactNode, createContext, useEffect, useState } from "react";

interface AppContextType {
    display_name: string | null;
    setName: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultValue: AppContextType = {
    display_name: null,
    setName: () => {},
};

export const AppContext = createContext<AppContextType>(defaultValue);

export default function AppProvider({children}:{children: ReactNode}){
    const [display_name, setName] = useState<string|null>('')
    useEffect(() => {
        const user_data = sessionStorage.getItem('user_data');
        if (user_data) {
            setName(JSON.parse(user_data).display_name);
        }
    }, []);
    return (
        <AppContext.Provider value={{display_name, setName}}>
            {children}
        </AppContext.Provider>
    )
}