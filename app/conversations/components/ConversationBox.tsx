'use client'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Conversation, Message, User } from '@prisma/client'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import { FullConversationType } from '@/app/types'
import useOtherUser from '@/app/hooks/useOtherUser'
import Avatar from '@/app/components/avatar'
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


interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data, selected
}) => {
    const otherUser = useOtherUser(data)
    const session = useSession()
    const router = useRouter()



    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router])

    const lastMessage = useMemo(() => {
        const decryptedMsgs = data.messages.map((msg) => {
            if (!msg.body) return msg; // Return original message if body is missing

            try {
                const encryptedBody = JSON.parse(msg.body);
                const decryptedBody = decryptMessage(encryptedBody);
                return { ...msg, body: decryptedBody };
            } catch (error) {
                console.error('Error parsing or decrypting message:', error);
                return msg;
            }
        });
        return decryptedMsgs[decryptedMsgs.length - 1]
    }, [data.messages]);

    const userEmail = useMemo(() => { return session?.data?.user?.email }, [session?.data?.user?.email])

    const hasSeen = useMemo(() => {
        if (!lastMessage) { return false }

        const seenArray = lastMessage.seen || []

        if (!userEmail) {
            return false
        }
        return seenArray.filter((user) => user.email == userEmail).length != 0
    }, [userEmail, lastMessage])

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent a photo'
        }
        if (lastMessage?.body) {
            return lastMessage.body
        }
        return 'Start a conversation'

    }, [lastMessage])

    return (
        <div className={clsx(`w-full relative flex items-center space-x-3 hover:bg-neutral-150 rounded-lg transition cursor-pointer p-3`,
            selected ? 'bg-neutral-150' : 'bg-white'
        )}
            onClick={handleClick}
        >

            <Avatar user={otherUser} />
            <div className='min-2-0 flex-1'>
                <div className='focus:outline-none'>
                    <div className='flex justify-between items-center mb-1'>
                        <p className='text-md font-medium text-gray-900'>
                            {otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className='text-xs text-gray-400 font-light'>

                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx(`truncate text-sm`, hasSeen ? 'text-gray-500' : 'text-black font-bold')}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default ConversationBox
