'use client'

import useConversation from "@/app/hooks/useConversation";
import useRoute from "@/app/hooks/useRoute"
import MobileItem from "./MobileItem";

export default function MobileFooter() {
    const routes = useRoute();
    const { isOpen } = useConversation();

    if (isOpen) {
        return null;
    }

    return (
        <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">

            {
                routes.map((route) => (
                    <MobileItem
                        key={route.label}
                        href={route.href}
                        icon={route.icon}
                        onClick={route.onClick}
                        active={route.active}
                    />
                ))
            }


        </div>)
}
