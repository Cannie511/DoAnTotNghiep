import { BasicResponse } from "@/types/type";
import http from "@/Utils/https";

export const getRoomKey = async ()=>{
    return await http.get<BasicResponse>(`/api/room/getRoomKey`);
}