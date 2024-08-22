import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getConversationById = async (
    conversationId: string
) => {
    try {
        const currentUser = await getCurrentUser()
        console.log("Fine after getCurrent");
        console.log("conversation ID in getConversationbyId: " + conversationId);
        if (!currentUser?.email) {
            return null
        }
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })
        return conversation
    } catch (error: any) {
        console.log("Null From catch of getCOnversationbyId");
        return null
    }
}
export default getConversationById