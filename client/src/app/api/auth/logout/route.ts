import { cookies } from "next/headers";

export async function POST(request: Request){
    const cookie = cookies();
    const access_token = cookie.get('access_token');
    console.log(access_token);
    if(!access_token)
        return Response.json({ message:'không nhận được token'},{status: 400});
    return Response.json(access_token, {
        status:200,
        headers:{
            'Set-Cookie':`access_token=;Path=/;HttpOnly;Max-Age=0`
        }
    })
}