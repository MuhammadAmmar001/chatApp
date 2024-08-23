import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher";
import crypto from 'crypto'

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, 'base64');


function decryptMessage(encryptedMessage: { iv: string; encryptedData: string }): string {
    const iv = encryptedMessage.iv;
    const encrypted = encryptedMessage.encryptedData;

    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), ivBuffer);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

interface IParams {
    conversationId?: string
}

export async function POST(
    request: Request,

    { params }: { params: IParams }

) {
    try {
        const currentUser = await getCurrentUser()

        const { conversationId } = params

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                }, users: true
            }
        })

        if (!conversation) {
            return new NextResponse('ID INVALID', { status: 400 })
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1]

        if (!lastMessage) {
            return NextResponse.json(conversation)
        }
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            }, include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        })

        // if (!updatedMessage.body) { return NextResponse.json(updatedMessage) }
        // const encryptedBody = JSON.parse(updatedMessage.body)
        // const decryptedBody = decryptMessage(encryptedBody)
        // updatedMessage.body = decryptedBody

        let decryptedBody: string
        if (!updatedMessage.body) { return NextResponse.json(updatedMessage) }
        if (updatedMessage.body.startsWith('{')) {
            let encryptedBody: { iv: string; encryptedData: string };

            try {
                encryptedBody = JSON.parse(updatedMessage.body);
            } catch (e) {
                console.error('Body is not valid JSON:', updatedMessage.body);
                return new NextResponse('Invalid message format', { status: 400 });
            }

            decryptedBody = decryptMessage(encryptedBody);
        } else {
            decryptedBody = updatedMessage.body;
        }

        updatedMessage.body = decryptedBody;

        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        })

        if (lastMessage.seenIds.indexOf(currentUser.id) != -1) {
            return NextResponse.json(conversation)
        }

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage)

        return NextResponse.json(updatedMessage)

    } catch (error: any) {
        console.log(error, 'ERROR IN MESSAGES SEEN');
        return new NextResponse('Internal Error', { status: 500 })
    }
}