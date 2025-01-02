import { axiosInstance } from '@/lib/axios';
import { Album, Song } from '@/types';
import {create} from 'zustand';

interface MusicStore{
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs:[],
    isLoading: true,
    error: null,
    currentAlbum: null,

    fetchAlbums: async () => {
        set({ isLoading: true, error: null })

        try {
            const response = await axiosInstance.get("/albums")
            set({albums: response.data})
        } catch (error:any) {
            set({error: error.response.data.message});
        } finally {
            set({isLoading:false})
        }
    },

    fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
            console.error("Fetch album by ID error:", error);
            set({ error: error.response?.data?.message || error.message });
		} finally {
			set({ isLoading: false });
		}
	},
}))

