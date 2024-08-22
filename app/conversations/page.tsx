'use client'
import clsx from 'clsx'
import useConversation from '../hooks/useConversation'

import NewState from '../components/NewState'

const Home = () => {
    const { isOpen } = useConversation()
    return (
        <div className={clsx(`
        lg:pl-80 h-full lg:block`, isOpen ? 'block' : 'hidden')}>
            <NewState />
        </div>
    )
};
export default Home