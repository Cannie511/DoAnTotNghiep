import { BasicResponse } from "@/types/type";
import http from "@/Utils/https";

export const getActiveStatus = async (user_id:number)=>{
    return await http.post<BasicResponse>(`/api/socket/getActiveStatus`,{user_id});
}