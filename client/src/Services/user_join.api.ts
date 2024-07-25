import http from "@/Utils/https";

export const userJoin = async (user_id:number, room_id:number)=>{
    return await http.get(`/api/user_join/${user_id}/${room_id}`);
}

export const joinRoom = async (user_id:number, room_id:number)=>{
    return await http.post(`/api/user_join/join`,{user_id, room_id});
}

export const leftRoom = async (user_id:number, room_id:number)=>{
    return await http.delete(`/api/user_join/left/${user_id}/${room_id}`);
}