import http from "@/Utils/https"

export const addFriend = async(user_id:number,friend_id:number)=>{
    return await http.post(`/api/friend/${user_id}`, {friend_id})
}