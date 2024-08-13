import { formatDateMessage, formatRoomKey } from "@/Utils/formatDate";
import { Button, Card, Clipboard, TextInput, Timeline, Tooltip } from "flowbite-react";
import { MdSchedule } from "react-icons/md";
interface Props{
    schedule: []
}
export default function TimeLine({schedule}:Props) {
  const onJoinRoom = async(value:number) =>{
    const url = `/onMeeting/${value}`;
    window.open(url, '_blank');
  }
  return (
    <div className="my-5 md:space-x-3 md:grid grid-cols-2">
        {schedule && schedule.map((item:any)=>{
            return(
                <Card key={item["ID"]} className="w-full my-2">
                    <div><MdSchedule className="text-lg"/></div>
                    <div className="md:text-2xl text-lg font-bold">Phòng họp của tôi</div>
                    <div className="text-md">Bắt đầu: {formatDateMessage(item.Time)}</div>
                    <div className="relative">
                        <input
                            id="npm-install"
                            type="text"
                            className="w-fit col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            value={formatRoomKey(item["Room.Room_key"])}
                            disabled
                            readOnly
                        />
                        <Tooltip className='fixed ml-52 -mt-8' content="Sao chép mã phòng">
                            <Clipboard.WithIcon valueToCopy={item["Room.Room_key"]} />
                        </Tooltip>
                    </div>
                    <div className="flex space-x-2">
                        <Button className="flex-1" color={"failure"}>Xóa</Button>
                        <Button className="flex-1" onClick={()=>onJoinRoom(item["Room.Room_key"])} color={"purple"}>Tham gia</Button>
                    </div>
                </Card>
            )
        })}

        
        {schedule && schedule.length===0 &&
            <div>
                <span>Bạn chưa có lịch họp nào gần đây</span>
            </div>
        }
    </div>
  )
}
