'use client'
import { useContext } from 'react'
import '../styles/loading.css'
import { AppContext } from '@/Context/Context';

export default function LoadingComponent() {
    const {isLoading} = useContext(AppContext);
    return (
        <>
        {isLoading ? 
            <div className="line-loading absolute top-0 z-50"></div> 
            : ''
        }
        </>
    )
}
