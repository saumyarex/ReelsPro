import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const url = req.nextUrl;

        // public paths
        if(url.pathname === "/" || url.pathname.startsWith("/api/videos") || url.pathname.startsWith("/profile")){
            return true;
        }

        //auth paths
        if(url.pathname.startsWith('/register') || url.pathname.startsWith('/login') || url.pathname.startsWith('/api/auth')) {
            return true;
        }

        return !!token;
      }
    },
  },
)

export const config = { 
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ] 
};