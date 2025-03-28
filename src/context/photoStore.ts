import { create } from "zustand";
import { fetchAllPhotos, fetchPhotoDetails } from "../api/photoApi";

interface Photo {
  id: string;
  url: string;
  isLocked: boolean;
  ownerId: string;
  innerPhotos: Photo[];
}

interface PhotoStore {
  photos: Photo[];
  selectedPhoto: Photo | null;
  loadPhotos: () => Promise<void>;
  loadPhotoDetails: (photoId: string) => Promise<void>;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
  photos: [],
  selectedPhoto: null,

  loadPhotos: async () => {
    try {
      const photos = await fetchAllPhotos();
      set({ photos });
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  },

  loadPhotoDetails: async (photoId: string) => {
    try {
      const photo = await fetchPhotoDetails(photoId);
      set({ selectedPhoto: photo });
    } catch (error) {
      console.error("Error fetching photo details:", error);
    }
  },
}));
