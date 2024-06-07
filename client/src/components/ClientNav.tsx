'use client'
import React from 'react'
import Navbar from './ui/Navbar'
import SideBar from './ui/Sidebar'
import { usePathname } from 'next/navigation';

export default function ClientNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isLoginRoute = pathname === '/login';
  return (
    <>
        {!isLoginRoute ? <>
            <Navbar/>
            <SideBar/>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-16">
                    <div className="grid grid-cols-3 gap-4 ">
                      {children}
                    </div>
                </div>
              </div>
        </>:<>{children}</>}
        
    </>

  )
}
