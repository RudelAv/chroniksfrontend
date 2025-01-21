import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        id: string
        email: string
        name: string
        image?: string
        accessToken?: string
        refreshToken?: string
        profile?: any
        sub?: string
        token?: string
    }

    interface Session {
        user: User
        expires: string
    }
} 