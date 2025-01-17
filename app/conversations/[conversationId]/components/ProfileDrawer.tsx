'use client'

import useOtherUser from "@/app/hooks/useOtherUser"
import { Conversation, User } from "@prisma/client"
import { Fragment, useMemo, useState } from "react"
import { format } from 'date-fns'
import { Transition, Dialog } from '@headlessui/react'
import { IoClose, IoTrash } from 'react-icons/io5'
import Avatar from "@/app/components/avatar"
import ConfirmModal from "./ConfirmModal"
import useActiveList from "@/app/hooks/useActiveList"

interface ProfileDrawerProps {
    isOpen: boolean,
    onClose: () => void,
    data: Conversation & {
        users: User[]
    }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    data,
    isOpen,
    onClose
}) => {
    const otherUser = useOtherUser(data)
    const { members } = useActiveList()
    const isActive = members.indexOf(otherUser?.email!) != -1
    const [confirmOpen, setConfirmOpen] = useState(false)
    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP')
    }, [otherUser.createdAt])

    const title = useMemo(() => {
        return otherUser.name
    }, [otherUser.name])

    const statusText = useMemo(() => {
        return isActive ? 'Active' : 'Offline'
    }, [data, isActive])

    return (
        <>
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => { setConfirmOpen(false) }}
            />


            <Transition.Root
                show={isOpen} as={Fragment}
            >
                <Dialog as='div' className='relative z-50' onClose={onClose}>

                    <Transition.Child as={Fragment} enter='ease-out duration-500' enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">

                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="inset-y-0 fixed pointer-events-none right-0 flex max-w-full pl-10">

                            <Transition.Child as={Fragment} enter='transform transition ease-in-out duration-500' enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveTo="translate-x-full">
                                <Dialog.Panel
                                    className='pointer-events-auto w-screen max-w-md'
                                >

                                    <div className="flex h-full flex-col bg-white py-6 shadow-xl overflow-y-scroll">
                                        <div className="px-4 sm:px-6 ">
                                            <div className="flex items-start justify-end">
                                                <div className="ml-3 flex items-center h-7">
                                                    <button
                                                        type="button"
                                                        className="hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md bg-white text-gray-500"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only"> Close Panel</span>
                                                        <IoClose size={28} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative mt-6 px-4 flex-1 sm:px-6">
                                            <div className="flex flex-col items-center">
                                                <div className="mb-2">
                                                    <Avatar user={otherUser} />
                                                </div>
                                                <div>
                                                    {title}
                                                </div>
                                                <div className="text-sm text-gray-500">{statusText}</div>
                                                <div className="flex gap-10 my-8">
                                                    <div onClick={() => { setConfirmOpen(true) }} className="cursor-pointer hover:text-red-500 flex items-center flex-col">
                                                        <div
                                                            onClick={() => { }} className="w-10 h-10 flex items-center bg-neutal-100 rounded-full justify-center">
                                                            <IoTrash size={25} />
                                                        </div>
                                                        <div className="text-sm font-light text-red-600">Delete Chat</div>
                                                    </div>

                                                </div>
                                                <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                    <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                        <div>
                                                            <dt className="text-lg text-gray-600 font-medium sm:w-40 sm:flex-shrink-0">Email</dt>
                                                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                {otherUser.email}
                                                            </dd>
                                                        </div>
                                                        <>
                                                            <hr />
                                                            <div>
                                                                <dt className="font-medium text-gray-600 text-lg sm:w-40 sm:flex-shrink-0">
                                                                    Joined
                                                                </dt>
                                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                                                    <time dateTime={joinedDate}>{joinedDate}</time>
                                                                </dd>
                                                            </div>
                                                        </>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>


            </Transition.Root>
            {/* </Modal> */}
        </>
    )
}
export default ProfileDrawer