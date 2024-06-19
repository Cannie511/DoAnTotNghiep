import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privateRoute = ['/profile', '/local_','/user', '/chat', '/schedule'];
export const authRoute = ['/register','/login',]

export function middleware(request: NextRequest) {
  
    const {pathname} = request.nextUrl;
    const access_token = request.cookies.get('access_token')?.value;
   
    if(pathname === '/' && !access_token){
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if(pathname === '/' && access_token){
      return NextResponse.redirect(new URL('/local_', request.url));
    }  
    if(privateRoute.some(path=>pathname.startsWith(path)) && !access_token){
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if(authRoute.some(path=>pathname.startsWith(path)) && access_token){
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
  matcher: [
    '/','/login','/register','/profile','/local_', '/user', '/chat', '/schedule'
  ],
}