import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/app/libs/prismadb'

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid Credentials')
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                if (!user || !user.hashedPassword) {
                    throw new Error('Invalid Credentials')

                }

                const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
                if (!isCorrectPassword) {
                    throw new Error('Invalid Credentials')

                }

                return user
            }
        })
    ],
    debug: process.env.NODE_ENV == 'development',
    session: {
        strategy: 'jwt'
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


// // import bcrypt from 'bcrypt'
// // import NextAuth from 'next-auth'
// // import CredentialsProvider from 'next-auth/providers/credentials'
// // import { PrismaAdapter } from '@next-auth/prisma-adapter'
// // import prisma from '@/app/libs/prismadb'
// // import { NextApiRequest, NextApiResponse } from 'next'

// // export const authOptions = {
// //     secret: process.env.NEXTAUTH_SECRET,
// //     adapter: PrismaAdapter(prisma),
// //     providers: [
// //         CredentialsProvider({
// //             name: 'Credentials',
// //             credentials: {
// //                 email: { label: 'email', type: 'text' },
// //                 password: { label: 'password', type: 'password' }
// //             },
// //             async authorize(credentials) {
// //                 if (!credentials?.email || !credentials?.password) {
// //                     throw new Error('Invalid Credentials')
// //                 }
// //                 const user = await prisma.user.findUnique({
// //                     where: {
// //                         email: credentials.email
// //                     }
// //                 })
// //                 if (!user || !user.hashedPassword) {
// //                     throw new Error('Invalid Credentials')

// //                 }

// //                 const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
// //                 if (!isCorrectPassword) {
// //                     throw new Error('Invalid Credentials')

// //                 }

// //                 return user
// //             }
// //         })
// //     ],
// //     debug: process.env.NODE_ENV == 'development',
// //     session: {
// //         strategy: 'jwt' as const,
// //     },
// // }

// // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// //     return NextAuth(req, res, authOptions)
// // }

// import NextAuth from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/auth'; // Adjust the path if necessary

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
