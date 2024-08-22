import prisma from '@/app/libs/prismadb'

import getSession from './getSession'

const getUsers = async () => {
    const session = await getSession();
    console.log("session" + session);
    console.log("Session email:", session?.user?.email);

    if (!session?.user?.email) {
        console.log("Empty");
        return [];
    }
    try {
        console.log("Wroking");
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session.user.email
                }
            }
        })
        console.log("users in getUsers: " + users);
        return users
    }
    catch (error: any) {
        return []
    }
}
export default getUsers