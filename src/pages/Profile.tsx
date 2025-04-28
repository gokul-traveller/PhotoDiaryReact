import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import wrong from "/src/assets/wrong.svg";
import PhotoCard from "../components/PhotoCard";
import Logo from "../components/navBar/Logo";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserCategories, uploadCategory, deletePhoto } from "../api/photoApi";

interface Photo {
  id: number;
  name: string;
  imageData: string; // from backend
  locked: boolean;
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsedPhotoId = parseInt(userId || "0", 10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: category, isLoading, error, refetch } = useQuery({
    queryKey: ["category", parsedPhotoId],
    queryFn: () => fetchUserCategories(parsedPhotoId),
    enabled: !!parsedPhotoId,
  });

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadCategory(file);
      console.log("Image uploaded from component!");
      refetch();
    } catch (err) {
      console.error("Upload failed in component:", err);
    }
  };

  const handleDelete = async (photoId: number) => {
    try {
      await deletePhoto(photoId);
      console.log("Image deleted:", photoId);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-600">Loading photos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading photos.</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center w-full px-4 py-1 bg-slate-800">
        <Link to="/" className="text-1xl md:text-2xl font-georgia text-white flex items-center ml-3">
          <Logo />
          <span className="ml-2">{category?.[0]?.name || "Loading..."}</span>
        </Link>
        <button
          onClick={triggerFileSelect}
          className="px-6 py-1 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full py-2">
        {category?.length === 0 ? (
          <p className="text-center text-gray-500">No photos uploaded yet.</p>
        ) : (
          category.map((photo : Photo) => (
            <div key={photo.id} className="relative w-full">
              <PhotoCard
                photo={{
                  id: photo.id,
                  url: photo.imageData,
                  isLocked: photo.locked,
                }}
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white shadow-lg"
                title="Delete"
              >
                <img src={wrong} alt="Delete" className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Photo Button at the Bottom */}
      <div className="mt-2 w-full flex justify-center">
        <button
          onClick={triggerFileSelect}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          Add Photo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Profile;
