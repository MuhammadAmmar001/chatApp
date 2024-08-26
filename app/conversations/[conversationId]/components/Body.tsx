'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"
import crypto from 'crypto';

// const algorithm = 'aes-256-cbc';
// const ENCRYPTION_KEY = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!, 'base64');

// function decryptMessage(encryptedMessage: { iv: string; encryptedData: string }): string {
//     // const [iv, encrypted] = encryptedMessage.split(':');

//     const iv = encryptedMessage.iv;
//     const encrypted = encryptedMessage.encryptedData;

//     // const encrypted = encryptedMessage
//     console.log("INSIDE DECRYPTED FUNCTION OF BODY: ", encrypted);
//     const ivBuffer = Buffer.from(iv, 'hex');
//     const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), ivBuffer);

//     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     console.log(" DECRYPTED OUTPUT OF BODY: ", decrypted);

//     return decrypted;
// }

interface BodyProps {
    initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({
    initialMessages
}) => {
    const [messages, setMessages] = useState(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { conversationId } = useConversation()

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    useEffect(() => {
        pusherClient.subscribe(conversationId)
        bottomRef?.current?.scrollIntoView()

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)

            setMessages((current) => {
                if (find(current, { id: message.id })) {

                    return current
                }
                return [...current, message]
            })
            bottomRef?.current?.scrollIntoView()
        }
        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id == newMessage.id) {
                    return newMessage
                }
                return currentMessage
            })
            )
        }

        pusherClient.bind('messages:new', messageHandler)

        pusherClient.bind('message:update', updateMessageHandler)


        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:new', messageHandler)
            pusherClient.unbind('message:update', updateMessageHandler)

        }


    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i == messages.length - 1}
                    key={message.id}
                    data={message}

                />
            ))
            }

            <div ref={bottomRef} className="pt-24" />
        </div >

    )
}
export default Body
