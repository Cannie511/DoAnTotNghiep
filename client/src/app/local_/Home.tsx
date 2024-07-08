'use client'
import { formatDate, getCurrentTime } from '@/Utils/formatDate';
import { Badge, Button, Card } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FaRegMoon, FaSun } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import { HiVideoCamera } from "react-icons/hi2";
import { FaCalendarPlus } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
export default function HomePage() {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [currentDate, setCurrentDate] = useState(formatDate(new Date() as any));
    const [noti, setNoti] = useState<number>(7);
     useEffect(() => {
        try {
            const interval = setInterval(() => {
                setCurrentTime(getCurrentTime());
                setCurrentDate(formatDate(new Date() as any));
            }, 500);
            return () => clearInterval(interval);
        } catch (error) {
            return;
        }
    }, []);
    return (
        <div className='h-96 w-96 mx-auto'>
            <Card className='space-y-1 w-full mt-24 text-center'>
                <strong className='text-3xl flex mx-auto'>{Number(currentTime.split(':')[0]) > 17 ? <FaRegMoon className='relative top-1 me-2'/>
                :<FaSun className='relative top-1 me-2'/>} {currentTime}</strong>
                <div>
                    <small>{currentDate}</small>
                </div>
            </Card>
            <div className='w-100 mx-auto space-y-2 my-2'>
                <div className='w-full flex space-x-2'>
                    <div className='flex-1'>
                        <Button gradientDuoTone="purpleToBlue" className='w-full' size="xl"><IoChatbubbles className='text-2xl'/></Button>
                        <div className='text-black dark:text-white font-bold text-center'>Trò chuyện</div>
                    </div>
                    <div className='flex-1'>
                        <Button gradientDuoTone="pinkToOrange" className='w-full' size="xl"><HiVideoCamera className='text-2xl'/></Button>
                        <div className='text-black dark:text-white font-bold text-center'>Phòng họp</div>
                    </div>
                </div>
                <div className='w-full flex space-x-2'>
                    <div className='flex-1'>
                        <Button gradientDuoTone="purpleToBlue" className='w-full' size="xl"><FaCalendarPlus className='text-2xl'/>
                            <Badge color="failure" className='rounded-2xl mx-1' size="sm">
                                3
                            </Badge>
                        </Button>
                        <div className='text-black dark:text-white font-bold text-center'>Lịch trình</div>
                    </div>
                    <div className='flex-1'>
                        <Button gradientDuoTone="purpleToBlue" className='w-full' size="xl"><IoNotifications className='text-2xl'/>
                            <Badge color="failure" className='rounded-2xl' size="sm">
                                {noti}
                            </Badge>
                        </Button>
                        <div className='text-black dark:text-white font-bold text-center'>Thông báo</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
