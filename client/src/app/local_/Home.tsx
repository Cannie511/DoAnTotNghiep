'use client'
import { formatDate, getCurrentTime } from '@/Utils/formatDate';
import { Card } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FaRegMoon, FaSun } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import { HiVideoCamera } from "react-icons/hi2";
import { FaCalendarPlus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { FaUserFriends } from "react-icons/fa";
export default function HomePage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [currentDate, setCurrentDate] = useState(formatDate(new Date() as any));
     useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
            setCurrentDate(formatDate(new Date() as any));
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className='h-96 w-full mx-auto space-y-5'>
            <Card className="space-y-1 h-[18rem] bg-[url('/images/banner.jpg')] bg-cover bg-center w-full text-left">
                <strong className='text-6xl font-bold flex mt-32'>
                    {Number(currentTime.split(':')[0]) > 17 ? <FaRegMoon className='relative top-1 me-2'/>
                :<FaSun className='relative top-1 me-2'/>} {currentTime}</strong>
                <div>
                    <span>{currentDate}</span>
                </div>
            </Card>
            <div className='w-100 mx-auto space-y-2 my-2'>
                <div className='w-full flex space-x-2'>
                    <div className='flex-1'>
                        <div onClick={()=>router.push('/chat')} className='w-full h-72 text-left bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg
                        hover:bg-gradient-to-l transition-all cursor-pointer p-3'>
                            <div className='rounded-xl w-fit bg-white bg-opacity-50 p-1'>
                                <IoChatbubbles className='text-4xl opacity-100'/>
                            </div>
                            <div className='relative top-36 space-y-2'>
                                <div className='text-black dark:text-white font-bold text-3xl text-left'>Trò chuyện</div>
                                <div className='text-black dark:text-gray-200 font-semibold text-left text-wrap'>Tham gia các cuộc trò chuyện với bạn bè của bạn</div>
                            </div>
                        </div>
                        
                    </div>
                    <div className='flex-1'>
                        <div onClick={()=>router.push('/schedule')} className='w-full h-72 text-left bg-gradient-to-r from-green-700 from-10% to-emerald-500 rounded-lg
                        hover:bg-gradient-to-l transition-all cursor-pointer p-3'>
                            <div className='rounded-xl w-fit bg-white bg-opacity-50 p-2'>
                                <FaCalendarPlus className='text-3xl'/>
                            </div>
                            <div className='relative top-36 space-y-2'>
                                <div className='text-black dark:text-white font-bold text-3xl text-left'>Lịch trình</div>
                                <div className='text-black dark:text-gray-200 font-semibold text-left text-wrap'>Tạo lịch cho các cuộc họp trong tương lai</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div onClick={()=>router.push('/meeting')} className='w-full h-72 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg
                        hover:bg-gradient-to-l transition-all cursor-pointer p-3' >
                            <div className='rounded-xl w-fit bg-white bg-opacity-50 p-2'>
                                <HiVideoCamera className='text-3xl'/>
                            </div>
                            <div className='relative top-32 space-y-2'>
                                <div className='text-black dark:text-white font-bold text-3xl text-left'>Phòng họp</div>
                                <div className='text-black dark:text-gray-200 font-semibold text-left text-wrap'>Tham gia vào các cuộc họp có sẵn hoặc tạo phòng họp cho riêng bạn</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div onClick={()=>router.push('/friends')} className='w-full h-72 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-lg
                        hover:bg-gradient-to-l transition-all cursor-pointer p-3' >
                            <div className='rounded-xl w-fit bg-white bg-opacity-50 p-2'>
                                <FaUserFriends className='text-3xl'/>
                            </div>
                            <div className='relative top-36 space-y-2'>
                                <div className='text-black dark:text-white font-bold text-3xl text-left'>Bạn bè</div>
                                <div className='text-black dark:text-gray-200 font-semibold text-left text-wrap'>Kết bạn với những người bạn mới</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
