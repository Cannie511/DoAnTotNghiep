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

export const checkRoomPassword = async(room_id:number, password:string)=>{
    return await http.post('/api/room/checkRoomPassword', {room_id, password});
}

export const getAllMyRoom = async(user_id:number, page?:number)=>{
    return await http.get(`/api/room/getAll/${user_id}?page=${page}`)
}