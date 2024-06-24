import Image, { StaticImageData } from 'next/image'
import React from 'react'

interface Props{
    avatarSrc:string|StaticImageData;
    email:string;
    display_name:string;
    onClick ?:(email:string)=>void;
}

export default function ResultComponent({avatarSrc, email, display_name, onClick}:Props) {
  return (
    <div className='cursor-pointer mt-1 dark:hover:bg-gray-700 transition-all hover:bg-slate-100 flex rounded-lg border w-full border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col flex-none p-2'
        onClick={onClick ? ()=>onClick(email): ()=>{}}
    >
        <div className="flex items-center space-x-3">
        <div className="shrink-0">
            <Image
            alt="Neil image"
            height="32"
            src={avatarSrc}
            width="32"
            className="rounded-full"
            />
        </div>
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{display_name}</p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{email}</p>
        </div>
        {/* <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div> */}
        </div>
    </div>
  )
}
