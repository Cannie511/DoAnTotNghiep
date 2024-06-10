import http from "@/Utils/https";
import { AuthRes, BasicResponse, LoginRequestType } from "@/types/type";



export const AuthEmail = async(email:string)=>{
    return await http.post<BasicResponse>('auth/checkEmail',{
        email
    })
}

export const AuthLogin = async({username, password}:LoginRequestType)=>{
    return await http.post<AuthRes>('auth/login',{
        username,
        password
    })
}

export const getUsers = async()=>{
    return await http.get('api/users?page=1')
}
