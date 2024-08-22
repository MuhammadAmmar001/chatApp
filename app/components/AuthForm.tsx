'use client'

import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Input from './Input'
import Button from './Button'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'


type mode = 'Login' | 'Register'
export default function AuthForm() {
    const session = useSession();
    const router = useRouter()
    const [mode, setMode] = useState<mode>('Login')
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        if (session?.status == 'authenticated') {
            router.push('/users');
        }
    }, [session?.status, router])



    const toggleMode = useCallback(() => {
        if (mode == 'Login') {
            setMode('Register')
        }
        else {
            setMode('Login')
        }
    }, [mode])

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        if (mode === 'Login') {
            signIn('credentials', {
                ...data, redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid Credentials')
                }
                if (callback?.ok && !callback?.error) {
                    toast.success('Login Successful!')
                    router.push('/users');
                }
            }).finally(() => { setIsLoading(false) })
        }
        if (mode === 'Register') {
            axios.post('/api/register', data)
                .then(() => signIn('credentials', data))
                .catch(() => toast.error("Something went wrong")).finally(() => setIsLoading(false))
        }
    };

    return (
        <div className='mt-8
        sm:mx-auto sm:w-full sm:max-w-md '
        >
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {mode == 'Register' && (
                        <Input label='Name' id='name' type='text' register={register} errors={errors} />
                    )}
                    <Input label='Email' id='email' type='email' register={register} errors={errors} disabled={isLoading} />

                    <Input label='Password' id='password' type='password' register={register} errors={errors} disabled={isLoading} />

                    <Button
                        disabled={isLoading}
                        fullwidth
                        type='submit'

                    >
                        {mode == 'Login' ? 'Sign In' : "Register"}
                    </Button>

                </form>
                <div
                    className='flex gap-2 flex-col text-center text-sm mt-6 px-2 text-gray-400 '
                >
                    <div>
                        {mode == 'Login' ? 'Dont have an account?' : 'Already have an account?'}
                    </div>

                    <div
                        onClick={toggleMode}
                        className='underline cursor-pointer'
                    >
                        {mode == 'Login' ? 'Create your account now!' : 'Login here'}
                    </div>
                </div>



            </div>
        </div>
    );
}