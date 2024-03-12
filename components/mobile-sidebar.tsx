"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "@/components/sidebar";
import {SideBarProps} from "@/components/sidebar";


const MobileSideBar = ({apiLimit = 0, isPro=false}: SideBarProps) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true)
    }, []);
    if (!isMounted) {
        return null
    }

    return (
        <Sheet>
            <SheetTrigger asChild={true}>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <SideBar apiLimit={apiLimit} isPro={isPro}/>
            </SheetContent>
        </Sheet>
    )
}

export default MobileSideBar;