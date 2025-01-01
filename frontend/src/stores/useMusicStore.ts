import { axiosInstance } from '@/lib/axios';
import { Album, Song } from '@/types';
import {create} from 'zustand';

interface MusicStore{
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: string | null;

    fetchAlbums: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs:[],
    isLoading: true,
    error: null,

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
    }
}))