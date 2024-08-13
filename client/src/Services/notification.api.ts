import { BasicResponse, NotificationRequestType } from "@/types/type";
import http from "@/Utils/https";

export const createNotification = async ({user_id, message, send_by, type, status}:NotificationRequestType)=>{
    return await http.post<BasicResponse>(`/api/notification/create`,{user_id, message, send_by, type, status});
}

export const updateNotification = async (noti_id:number)=>{
    return await http.put<BasicResponse>(`/api/notification/update`,{noti_id});
}

export const countNotification = async ({user_id, type}:NotificationRequestType)=>{
    return await http.post<BasicResponse>(`/api/notification/countAll`,{user_id, type});
}

export const getNotification = async ({user_id, type}:NotificationRequestType)=>{
    return await http.post<BasicResponse>(`/api/notification/getAll`,{user_id, type, status});
}

export const getFriendRequest = async ({send_by, type}:NotificationRequestType)=>{
    return await http.post<BasicResponse>(`/api/notification/getRequest`,{send_by, type, status});
}

export const deleteNotification = async (notification_id:number)=>{
    return await http.post<BasicResponse>(`/api/notification/delete/${notification_id}`);
}