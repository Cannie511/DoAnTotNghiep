'use client'
import { formatRoomKey } from '@/Utils/formatDate';
import { Clipboard, Toast } from 'flowbite-react'
import { MdInfo } from "react-icons/md";
interface Props{
    room_id:number;
}
export default function ToastInfo({room_id}:Props) {
  return (
    <Toast className='fixed top-[80vh]'>
        <div className="grid w-full max-w-64">
          <div className="ml-64 p-0 fixed flex justify-center items-center">
            <Toast.Toggle />
          </div>
          <div className='flex'><MdInfo className='text-2xl mr-2'/> Thông tin phòng họp: </div>
          <div className="relative mt-2">
            <input
                id="room_id"
                type="text"
                className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={"Phòng: "+formatRoomKey(room_id.toString())}
                disabled
                readOnly
              />
            <Clipboard.WithIcon valueToCopy={room_id.toString()} />
          </div>
          <div className="relative mt-2">
            <input
                id="room_id"
                type="text"
                className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={"Mật khẩu: **********"}
                disabled
                readOnly
              />
            <Clipboard.WithIcon valueToCopy={room_id.toString()} />
          </div>
        </div>
      </Toast>
  )
}
