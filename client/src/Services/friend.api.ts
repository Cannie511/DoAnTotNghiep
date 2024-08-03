import http from "@/Utils/https"

export const addFriend = async(user_id:number,friend_id:number)=>{
    return await http.post(`/api/friend/${user_id}`, {friend_id})
}
/**
 * 
 * @param user_id (Người dùng hiện tại)
 * @param status (trạng thái 0:pending / 1:confirm)
 * @returns 
 */
export const getFriend = async(user_id:number,status:number)=>{
    return await http.get(`/api/friend/${user_id}/${status}`);
}

export const getFriendNotInRoom = async(user_id:number, room_id: number)=>{
    return await http.get(`/api/friend/getNotInRoom/${user_id}/${room_id}`);
}

export const deleteFriend = async(user_id:number, friend_id: number)=>{
    return await http.delete(`/api/friend/${user_id}/${friend_id}`);
}

export const getSuggestFriend = async(user_id:number, page:number)=>{
    return await http.get(`/api/friend/suggest/${user_id}?page=${page}`);
}