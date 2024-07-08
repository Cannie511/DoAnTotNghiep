
export async function POST(){
    return Response.json({message: 'Đăng xuất thành công'},{
        status:200,
        headers:{
            'Set-Cookie':
                `access_token=;Path=/;HttpOnly;Max-Age=0;`  
        }
    })
}