import prisma from '@/app/libs/prismadb'
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



const getMessages = async (
    conversationId: string
) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        //============

        if (messages) {
            const decryptedMsg = messages.map((msgPacket) => {
                if (!msgPacket.body) { return msgPacket }
                // console.log("ENCRYPTED BODY BEFORE JSON.PARSE ====>");
                // console.log(msgPacket.body);
                // console.log("ENCRYPTED BODY BEFORE JSON.PARSE ====>");
                const encryptedBody = JSON.parse(msgPacket.body);
                // console.log("ENCRYPTED BODY AFTER JSON.PARSE ====>");
                // console.log(encryptedBody);
                // console.log("ENCRYPTED BODY AFTER JSON.PARSE ====>");

                const decryptedBody = decryptMessage(encryptedBody);
                // console.log("DECRYPTED BODY ====>");
                // console.log(decryptedBody);
                // console.log("DECRYPTED BODY ====>");
                return {
                    ...msgPacket, body: decryptedBody
                }
            })
            // console.log("decryptedMsg ========>");
            // console.log(decryptedMsg);
            // console.log("decryptedMsg");
            // console.log("decryptedMsg SPREAD ========>");
            // console.log({ ...messages, messages: decryptedMsg });
            // console.log("decryptedMsg SPREAD");

            const responsePayload = {
                ...messages,
                messages: decryptedMsg.filter(msg => msg !== undefined) // Remove undefined entries if any
            };

            // console.log("decryptedMsg SPREAD ========>", responsePayload);

            // return NextResponse.json(responsePayload.messages);

            return responsePayload.messages
        }

    } catch (error: any) {
        return []
    }
}

export default getMessages