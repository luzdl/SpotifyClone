import { Link } from "react-router-dom";
import { LayoutDashboardIcon } from "lucide-react";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import SingInOAuthButtons from "./SingInOAuthButtons.tsx";
import { useAuthStore } from "../stores/useAuthStore";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "./ui/button.tsx";

const Topbar = () => {
    const {isAdmin} = useAuthStore();
    console.log(isAdmin);

    return (
        <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
            <div className="flex gap-2 items-center">
                <img src="/KODIGOSINFONDO.png" className="size-8" alt="Kodigo Logo"/>
                KodigoMusic 
            </div>
            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link to={"/admin"}
                    className={cn(
                        buttonVariants({variant:"outline"})
                    )}
                    >
                        <LayoutDashboardIcon className="size-4 mr-2" />
                        Admin Dashboard
                    </Link>
                )}



                <SignedOut>
                    <SingInOAuthButtons />
                </SignedOut>

                <UserButton />
            </div>
        </div>
    )
}

export default Topbar