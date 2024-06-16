import http, { getApiFromNextServer } from "@/Utils/https";
import { AuthRes, BasicResponse, LoginRequestType, RegisterRequestType } from "@/types/type";



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

export const AuthRegister = async({email, password, display_name, language, premium, linked_account = 'không'}:RegisterRequestType)=>{
    return await http.post('auth/register',{
        email, password, display_name, language, premium, linked_account
    })
}

export const AuthLogout = async()=>{
    return await getApiFromNextServer('/api/auth/logout')
}

export const AuthCheckSession = async()=>{
    return await http.post('/auth/checkSession',{})
}

export const getUsers = async()=>{
    return await http.get('api/users?page=1')
}
