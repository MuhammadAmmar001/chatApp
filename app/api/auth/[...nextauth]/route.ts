// import bcrypt from 'bcrypt'
// import NextAuth, { AuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import prisma from '@/app/libs/prismadb'

// export const authOptions: AuthOptions = {
//     secret: process.env.NEXTAUTH_SECRET,
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'email', type: 'text' },
//                 password: { label: 'password', type: 'password' }
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error('Invalid Credentials')
//                 }
//                 const user = await prisma.user.findUnique({
//                     where: {
//                         email: credentials.email
//                     }
//                 })
//                 if (!user || !user.hashedPassword) {
//                     throw new Error('Invalid Credentials')

//                 }

//                 const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
//                 if (!isCorrectPassword) {
//                     throw new Error('Invalid Credentials')

//                 }

//                 return user
//             }
//         })
//     ],
//     debug: process.env.NODE_ENV == 'development',
//     session: {
//         strategy: 'jwt'
//     },
// }

// // const handler = NextAuth(authOptions)
// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

// import bcrypt from 'bcrypt'
// import NextAuth, { AuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import prisma from '@/app/libs/prismadb'

// export const authOptions: AuthOptions = {
//     secret: process.env.NEXTAUTH_SECRET,
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'email', type: 'text' },
//                 password: { label: 'password', type: 'password' }
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error('Invalid Credentials')
//                 }
//                 const user = await prisma.user.findUnique({
//                     where: {
//                         email: credentials.email
//                     }
//                 })
//                 if (!user || !user.hashedPassword) {
//                     throw new Error('Invalid Credentials')
//                 }

//                 const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
//                 if (!isCorrectPassword) {
//                     throw new Error('Invalid Credentials')
//                 }

//                 return user
//             }
//         })
//     ],
//     debug: process.env.NODE_ENV === 'development',
//     session: {
//         strategy: 'jwt'
//     },
// }

// // Export the NextAuth handler for the route
// const handler = NextAuth(authOptions)

// // Export the handler for both GET and POST requests
// export { handler as GET, handler as POST }

import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/app/libs/prismadb'

const authOptions: AuthOptions = {
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
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt' as 'jwt', // Ensure this is properly typed
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
