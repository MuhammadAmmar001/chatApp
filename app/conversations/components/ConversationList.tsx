'use client'
import useConversation from "@/app/hooks/useConversation"
import { FullConversationType } from "@/app/types"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from 'react'
import ConversationBox from "./ConversationBox"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/app/libs/pusher"
import { find } from 'lodash'

interface ConversationListProps {
    initialItems: FullConversationType[]

}
const ConversationList: React.FC<ConversationListProps> = ({
    initialItems
}) => {
    const [items, setItems] = useState(initialItems)

    const session = useSession()

    const router = useRouter()

    const { conversationId, isOpen } = useConversation()

    const pusherKey = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])


    useEffect(() => {
        if (!pusherKey) {
            return
        }
        pusherClient.subscribe(pusherKey)

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current
                }
                return [conversation, ...current]
            })
        }

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConvo) => {
                if (currentConvo.id == conversation.id) {
                    return {
                        ...currentConvo,
                        messages: conversation.messages
                    }
                }
                return currentConvo
            }))
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((convo) => convo.id != conversation.id)]
            })
            if (conversationId == conversation.id) {
                router.push('/conversations')
            }
        }

        pusherClient.bind('conversation:new', newHandler)
        pusherClient.bind('conversation:update', updateHandler)
        pusherClient.bind('conversation:remove', removeHandler)

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind('conversation:new', newHandler)
            pusherClient.unbind('conversation:update', updateHandler)
            pusherClient.unbind('conversation:remove', removeHandler)
        }
    }, [pusherKey, conversationId, router])
    return (
        <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`, isOpen ? 'hidden' : 'block w-full left-0')}>

            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold font-neutral-800"
                    >Messages</div>
                    {/* <div className="rounded-full text-gray-600 p-2 bg-gray-100 cursor-pointer hover:opacity-70 transition">
                        <MdOutlineGroupAdd size={25} />
                    </div> */}
                </div>
                {items.map((item) =>
                (<ConversationBox
                    key={item.id}
                    data={item}
                    selected={conversationId == item.id}

                />)
                )}
            </div>


        </aside>
    )
}
export default ConversationList