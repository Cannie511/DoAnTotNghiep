import { formatDateMessage, formatRoomKey } from "@/Utils/formatDate";
import { Card, TextInput, Timeline } from "flowbite-react";
import {  HiCalendar } from "react-icons/hi";
interface Props{
    schedule: []
}
export default function TimeLine({schedule}:Props) {
  //console.log(schedule)
  return (
    <div className="m-5">
        <Timeline>
        {schedule && schedule.map((item:any)=>{
            return(
                // <Timeline.Item key={item["ID"]}>
                //     <Timeline.Point icon={HiCalendar} />
                //     <Timeline.Content>
                //     <Timeline.Time>{formatDateMessage(item.Time)} Hôm nay</Timeline.Time>
                //     <Timeline.Body>
                //     {/* <TextInput className="w-48" readOnly disabled color={"gray"} value={formatRoomKey(item["Room.Room_key"] || "")}/> */}
                    
                //     </Timeline.Body>
                //     </Timeline.Content>
                // </Timeline.Item>
                <Card key={item["ID"]}>
                    <div className="text-2xl font-bold">Phòng họp của tôi</div>
                </Card>
            )
        })}
        {schedule && schedule.length===0 &&
            <div>
                <span>Bạn chưa có lịch họp nào gần đây</span>
            </div>
        }
        </Timeline>
    </div>
  )
}
