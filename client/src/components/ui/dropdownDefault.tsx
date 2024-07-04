'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { IoNotifications } from "react-icons/io5";

export default function DropdownDefault() {
  return (
     <DropdownMenu>
      <DropdownMenuTrigger>
        <>
            <div className='w-5 h-5 flex items-center justify-center rounded-full bg-red-600 absolute ml-5 -mt-2 text-xs text-white'>1</div>
            <IoNotifications className='text-3xl'/>
        </>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
         noti1aaaaaaaaa
        </DropdownMenuItem>
        <DropdownMenuItem>
            noti2
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
