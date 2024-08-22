'use client'

import useOtherUser from "@/app/hooks/useOtherUser"
import { Conversation, User } from "@prisma/client"
import { useMemo, useState } from "react"
import Link from 'next/link'
import { HiChevronLeft } from "react-icons/hi"
import Avatar from "@/app/components/avatar"
import { HiEllipsisHorizontal } from "react-icons/hi2"
import ProfileDrawer from "./ProfileDrawer"
import useActiveList from "@/app/hooks/useActiveList"


interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    }
}

const Header: React.FC<HeaderProps> = ({
    conversation
}) => {
    const otherUser = useOtherUser(conversation)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { members } = useActiveList()
    const isActive = members.indexOf(otherUser?.email!) != -1
    const statusText = useMemo(() => {

        return isActive ? 'Active' : "Offline"

    }, [conversation, isActive])


    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => { setDrawerOpen(false) }}
            />
            <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">


                <div className="flex gap-3 items-center">
                    <Link href='/conversations'
                        className="lg:hidden block text-sky-400 hover:text-sky-600 transition cursor-pointer">
                        <HiChevronLeft size={35} />
                    </Link>
                    <Avatar user={otherUser} />
                    <div className="flex flex-col">
                        <div>
                            {otherUser.name}
                        </div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={35}
                    className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
                    onClick={() => { setDrawerOpen(true) }}

                />
            </div >
        </>
    )
}
export default Header