import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher";

export async function POST(
    request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json()
        const {
            userId,
        } = body

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const existingConvo = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    },

                ]
            },
            include: {
                messages: true
            }
        })
        const singleConvo = existingConvo[0]
        if (singleConvo) {
            return NextResponse.json(singleConvo)
        }

        const newConvo = await prisma.conversation.create({
            data: {
                users: {
                    connect: [{
                        id: currentUser.id
                    }, {
                        id: userId
                    }]
                }
            },
            include: {
                users: true
            }
        })

        newConvo.users.map((user) => {
            if (user.email) {
                console.log("USER PUSHER MAIL ", user.email);
                pusherServer.trigger(user.email, 'conversation:new', newConvo)
            }
        })
        return NextResponse.json(newConvo)
    } catch (error: any) {
        console.log("=====>  ", error);
        return new NextResponse('Internal error', { status: 500 })
    }
}

