import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import PhotoCard from "../components/PhotoCard";
import { useQuery } from "@tanstack/react-query";
import wrong from "/src/assets/wrong.svg";
import { fetchUserPhotos,uploadInnerPhoto,deleteInnerPhoto } from "../api/photoApi";

interface Photo {
  photoId: number;
  publicId:string;
  imageData: string;
  locked: boolean;
}



const PhotoDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);


  const [loading, setLoading] = useState(false);
  const { photoId } = useParams<{ photoId: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: photoss, isLoading, error, refetch } = useQuery({
    queryKey: ["photoss", photoId],
    queryFn: () => fetchUserPhotos(photoId),
    enabled: !!photoId,
  });
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex === null) return;
      if (e.key === "ArrowLeft") {
        setFullscreenIndex((prev) => (prev! > 0 ? prev! - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setFullscreenIndex((prev) => (prev! < (photoss?.photos.length ?? 0) - 1 ? prev! + 1 : prev));
      } else if (e.key === "Escape") {
        setFullscreenIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenIndex, photoss?.photos.length]);

  // useEffect(() => {
  //   setLoading(true);

  //   setTimeout(() => {
  //     // const foundProfile = profiles[userId ?? ""];

  //     // if (!foundProfile) {
  //     //   setProfile(null);
  //       setLoading(false);
  //     //   return;
  //     // }

  //     if (foundProfile.locked && user?.id !== userId) {
  //       navigate("/");
  //       return;
  //     }

  //     setProfile(foundProfile);
  //     setLoading(false);
  //   }, 300);
  // }, [userId, user, profiles, navigate]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("Image before uploading from component!");
      await uploadInnerPhoto(photoId!,file);
      console.log("Image uploaded from component!");
      refetch();
    } catch (err) {
      console.error("Upload failed in component:", err);
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      await deleteInnerPhoto(photoId);
      console.log("Image deleted:", photoId);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading) return <p className="text-center">Loading profile...</p>;
  if (!photoss) return <p className="text-center text-red-500">Profile not found.</p>;
  if (error) return <p className="text-center text-red-500">Profile not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{photoss.userName} Profile</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(!photoss || !photoss.photos)  ? (
          <p className="text-gray-500 col-span-full text-center">
            No photos uploaded yet.
          </p>
        ) : (
          photoss.photos.map((photos: Photo, index: number) => (
            <div key={photos.photoId} className="relative w-full">
              <div onClick={() =>setFullscreenIndex(index)}>
                <PhotoCard
                  photo={{
                    id: photos.photoId,  // use photo.photoId
                    url: photos.imageData,  // use photo.imageData
                    isLocked: photos.locked,  // use photo.locked
                  }}
                />
              </div>

              {/* {user?.id === photoss.id && ( */}
                <button
                  onClick={() => handleDelete(photos.publicId)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-white shadow-lg"
                  title="Delete"
                >
                <img src={wrong} alt="Delete" className="w-4 h-4" />
                </button>
              {/* )} */}
            </div>
          ))
        )}
      </div>
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
      {fullscreenIndex !== null && photoss.photos[fullscreenIndex] && (
  <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center transition-all">
    {/* Close Button */}
    <button
      onClick={() => setFullscreenIndex(null)}
      className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform"
    >
      &times;
    </button>

    {/* Left Arrow */}
    {fullscreenIndex > 0 && (
      <button
        className="absolute left-4 md:left-8 text-white text-5xl px-3 py-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition"
        onClick={() => setFullscreenIndex(fullscreenIndex - 1)}
      >
        &#8592;
      </button>
    )}

    {/* Image */}
    <img
      src={photoss.photos[fullscreenIndex].imageData}
      alt="Fullscreen"
      className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105 object-contain"
    />

    {/* Right Arrow */}
    {fullscreenIndex < photoss.photos.length - 1 && (
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