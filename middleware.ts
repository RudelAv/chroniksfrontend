import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/page/login",
    }
  }
)

export const config = {
  matcher: [
    "/page/profile/",
    // "/page/write/:path*",
    // "/page/write/",
    "/page/post/edit/:path*",
    "/api/posts/:path*",
    "/api/user/:path*"
  ]
} 