import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import PhotoCard from "../components/PhotoCard";
import { useQuery } from "@tanstack/react-query";
import wrong from "/src/assets/wrong.svg";
import pencil from "/src/assets/pencil.svg";
import lock from "/src/assets/lock.svg";
import unlock from "/src/assets/unlock.svg";
import LoadingPopup from "./LoadingPopup"; 
import {
  fetchUserPhotos,
  uploadInnerPhoto,
  deleteInnerPhoto,
  fetchCategoryById,
  fetchCategoryUser,
  updatePhotoLock
} from "../api/photoApi";


interface Photo {
  photoId: number;
  publicId: string;
  imageData: string;
  locked: boolean;
}

const PhotoDetails = () => {
  const navigate = useNavigate();
  const [editEnable, setEditEnable] = useState<boolean>(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const { photoId } = useParams<{ photoId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logedUser = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    console.log("logged user from home page is :"  + logedUser)
    if (logedUser===null) {
      navigate(`/login`);
    }
  }, []);

    const { data: CurrentProfile } = useQuery({
      queryKey: ["CurrentProfile", photoId],
      queryFn: () => fetchCategoryUser(Number(photoId)),
      enabled: !!photoId,
    });

  const {
    data: photoss,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["photoss", photoId],
    queryFn: () => fetchUserPhotos(photoId),
    enabled: !!photoId,
  });

  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", photoId],
    queryFn: () => fetchCategoryById(Number(photoId)),
    enabled: !!photoId,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex === null || !photoss) return;
      if (e.key === "ArrowLeft") {
        setFullscreenIndex((prev) => (prev! > 0 ? prev! - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setFullscreenIndex((prev) =>
          prev! < photoss.length - 1 ? prev! + 1 : prev
        );
      } else if (e.key === "Escape") {
        setFullscreenIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenIndex, photoss]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (!file) return; 
    try {
      await Promise.all([
        uploadInnerPhoto(photoId!, file),
        sleep(1000)
      ]);
      refetch();
    } catch (err) {
      console.error("Upload failed in component:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoPublicId: string) => {
    setLoading(true);
    try {
      await Promise.all([
        deleteInnerPhoto(photoPublicId),
        sleep(1000)
      ]);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }finally {
      setLoading(false);
    }
  };

    const handleLockToggle = async (photoId: number , lock: boolean) => {
      setLoading(true);
      try {
        await Promise.all([
          updatePhotoLock(photoId, lock),
          sleep(1000)
        ]);
        refetch();
      } catch (err) {
        console.error("Failed to toggle lock", err);
      } finally {
        setLoading(false);
      }
    };

  if (isLoading || categoryLoading) return <p className="text-center">Loading profile...</p>;
  if (!photoss || !category) return <p className="text-center text-red-500">Profile not found.</p>;
  if (error || categoryError) return <p className="text-center text-red-500">Error loading photos.</p>;

  return (
<div className="w-full mx-auto px-2 sm:px-4 md:px-6">
  {loading && <LoadingPopup />} 
  <div className="relative flex items-center justify-between w-full px-2 py-2">
  <div className="z-10">
    <h1 className="text-2xl font-bold">{category?.userName}</h1>
  </div>
  <div className="absolute left-1/2 transform -translate-x-1/2 z-0">
    <h1 className="text-2xl font-bold">{category?.categoryName}</h1>
  </div>
  {CurrentProfile === logedUser?.userId ? (
    <button
      onClick={() => setEditEnable((prev) => !prev)}
      className="p-1 rounded-full bg-white hover:bg-gray-500 shadow-lg z-10"
      title="Edit"
    >
      <img src={pencil} alt="Edit" className="w-4 h-4" />
    </button>
  ) : (
    <div className="w-8 h-8" />
  )}
</div>

  <div className="w-full">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
    {photoss.length === 0 ? (
      <p className="text-gray-500 col-span-full text-center">
        No photos uploaded yet.
      </p>
    ) : (
      photoss.map((photos: Photo, index: number) => (
        <div key={photos.photoId} className="w-full relative">
          <div onClick={() => setFullscreenIndex(index)}>
            <PhotoCard
              photo={{
                photoId: photos.photoId,
                url: photos.imageData,
                isLocked: photos.locked,
              }}
            />
          </div>
          {editEnable && (
            <div>
            <button
              onClick={() => handleDelete(photos.publicId)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white shadow-lg z-10"
              title="Delete"
            >
              <img src={wrong} alt="Delete" className="w-4 h-4" />
            </button>
                  <button
                  onClick={() => handleLockToggle(photos.photoId, !photos.locked)}
                  className={`absolute top-2 left-2 p-1 rounded-full shadow-lg ${
                    photos.locked ? "bg-white hover:bg-green-600" : "bg-white hover:bg-red-600"
                  }`}
                  title={photos.locked ? "Unlock" : "Lock"}
                >
                  <img
                    src={photos.locked ? unlock : lock}
                    alt={photos.locked ? "Unlock" : "Lock"}
                    className="w-4 h-4"
                  />
                </button>
                </div>
          )}
        </div>
      ))      
    )}
  </div>
</div>
{CurrentProfile === logedUser?.userId && (
        <div className="flex justify-center">
        <button
          onClick={triggerFileSelect}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-4"
        >
          Add Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
      </div>
)}



      {fullscreenIndex !== null && photoss[fullscreenIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center transition-all">
          <button
            onClick={() => setFullscreenIndex(null)}
            className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform"
          >
            &times;
          </button>

          {fullscreenIndex > 0 && (
            <button
              className="absolute left-4 md:left-8 text-white text-5xl px-3 py-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
              onClick={() => setFullscreenIndex(fullscreenIndex - 1)}
            >
              &#8592;
            </button>
          )}

          <img
            src={photoss[fullscreenIndex].imageData}
            alt="Fullscreen"
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105 object-contain"
          />

          {fullscreenIndex < photoss.length - 1 && (
            <button
              className="absolute right-4 md:right-8 text-white text-5xl px-3 py-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
              onClick={() => setFullscreenIndex(fullscreenIndex + 1)}
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoDetails;
