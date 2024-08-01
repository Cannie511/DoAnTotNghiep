import http from "@/Utils/https"

export const createUserInvitation = async(list_user_id:Array<number>, send_by:number, room_id:number) =>{
    return await http.post("/api/user_invitation/create", {list_user_id, send_by, room_id});
}

export const getUserInvitation = async(user_id:number) =>{
    return await http.get(`/api/user_invitation/${user_id}`);
}