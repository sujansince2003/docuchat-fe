import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import type { NextAuthOptions } from "next-auth"
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id
            }
            return session
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id
            }
            return token
        },
    },
    session: {
        strategy: 'database',
    },
    // pages: {
    //     signIn: '/auth/signin',
    //     error: '/auth/error',
    // },
}