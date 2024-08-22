import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher";
import crypto from 'crypto'

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, 'base64');
const iv = Buffer.from(process.env.NEXT_PUBLIC_IV!, 'base64');


function encryptMessage(text: any) {
    if (!text) { return }
    let cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decryptMessage(encryptedMessage: { iv: string; encryptedData: string }): string {
    // const [iv, encrypted] = encryptedMessage.split(':');

    const iv = encryptedMessage.iv;
    const encrypted = encryptedMessage.encryptedData;

    // const encrypted = encryptedMessage
    // console.log("INSIDE DECRYPTED FUNCTION: ", encrypted);
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), ivBuffer);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    // console.log(" DECRYPTED OUTPUT: ", decrypted);

    return decrypted;
}


export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser()
        const body = await request.json()
        const {
            message, image, conversationId
        } = body
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const encryptedResult = encryptMessage(message);

        if (!encryptedResult) {
            return new NextResponse('Invalid message', { status: 400 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: JSON.stringify(encryptedResult),
                image: image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id
                    }

                },
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }

            },
            include: {
                seen: true,
                sender: true
            }
        })
        // =================

        if (!newMessage.body) {
            return
        }
        const decryptedBody = decryptMessage(JSON.parse(newMessage.body));

        const responseMessage = {
            ...newMessage,
            body: decryptedBody
        };

        // =================
        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true
                    }
                }
            }
        })
        await pusherServer.trigger(conversationId, 'messages:new', responseMessage)

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        })

        return NextResponse.json(responseMessage)

    } catch (error: any) {
        console.log(error, 'ERROR FROM MESSAGES');
        return new NextResponse('Internal Error', { status: 500 })
    }
}