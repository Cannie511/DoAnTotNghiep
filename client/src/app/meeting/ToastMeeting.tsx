import { url_img_default } from '@/images/image';
import { formatDateMessage, formatRoomKey } from '@/Utils/formatDate';
import { Avatar, Button, Clipboard, Toast } from 'flowbite-react'

interface Props {
    display_name:string;
    room_key:number;
    time_start:string;
    avatar:string
}

export default function ToastMeeting({display_name, room_key, time_start, avatar}:Props) {
    const onJoinMeeting = () =>{
        const url = `/onMeeting/${room_key}`;
        window.open(url, '_blank');
    }
  return (
    <Toast className="flex-col space-y-2 m-2">
        <div className="flex items-center">
            <Avatar className='w-14 h-14' img={avatar || url_img_default} rounded placeholderInitials="Fr"/>
            <div className="ml-3 text-sm font-normal">Bạn có lời mời tham gia cuộc họp từ <strong className='text-yellow-400'>{display_name}</strong></div>
        </div>
        <div className='text-sm text-left w-full'>
            Bắt đầu lúc: {formatDateMessage(time_start)}
        </div>
        <div className="grid w-full max-w-80">
            <div className="relative">
                <input
                type="text"
                className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={formatRoomKey(room_key)}
                disabled
                readOnly
                />
                <Clipboard.WithIconText valueToCopy={room_key.toString()} />
            </div>
        </div>
        <div className="flex space-x-2 w-full">
            <Button className="flex-1" color={"failure"}>Từ chối</Button>
            <Button className="flex-1" color={"blue"} onClick={onJoinMeeting}>Tham gia</Button>
        </div>
    </Toast>
  )
}
