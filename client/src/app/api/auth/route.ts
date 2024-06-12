export async function POST(request: Request) {
    const res = await request.json();
    const access_token = res.access_token as string;
    //console.log(res)
    if(!access_token)
        return Response.json({
            message:'không nhập được token'
        }, { status: 400})
  return Response.json(res,{
    status:200,
    headers:{
        'Set-Cookie':`access_token=${access_token}; Path=/; HttpOnly`
    }
  })
}