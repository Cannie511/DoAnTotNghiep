import { BasicResponse } from "@/types/type";
import http from "@/Utils/https";

export const getRoomKey = async ()=>{
    return await http.get<BasicResponse>(`/api/room/getRoomKey`);
}

export const findRoom = async (room_key:number)=>{
    return await http.post<BasicResponse>(`/api/room/findRoom`, {room_key});
}

export const createRoom = async (user_id:number, time:string, password:string, roomKey:number)=>{
    return await http.post<BasicResponse>(`/api/room/createRoom`, {user_id, time, password, roomKey});
}

