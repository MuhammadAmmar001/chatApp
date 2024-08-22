'use client'

import { User } from '@prisma/client'
import axios from 'axios'
import { result } from 'lodash'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../Modal'
import Input from '../Input'
import Button from '../Button'

interface SettingsModalProps {
    isOpen?: boolean
    onClose: () => void
    currentUser: User
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser }
) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        axios.post('/api/settings', data).then(() => {
            router.refresh();
            onClose()
        })
            .catch(() => toast.error('Something went wrong')).finally(() => setIsLoading(false))
    }

    // const handleUpload = (result: any) => {

    // }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    className='space-y-12'
                >
                    <div className='border-b border-gray-900/10 pb-2'>
                        <h2 className='text-base font-semibold leading-7 text-gray-900'>
                            EDIT YOUR PROFILE
                        </h2>

                        <div className='mt-3 flex flex-col'>
                            <Input disabled={isLoading} label='Name' id='name' errors={errors} required register={register} />
                        </div>
                    </div>
                    <div className='flex items-center justify-end gap-x-3'>
                        <Button disabled={isLoading} secondary onClick={onClose}>Cancel</Button>
                        <Button disabled={isLoading} type='submit' >Save</Button>
                    </div>
                </div>

            </form>
        </Modal>)
}
export default SettingsModal