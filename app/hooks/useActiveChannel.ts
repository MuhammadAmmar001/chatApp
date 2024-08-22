import { useEffect, useState } from "react"
import useActiveList from "./useActiveList"
import { Channel, Members } from "pusher-js"
import { pusherClient } from "../libs/pusher"

const useActiveChannel = () => {
    const { set, add, remove } = useActiveList()
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
    console.log("OUTSIDE --> USEEFFECT ACTIVE CHANNEL");
    console.log("OUTSIDE --> USEEFFECT ACTIVE CHANNEL");
    console.log("OUTSIDE --> USEEFFECT ACTIVE CHANNEL");

    useEffect(() => {
        console.log("--> USEEFFECT ACTIVE CHANNEL");
        console.log("--> USEEFFECT ACTIVE CHANNEL");
        console.log("--> USEEFFECT ACTIVE CHANNEL");
        let channel = activeChannel
        console.log("BEFORE CHANNEL");
        console.log(channel);
        console.log("BEFORE CHANNEL");

        console.log("OUTSIDE --> SUBSCRIBED TO PRESENCE_MESSENGER");
        console.log("OUTSIDE --> SUBSCRIBED TO PRESENCE_MESSENGER");
        console.log("OUTSIDE --> SUBSCRIBED TO PRESENCE_MESSENGER");
        if (!channel) {
            channel = pusherClient.subscribe('presence-messenger')
            setActiveChannel(channel)
            console.log("CHANNEL");
            console.log(channel);
            console.log("CHANNEL");
            console.log("SUBSCRIBED TO PRESENCE_MESSENGER");
            console.log("SUBSCRIBED TO PRESENCE_MESSENGER");
            console.log("SUBSCRIBED TO PRESENCE_MESSENGER");
        }

        console.log("OUTSIDE --> FIRST BIND SUCCEED");
        console.log("OUTSIDE --> FIRST BIND SUCCEED");
        console.log("OUTSIDE --> FIRST BIND SUCCEED");
        channel.bind('pusher:subscription_succeeded', (members: Members) => {
            console.log("INSIDE --> FIRST BIND SUCCEED");
            console.log("INSIDE --> FIRST BIND SUCCEED");
            console.log("INSIDE --> FIRST BIND SUCCEED");
            const initialMembers: string[] = []

            members.each((member: Record<string, any>) => initialMembers.push(member.id))

            set(initialMembers)
            console.log("INITIALMEMBERS ARRAY ====>");
            console.log(initialMembers);
            console.log("INITIALMEMBERS ARRAY ====>");
            console.log("INITIAL TO PRESENCE_MESSENGER");
            console.log("INITIAL TO PRESENCE_MESSENGER");
            console.log("INITIAL TO PRESENCE_MESSENGER");
        })

        channel.bind('pusher:member_added', (member: Record<string, any>) => {
            add(member.id)
            console.log("ADDED TO PRESENCE_MESSENGER");
            console.log("ADDED TO PRESENCE_MESSENGER");
            console.log("ADDED TO PRESENCE_MESSENGER");
        })
        channel.bind('pusher:member_remove', (member: Record<string, any>) => {
            remove(member.id)
            console.log("REMOVED TO PRESENCE_MESSENGER");
            console.log("REMOVED TO PRESENCE_MESSENGER");
            console.log("REMOVED TO PRESENCE_MESSENGER");
        })

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe('presence-messenger')
                setActiveChannel(null)
                console.log("UNSUBSCRIBE TO PRESENCE_MESSENGER");
                console.log("UNSUBSCRIBE TO PRESENCE_MESSENGER");
                console.log("UNSUBSCRIBE TO PRESENCE_MESSENGER");
            }
        }

    }, [set, add, remove])

}
export default useActiveChannel