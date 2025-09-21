import { NextResponse, NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
 const path = request.nextUrl.pathname
 const isPublicPath = path === '/login' || path === '/signup'
 const token = request.cookies.get('token')?.value || ''
if (token && isPublicPath) {
  return NextResponse.redirect(new URL('/', request.nextUrl))
 }
 if (!token && !isPublicPath) {
  return NextResponse.redirect(new URL('/login', request.url))
 }
}
 
export const config = {
  matcher:[
    '/login',
    '/signup',
    '/profile',
    '/',
  ]
}