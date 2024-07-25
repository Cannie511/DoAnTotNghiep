import { url_img_default } from '@/images/image'
import { Avatar, AvatarImageProps } from 'flowbite-react'
import React from 'react'

interface Props {
    avatar: string;
    displayName: string;
}

export default function MediaDiv({avatar, displayName}:Props) {
  return (
    <div className="overflow-hidden relative w-[22rem] h-[200px] bg-gray-700 rounded-xl flex justify-center items-center flex-col">
        <Avatar
            size={"lg"}
            img={avatar||url_img_default}
            rounded
            bordered
            color="success"
        />
        <div className='mt-2'>{displayName}</div>
    </div>
  )
}
