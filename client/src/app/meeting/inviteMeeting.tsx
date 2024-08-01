'use client'
import { HiOutlineEmojiSad } from "react-icons/hi";
import { AppContext } from "@/Context/Context"
import { getUserInvitation } from "@/Services/user_invitation.api"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import ToastMeeting from "./ToastMeeting"
import { Card } from "flowbite-react"

export const InviteMeeting = () =>{
    const {user_id} = useContext(AppContext);
    const {data:list_invite} = useQuery({
        queryKey:["list_invite"],
        queryFn:()=>getUserInvitation(Number(user_id)),
        enabled:!!user_id
    })
    const list_invitation:any = list_invite?.data;
    return(
        <div className="w-full">
            <div className="w-full flex justify-center items-center">
                <h1 className="mx-auto mt-2 text-2xl font-bold">Lời mời tham gia cuộc họp</h1>
            </div>
            <div className="mt-5 flex">
                { list_invitation && list_invitation.length === 0 &&
                    <Card className="w-[27rem] mx-auto mt-5 flex items-center justify-center text-4xl text-center font-bold">
                        <div className="flex justify-center">
                            <HiOutlineEmojiSad className="text-5xl text-yellow-400"/>
                        </div>
                        Bạn chưa có lời mời họp nào!
                    </Card>
                }
                {list_invitation && list_invitation.map((item:any)=>{
                    return(
                        <ToastMeeting avatar={item["sender.avatar"]} display_name={item["sender.display_name"]} key={item.id} room_key={item["Room.Room_key"]} time_start={item["Room.Time_start"]}/>
                    )
                })}
            </div>
        </div>
    )
}