"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

const LandingNavbar = () => {
    const { isSignedIn } = useAuth();

    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-4">
                    <Image fill alt="Logo" src="/EveLogo.png" />
                </div>
                <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                    Eve
                </h1>
            </Link>
            <div className="flex items-center gap-x-2">
                {isSignedIn ?
                    <Link href="/dash">
                        <div className="text-slate-500 font-bold mr-2">Dash</div>
                    </Link>
                    :
                    <Link href="/sign-in">
                        <div className="text-slate-500 font-bold mr-2">Sign In</div>
                    </Link>
                }
                <Link href={isSignedIn ? "/dash" : "/sign-up"}>
                    <Button variant="outline" className="rounded-full">
                        Get Started
                    </Button>
                </Link>
            </div>
        </nav>
    )
}

export default LandingNavbar;

