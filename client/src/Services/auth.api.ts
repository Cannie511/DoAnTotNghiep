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

export const AuthGetVerifyCode = async(email:string, subject:string)=>{
    return await http.post('/auth/sendCode',{email, subject})
}

export const AuthCheckVerifyCode = async(email:string, code:number)=>{
    return await http.post('/auth/verifyEmail',{email, code})
}

export const getUsers = async(page:number)=>{
    return await http.get(`api/users?page=${page}`)
}

export const AuthFindEmailLike = async(searchValue:string)=>{
    return await http.post<BasicResponse>(`auth/findUser`,{searchValue})
}

export const AuthForgotPassword = async(email:string, new_password:string)=>{
    return await http.put<BasicResponse>('auth/forgotPassword', {email, new_password})
}