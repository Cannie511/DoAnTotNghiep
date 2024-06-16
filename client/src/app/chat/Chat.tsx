'use client'
import { Card, TextInput } from 'flowbite-react'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { HiPaperAirplane } from "react-icons/hi";
import { BsEmojiSmile } from "react-icons/bs";
import ListFriend from './ListFriend';
import { Skeleton } from '@/components/ui/skeleton';

export default function Chat() {
    const [current_friend, setCurrentFriend] = useState<string | null >('');
  return (
    <div className='flex space-x-1'>
    <Card className='w-6xl h-[51rem] flex-col flex-1'>
      <div className='w-full dark:bg-slate-700 relative top-0 p-2 rounded-md dark:text-white bg-slate-100 text-black'>
        <strong>{current_friend ? current_friend : <Skeleton className="h-4 w-[250px]" />}</strong>
    </div>
      <div className='h-[48rem] dark:bg-slate-600 w-full rounded-sm'></div>
        <form className='flex space-x-1 w-full mb-1'>
          <Button size={'icon'} className='h-full bg-transparent shadow-none text-yellow-300 hover:bg-transparent'><BsEmojiSmile className='text-3xl'/></Button>
           <TextInput className='w-11/12 flex-1' type="email" placeholder="Tin nhắn..." />
           <Button size={'icon'} className='h-full'><HiPaperAirplane className='text-2xl'/></Button>
        </form>
    </Card>
    <ListFriend setFriend={setCurrentFriend}/>
    </div>
  )
}
