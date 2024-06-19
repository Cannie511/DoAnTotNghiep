import { cookies } from "next/headers";

export async function POST(){
    // const cookie = cookies();
    // const access_token = cookie.get('access_token');
    // console.log('token: ',access_token);
    // if(!access_token)
    //     return Response.json({ message:'không nhận được token'},{status: 400});
    // return Response.json({message: 'Đăng xuất thành công'},{
    //     status:200,
    //     headers:{
    //         'Set-Cookie':
    //             `access_token=;Path=/;HttpOnly;Max-Age=0;`  
    //     }
    // })
    return Response.json({message: 'Đăng xuất thành công'},{
        status:200,
        headers:{
            'Set-Cookie':
                `access_token=;Path=/;HttpOnly;Max-Age=0;refresh_token=;Path=/;HttpOnly;Max-Age=0;`  
        }
    })
}