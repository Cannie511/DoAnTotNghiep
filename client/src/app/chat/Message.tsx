import { formatDateMessage } from '@/Utils/formatDate';
import { url_img_default } from '@/images/image';
import { Avatar } from 'flowbite-react';
import React from 'react'

interface Props {
    message:string;
    createAt:any;
    me?:boolean;
    avatar:any;
    status:number;
}

export default function Message({message, createAt, me, avatar, status}:Props) {
    if(!me)
    return (
        <div className='w-full flex'>
            <Avatar className='items-start mt-2' img={avatar||url_img_default} rounded status={status === 1 ? "online":"offline"} statusPosition="bottom-right" />
            <div className='p-3 mx-2 dark:bg-slate-700 shadow-md border border-gray-300 dark:border-gray-800 rounded-lg my-2 w-fit max-w-52 md:max-w-3xl'>
                {message}
                <div className='text-right'><small className='text-[.75rem] text-gray-400 px-3'>{formatDateMessage(createAt as string)}</small></div>
            </div>
        </div>
    )
    else
    return (
        <div className='w-full'>
            <div className='py-3 px-2 bg-blue-200 text-black shadow-md border float-end border-gray-300 dark:border-indigo-200 rounded-lg my-2 w-fit max-w-52 md:max-w-3xl'>
                {message}
                <div className='text-left'><small className='text-[.75rem] text-gray-400'>{formatDateMessage(createAt as string)}</small></div>
            </div>
        </div>
    )
}
