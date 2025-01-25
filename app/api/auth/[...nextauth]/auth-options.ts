import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import ApiAuthSignUp from "../../authentification/register"
import ApiLogin from "../../authentification/login"
import jwt from "jsonwebtoken"
import { getName, logError } from "@/lib/utils"
import { getSession } from "next-auth/react"
import { useStore } from '@/stores/useStore'

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials as any
                const res = await ApiLogin.loginEmail(email, password)
                // const user = await res.json()
                // console.log("user", user)
                return res
            },
        }),
        CredentialsProvider({
            id: "registration",
            name: "User Registration",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                confirmPassword: { label: "PasswordConfirm", type: "password" },
                name: { label: "Name", type: "text" }
            },
            async authorize(credentials) {
                const { email, password, confirmPassword, name } = credentials as any
                const res = await ApiAuthSignUp.signupWithEmail({
                    email,
                    password,
                    confirmPassword,
                    name
                })
                const response = await res.json()
                
                if (response.code === 409) {
                    throw new Error(response.message)
                }
                if (response.code === 400) {
                    throw new Error(response.message[0].message)
                }
                if (res.ok && response) {
                    return response
                }
                return null
            },
        }),
        CredentialsProvider({
            id: "token",
            name: "Token Handler",
            credentials: {
                accessToken: { label: "Access Token", type: "text" },
                refreshToken: { label: "Refresh Token", type: "text" }
            },
            async authorize(credentials) {
                const { refreshToken } = credentials as any
                const res = await ApiLogin.refresh(refreshToken)
                const user = await res.json()
                if (res.ok && user) {
                    return user
                }
                return null
            },
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour
        updateAge: 60 * 30, // 30 min
    },
    secret: process.env.ACCESS_TOKEN_SECRET,
    jwt: {
        signingKey: process.env.ACCESS_TOKEN_SECRET,
        encryption: true,
        async encode({ secret, token }) {
            return jwt.sign(token!, secret)
        },
        async decode({ secret, token }) {
            return jwt.verify(token!, secret)
        },
    },
    pages: {
        signIn: "/page/login",
        signOut: '/page/logout',
        error: '/page/error',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === 'token') {
                    const res = user['message']
                    if (res['accessToken'] && res['refreshToken']) {
                        let data = jwt.decode(res['accessToken'], { complete: true })?.payload as any
                        if (!data) return false
                        
                        delete data['password']
                        user.profile = data
                        user.sub = data.id
                        user.id = data.id
                        user.email = data.email
                        user.name = getName(data.name) || data.pseudo
                        if (data.user_picture?.url) {
                            user.image = data.user_picture.url
                        }
                        return true
                    }
                    throw new Error("Invalid Token")
                }

                if (account?.provider === 'credentials' || account?.provider === 'registration') {
                    if (user.accessToken && user.refreshToken) {
                        let data = jwt.decode(user.accessToken, { complete: true })?.payload as any
                        if (!data) return false
                        
                        delete data['password']
                        user.profile = data
                        user.sub = data.id
                        user.id = data.id
                        user.email = data.email
                        user.name = getName(data.name) || data.pseudo
                        if (data.user_picture?.url) {
                            user.image = data.user_picture.url
                        }

                        const session = await getSession()
                        if (session) {
                            session.user = user
                        }

                        return true
                    }
                    return `/page/login?error=${encodeURIComponent("Invalid Credentials")}`
                }

                if (account?.provider === 'github' || account?.provider === 'google') {
                    const payload = {
                        username: user.name,
                        email: user.email,
                        provider: capitalize(account.provider),
                        accesstoken: account.access_token
                    }
                    const resp = await ApiAuthSignUp.signupWithExternalAPI(payload)
                    const result = await resp.json()
                    
                    if (result.accessToken && result.refreshToken) {
                        let data = jwt.decode(result.accessToken, { complete: true })?.payload as any
                        if (!data) return false
                        
                        delete data['password']
                        user.token = account.access_token
                        user.accessToken = result.accessToken
                        user.refreshToken = result.refreshToken
                        user.profile = data
                        user.sub = data.id
                        user.id = data.id
                        user.email = data.email
                        user.name = getName(data.name) || data.pseudo
                        if (data.user_picture?.url) {
                            user.image = data.user_picture.url
                        }
                        return true
                    }
                    return `/page/login?error=${encodeURIComponent(result.message)}`
                }
                return false
            } catch (error) {
                logError(error)
                return false
            }
        },
        async jwt({ token, user, account, trigger, session }) {
            try {
                if (account && user && token) {
                    token.id = user.id
                    token.profile = user.profile
                    token.accessToken = user.accessToken
                    token.refreshToken = user.refreshToken
                }
                if (trigger === 'update') {
                    token = session.data
                }
                return token
            } catch (error) {
                logError(error)
                return token
            }
        },
        async session({ session, token }) {
            try {
                const currentTime = Math.floor(Date.now() / 1000)
                const tokenExpiry = token.profile?.exp || 0
                const timeUntilExpiry = tokenExpiry - currentTime
                if (timeUntilExpiry < 600) {
                    try {
                        const resp = await ApiLogin.refresh(token.refreshToken as string)
                        const res = await resp.json()
                        console.log("res", res)
                        
                        if (res.code == 200) {
                            // Invalider l'ancien token
                            await ApiLogin.signOut(token.accessToken as string, token.refreshToken as string)
                            
                            // Mettre à jour les tokens
                            token.accessToken = res.message.accessToken
                            token.refreshToken = res.message.refreshToken
                            // Mettre à jour les informations du profil
                            const newProfile = jwt.decode(res.message.accessToken, { complete: true })?.payload
                            if (newProfile) {
                                token.profile = newProfile
                            }
                        } else {
                            console.log("error")
                        }
                    } catch (error) {
                        console.log("Token refresh failed:", error)
                    }
                }
                session.user = token
                console.log("Session refreshed:", {
                    user: {
                        ...session.user,
                        accessToken: session.user.accessToken,
                        refreshToken: session.user.refreshToken,
                    },
                    expires: session.expires,
                })
                if (session.user) {
                    session.user.id = token.sub as string
                    // Mettre à jour le store quand la session change
                    useStore.getState().setUser(session.user)
                }
                return session
            } catch (error) {
                logError(error)
                return session
            }
        },
        async redirect({ baseUrl }) {
            return process.env.NEXT_PUBLIC_API_URL || baseUrl
        },
    },
    cookies: {
        sessionToken: {
            name: `__devBlog.SSID`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            },
        },
        callbackUrl: {
            name: `__devBlog.CURL`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        },
        csrfToken: {
            name: `__devBlog.CSRF`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        }
    }
}