'use client'
import React, { Suspense } from 'react'
import Navbar from './ui/Navbar'
import SideBar from './ui/Sidebar'
import { usePathname } from 'next/navigation';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { authRoute } from '@/middleware';
import Loading from '@/app/loading';
export default function ClientNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
    const pathname = usePathname();
    const isLoginRoute = authRoute.some(path=>pathname.startsWith(path));
  return (
    <>
        {!isLoginRoute ? <>
        
        <QueryClientProvider client={queryClient}>
          
            <Navbar/>
            <SideBar/>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-16">
                    <div className="grid gap-4 ">
                      {children}
                    </div>
                </div>
              </div>
        </QueryClientProvider>
        
        </>:<>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        </>}
        
    </>

  )
}
