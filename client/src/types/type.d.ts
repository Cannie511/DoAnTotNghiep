export interface AuthRes{
    status: number;
    message: string;
    access_token: string;
}
export interface UserRes{
    id: number;
    email: string;
    display_name:string;
    language: number;
    premium: number;
    linked_account: string;
    createdAt: any;
}
export type Users = Pick<UserRes,'id'|'email'|'display_name'|'createdAt'>[]

export interface LoginRequestType{
    username: string;
    password: string;
}

export interface BasicResponse{
    status: number;
    message: string;
    data: any;
}