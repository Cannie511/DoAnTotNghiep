import { BasicResponse } from "@/types/type";
import http from "@/Utils/https";

export const createSchedule = async (user_id:number, time:string, password:string, roomKey:number)=>{
    return await http.post<BasicResponse>(`/api/schedule/createSchedule`,{user_id, time, password, roomKey});
}

export const getSchedule = async (user_id:number, timeDiff:number)=>{
    return await http.post<BasicResponse>(`/api/schedule/getSchedule`,{user_id, timeDiff});
}

export const deleteSchedule = async (schedule_id:number)=>{
    return await http.post<BasicResponse>(`/api/schedule/delete/${schedule_id}`);
}