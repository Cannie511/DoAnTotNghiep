import { useToast } from '@/components/ui/use-toast';
import { AppContext } from '@/Context/Context';
import { url_img_default } from '@/images/image';
import { deleteUserInvitation } from '@/Services/user_invitation.api';
import { formatDateMessage, formatRoomKey } from '@/Utils/formatDate';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Clipboard, Dropdown } from 'flowbite-react'
import { useContext } from 'react';

interface Props {
    id: number;
    display_name:string;
    room_key:number;
    time_start:string;
    avatar:string;
    send_by:number;
}
interface dropdownReasonType{
    id:number;
    reason: string;
}
export default function ToastMeeting({id, display_name, room_key, time_start, avatar, send_by}:Props) {
    const {display_name: my_name, socket} = useContext(AppContext);
    const queryClient = useQueryClient();
    const dropdownReason:dropdownReasonType[] = [
        {id: 1, reason: "Hiện tại tôi đang bận"},
        {id: 2, reason: "Tôi đang lái xe"},
        {id: 3, reason: "Tôi đang bệnh"},
        {id: 4, reason: "Hiện tại tôi không muốn nhận lời mời"},
        {id: 5, reason: "Tôi đang tham dự một cuộc họp khác"}
    ]
    const {toast} = useToast();
    const onJoinMeeting = () =>{
        const url = `/onMeeting/${room_key}`;
        window.open(url, '_blank');
    }
    const onRejectMeeting = async(invitation_id:number, message:string)=>{
        await deleteUserInvitation(invitation_id)
        .then(()=>{
            queryClient.invalidateQueries({queryKey:["list_invite"]})
            if(!message)
                toast({
                    title:"Bạn đã từ chối lời mời họp",
                    description:"Lý do: Không có"
                })
            else
            {
                if(socket && send_by) socket.emit("reject_meeting", send_by, my_name, message);
                toast({
                    title:"Bạn đã từ chối lời mời họp",
                    description:"Lý do: " + message
                })
            }
        })
        .catch((err)=>{
            toast({
                title:"Lỗi: "+ err.message,
                variant:"destructive"
            })
        })
    }
  return (
    <div className="flex-col space-y-2 m-2 p-4 rounded-xl bg-gray-300 shadow-sm dark:bg-slate-700">
        <div className="flex items-center">
            <Avatar className='w-14 h-14' img={avatar || url_img_default} rounded placeholderInitials="Fr"/>
            <div className="ml-3 text-lg">Bạn có lời mời tham gia cuộc họp từ <strong className='text-yellow-400'>{display_name}</strong></div>
        </div>
        <div className='text-lg text-left w-full'>
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
                <Dropdown label="Từ chối lời mời" color={"failure"}>
                    {dropdownReason && dropdownReason.map((item:dropdownReasonType)=>{
                        return(
                            <Dropdown.Item key={item?.id} onClick={() => onRejectMeeting(id,item?.reason)}>{item?.reason}</Dropdown.Item>
                        )
                    })}
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={() => onRejectMeeting(id,'')}>Từ chối nhưng không thông báo tới người mời</Dropdown.Item>
                </Dropdown>
            <Button className="flex-1" color={"blue"} onClick={onJoinMeeting}>Tham gia phòng họp</Button>
        </div>
    </div>
  )
}
