
import {ReactNode} from "react";
import NavBar from "@/components/navbar"
import SideBar from "@/components/sidebar";
import {getApiLimitCount} from "@/lib/api-limit";
import {checkSubscription} from "@/lib/subscription";

const DashLayout =async ({
      children
    }: {
    children: ReactNode
}) => {
    const apiLimit = await getApiLimitCount()
    const isPro = await checkSubscription();
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                    <SideBar apiLimit={apiLimit} isPro={isPro}/>
            </div>
            <main className="md:pl-72 pb-10">
                <NavBar apiLimit={apiLimit} isPro={isPro} />
                {children}
            </main>
        </div>
    )
}

export default DashLayout;