import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'
export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser()
        const body = await request.json()
        const { name } = body

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        const updateUser = await prisma?.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name
            }
        })
        return NextResponse.json(updateUser)

    } catch (error: any) {
        console.log(error, 'ERROR IN SETTINGS');
        return new NextResponse('Internal Error', { status: 500 })
    }
}