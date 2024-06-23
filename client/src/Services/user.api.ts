import http from "@/Utils/https";
import { BasicResponse, UserChangePasswordType, UserCheckPasswordType } from "@/types/type";

export const UserChangePassword = async ({user_id, old_password, new_password}:UserChangePasswordType)=>{
    return await http.put<BasicResponse>(`/api/users/password/${user_id}`,{old_password, new_password});
}

export const UserCheckPassword = async ({user_id, old_password}:UserCheckPasswordType)=>{
    return await http.post<BasicResponse>(`/api/users/password/${user_id}`,{old_password});
}   