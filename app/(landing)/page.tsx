
import { UserButton, currentUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import LandingNavbar from "@/components/landing-navbar";
import {LandingHero} from "@/components/landing-hero";
import {LandingContent} from "@/components/landing-content";


const LandingPage = async () => {
    const user = await currentUser()
    return (
        <div>
            Landing Page
            <div className="h-screen">
                <div>
                    <div className="h-full">
                        <LandingNavbar/>
                        <LandingHero/>
                        <LandingContent/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage