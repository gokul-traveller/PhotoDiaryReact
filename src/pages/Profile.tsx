import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import pencil from "/src/assets/pencil.svg";
import { useAuthStore } from "../context/authStore";
import EditablePhotoCard from "./EditablePhotoCard";
import {
  fetchUserCategories,
  uploadCategory,
  fetchUserById
} from "../api/photoApi";

interface User{ userId: number; userName: string; imageData: string; email: string; lock: boolean }

interface Photo {
  categoryId: number;
  publicId: string;
  name: string;
  imageData: string;
  locked: boolean;
}

const Profile: React.FC = () => {
  const [editEnable, setEditEnable] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useParams<{ userId: string}>();
  const logeduser = useAuthStore((state) => state.user);
  const parsedUserId = userId ?? "0";

  const { data: category, isLoading, error, refetch } = useQuery({
    queryKey: ["category", parsedUserId],
    queryFn: () => fetchUserCategories(Number(parsedUserId)),
    enabled: !!parsedUserId,
  });

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", parsedUserId],
    queryFn: () => fetchUserById(Number(parsedUserId)),
    enabled: !!parsedUserId,
  });

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadCategory(file, parsedUserId);
      console.log("Image uploaded successfully!");
      refetch();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (isLoading || userLoading) {
    return <p className="text-center text-gray-600">Loading photos...</p>;
  }

  if (error || userError) {
    return <p className="text-center text-red-500">Error loading photos.</p>;
  }

  return (
    <div>
      <div className="relative flex items-center w-full px-2 py-1">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold">{user?.userName}</h1>
        </div>
        <div className="ml-auto">
        <button
          onClick={() => setEditEnable((prev) => !prev)}
          className=" top-2 left-2 p-1 rounded-full bg-white hover:bg-gray-500 shadow-lg"
          title="Edit"
        >
          <img src={pencil} alt="Edit" className="w-4 h-4" />
        </button>
        </div>
      </div>

      {/* Photo List */}
      <div className="flex flex-col gap-2 w-full pb-2">
      {Array.isArray(category) && category.length > 0 ? (
        category.map((photo: Photo) => (
          <EditablePhotoCard
            key={photo.categoryId}
            photo={photo}
            editEnable={editEnable}
            refetch={refetch}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No photos uploaded yet.</p>
      )}
      </div>

      {/* Add Photo Button */}
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
