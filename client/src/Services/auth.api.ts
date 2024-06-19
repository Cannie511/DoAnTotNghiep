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

export const AuthLoginGoogle = async(google_token:string|undefined)=>{
    return await http.post<AuthRes>('auth/loginWithGoogle',{
        google_token
    })
}

export const AuthRegister = async({email, password, display_name, language, premium, linked_account = 'verify'}:RegisterRequestType)=>{
    return await http.post('auth/register',{
        email, password, display_name, language, premium, linked_account
    })
}

export const AuthLogout = async(user_id:number)=>{
    try {
        const res = await http.post('/auth/logout', {user_id})
        return await getApiFromNextServer('/api/auth/logout')
    } catch (error) {
        console.log(error)
    } 
}

export const AuthCheckSession = async()=>{
    return await http.post('/auth/checkSession',{})
}

export const AuthGetVerifyCode = async(email:string)=>{
    return await http.post('/auth/sendCode',{email})
}

export const AuthCheckVerifyCode = async(email:string, code:number)=>{
    return await http.post('/auth/verifyEmail',{email, code})
}

export const getUsers = async()=>{
    return await http.get('api/users?page=1')
}
