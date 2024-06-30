import http from "@/Utils/https";
import { BasicResponse, MessageRequestType } from "@/types/type";

export const GetMessage = async ({user1, user2}:MessageRequestType)=>{
    return await http.post<BasicResponse>(`/api/message/getMessage`,{user1, user2});
}