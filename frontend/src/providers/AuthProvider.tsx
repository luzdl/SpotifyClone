import { useAuth } from "@clerk/clerk-react"
import { axiosInstance } from "@/lib/axios"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const updateApiToken = (token: string | null) => {
    if (token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axiosInstance.defaults.headers.common['Authorization'];
}

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const {getToken, userId} = useAuth();
    const [loading, setLoading] = useState(true);
    const { checkAdminStatus } = useAuthStore();
    const {initSocket, disconnectedSocket} = useChatStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);
                if (token) {
					await checkAdminStatus();
					// init socket
					if (userId) initSocket(userId);
				}
            } catch (error:any) {
                updateApiToken(null);
                console.log("error in auth provider")
            } finally {
                setLoading(false); 
            }
        }

        initAuth();
        // clean up
		return () => disconnectedSocket();
    }, [getToken, userId, checkAdminStatus, initSocket, disconnectedSocket]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader2 className="size-8 text-emerald-500 animate-spin" />
        </div>
    )

    return <>{children}</>
}
export default AuthProvider