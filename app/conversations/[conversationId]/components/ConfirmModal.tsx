'use client'

import useConversation from "@/app/hooks/useConversation"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Modal from "@/app/components/Modal"
import { FiAlertTriangle } from 'react-icons/fi'
import { Dialog } from "@headlessui/react"
import Button from "@/app/components/Button"

interface ConfirmModalProps {
    isOpen?: boolean
    onClose: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose
}) => {
    const router = useRouter()
    const { conversationId } = useConversation()
    const [isLoading, setIsLoading] = useState(false)
    const onDelete = useCallback(() => {
        setIsLoading(true)
        axios.delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose()
                router.push('/conversations')
                router.refresh()
            })
            .catch(() => toast.error('Something went wrong upon chat deletion'))
            .finally(() => { setIsLoading(false) })
    }, [conversationId, router, onClose])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div
                className="sm:flex sm:items-start"
            >
                <div
                    className="flex mx-auto justify-center h-12 w-12 flex-shrink-0 items-center rounded-full bg-red-700 sm:mx-0 sm:h-10 sm:w-10 "
                >
                    <FiAlertTriangle
                        className='h-6 w-6 text-white'
                    />
                </div>
                <div
                    className="sm:mt-0 sm:text-left mt-3 text-center sm:ml-4"
                >
                    <Dialog.Title
                        as='h3'
                        className='text-base font-semi-bold leading-6 text-gray-700'
                    >
                        Delete Chat
                    </Dialog.Title>
                    <div
                        className="mt-2"
                    >
                        <p className="text-sm text-gray-500">Are you sure you want to delete this chat?</p>
                    </div>
                </div>
            </div>
            <div
                className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse"
            >
                <Button disabled={isLoading} danger onClick={onDelete}>
                    Delete
                </Button>
                <Button disabled={isLoading} secondary onClick={onClose}>
                    Cancel
                </Button>

            </div>
        </Modal>
    )
}
export default ConfirmModal