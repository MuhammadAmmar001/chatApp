import { getServerSession } from 'next-auth'

import { authOptions } from '../api/auth/[...nextauth]/route'


export default async function getSession() {
    // console.log("getSession ", authOptions);
    const session = await getServerSession(authOptions);
    // console.log("Session retrieved: ", session);
    return session;
}
