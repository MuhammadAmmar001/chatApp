import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"
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


const getConversations = async () => {
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
        return []
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        })

        // const decryptedConvo = conversations.map(convo => ({
        //     ...convo,
        //     messages: convo.messages.map(msg => {
        //         if (msg.body) {
        //             try {
        //                 const encryptedBody = JSON.parse(msg.body);
        //                 const decryptedBody = decryptMessage(encryptedBody);
        //                 return {
        //                     ...msg,
        //                     body: decryptedBody
        //                 };
        //             } catch (error) {
        //                 console.error('Error parsing or decrypting message:', error);
        //                 return msg;
        //             }
        //         }
        //         return msg;
        //     })
        // }));
        // console.log('CHECKING GETCONVERSATIONS ===========>');
        // console.log(decryptedConvo);
        // console.log('CHECKING GETCONVERSATIONS ===========>');
        // return decryptedConvo
        return conversations
    } catch (error: any) {
        console.log("GET CONVO ERROR", error);
        return []
    }

}

export default getConversations