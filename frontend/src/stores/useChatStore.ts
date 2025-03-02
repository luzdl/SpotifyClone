import {create} from "zustand";
import { axiosInstance } from "@/lib/axios";
import {io} from "socket.io-client"

interface ChatStore {
    users: any[];
    fetchUsers: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>

    initSocket: (userId: string) => void;
    disconnectedSocket: () => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/"

const socket = io(baseURL, {
    autoConnect: false, //only connect if user is authenticated
    withCredentials: true,
})

export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null, 
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),

    fetchUsers: async() => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get("/users");
            set({users: response.data});
        } catch (error:any) {
            set({error: error.response.data.message});
            console.log("problem in useChatStore/fetching users ayuda");
        }   finally {
            set({isLoading: false});
        }
    },

    initSocket: (userId: string) => {

        console.log('Initializing socket for user:', userId);

        if (!get().isConnected){  
            socket.auth = {userId};
            socket.connect(); 

            socket.on("connect", () => {
                console.log('Socket connected successfully');
                set({ socket, isConnected: true });
                
                socket.emit("user_connected", userId);
            });

            socket.on("connect_error", (error) => {
                console.error('Socket connection error:', error);
            });

            socket.emit("user_connected", userId);

            socket.on("users_online", (users: string[]) => {
                set({onlineUsers: new Set(users)})
            })

            socket.on("activities", (activities: [string, string][])=>{
                set({userActivities: new Map(activities)})
            })

            socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

            socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

            set({ isConnected: true });

        }
    },

    disconnectedSocket: () => {
        if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
    }


}))