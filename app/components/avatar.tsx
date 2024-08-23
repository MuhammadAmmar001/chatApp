'use client'

import Image from "next/image"
import useActiveList from "../hooks/useActiveList"
import { User } from '@prisma/client'

interface AvatarProps {
    user?: User
}


const avatar: React.FC<AvatarProps> = ({ user }) => {
    const { members } = useActiveList()
    console.log("Active members: ", members);
    const isActive = members.indexOf(user?.email!) != -1
    console.log("isActive: ===>", isActive);


    return (
        <div className="relative">

            <div
                className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11"
            >
                <Image
                    alt="Avatar"
                    src='/images/img.png'
                    fill
                />
            </div>
            {isActive && (

                <span className="absolute block rounded-full bg-green-500 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
            )}
        </div>
    )
}
export default avatar
