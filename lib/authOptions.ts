import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from './prisma'
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth"
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({

            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }


                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });


                if (!user || !user.password) {
                    console.log("Authorize failed: User not found or password missing for email:", credentials.email);
                    return null;
                }
                // 2. Compare the provided password with the hashed password in the database
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password! // Assuming 'password' field stores the hashed password
                );

                if (!isPasswordValid) {
                    console.log("Authorize failed: Invalid password for email:", credentials.email);
                    return null; // If passwords do not match, return null
                }

                // 3. If everything is valid, return the user object

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image, // Include other user properties you need for the session
                };
            },
        }),
    ],
    callbacks: {
        // Correct signature for session callback with JWT strategy 
        async session({ session, token }) {
            // The 'token' object contains the data populated by the 'jwt' callback
            if (token.id) {
                session.user.id = token.id as string;
                // Optionally, populate other user details from the token
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session;
        },

        async jwt({ token, user }) {

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,

}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email?: string | null;
        name?: string | null;
        picture?: string | null;
    }
}