import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { HiChat } from 'react-icons/hi'
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2'
import useConversation from "./useConversation"
import { signOut } from 'next-auth/react'

export default function useRoute() {
    const pathname = usePathname();
    const { conversationId } = useConversation();

    const routes = useMemo(() => [{
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: pathname == './conversations' || !!conversationId

    }
        ,
    {
        label: 'Users',
        href: '/users',
        icon: HiUsers,
        active: pathname == './users'
    },
    {
        label: 'Logout',
        href: '#',
        onClick: () => signOut({ callbackUrl: '/' }),
        icon: HiArrowLeftOnRectangle,
    }
    ], [pathname, conversationId])

    return routes
}
