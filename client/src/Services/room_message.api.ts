import http from "@/Utils/https"

export const getRoomMessage = async(room_id:number)=>{
    return await http.get(`/api/room_message/${room_id}`);
}