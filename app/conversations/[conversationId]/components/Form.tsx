'use client'

import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "../../components/MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";
import { CldUploadButton } from 'next-cloudinary'

export default function Form() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const { conversationId } = useConversation()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true })
        axios.post('/api/messages', {
            ...data, conversationId
        })
    }
    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
    }
    return (
        <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">

            <CldUploadButton
                options={{ maxFiles: 1 }}
                onSuccess={handleUpload}
                uploadPreset="ilpvvp9y">

                <HiPhoto size={35}
                    className='text-green-700' />
            </CldUploadButton>

            <form onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >

                <MessageInput
                    id='message'
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <button type="submit" className="rounded-full p-2 bg-green-500 cursor-pointer hover:bg-green-600 transition ">
                    <HiPaperAirplane size={20} className='text-white' />
                </button>
            </form>
        </div>
    )
}
