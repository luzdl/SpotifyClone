import { axiosInstance } from '@/lib/axios';
import { Album, Song } from '@/types';
import {create} from 'zustand';

interface MusicStore {
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    featuredSongs: Song[];

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs:[],
    isLoading: true,
    error: null,
    currentAlbum: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    

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

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
            console.log("error en fetchFeaturedSongs");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
            console.log("error en fetchMadeForYouSongs");
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: response.data });
        } catch (error:any) {
            set({ error: error.response.data.message });
            console.log("error en fetchtrendingSongs");
        } finally {
            set({ isLoading: false });
        }
    },
}))

