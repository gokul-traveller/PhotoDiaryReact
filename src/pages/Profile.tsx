import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import pencil from "/src/assets/pencil.svg";
import { useAuthStore } from "../context/authStore";
import EditablePhotoCard from "./EditablePhotoCard";
import LoadingPopup from "./LoadingPopup";
import {
  fetchUserCategories,
  uploadCategory,
  fetchUserById
} from "../api/photoApi";

interface Photo {
  categoryId: number;
  publicId: string;
  name: string;
  imageData: string;
  locked: boolean;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [editEnable, setEditEnable] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId } = useParams<{ userId: string}>();
  const logedUser = useAuthStore((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const parsedUserId = userId ?? "0";

  useEffect(() => {
    console.log("logged user from home page is : "  + logedUser ?.userId + "and current user is : " + parsedUserId)
    if (logedUser===null) {
      navigate(`/login`);
    }
  }, []);

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
      setUploading(true);
      await uploadCategory(file, parsedUserId);
      refetch();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const isAppLoading = isLoading || userLoading || uploading;

  if (isLoading || userLoading) {
    return <p className="text-center text-gray-600">Loading photos...</p>;
  }

  if (error || userError) {
    return <p className="text-center text-red-500">Error loading photos.</p>;
  }

  return (
    <div>
      {isAppLoading && <LoadingPopup />}
<div className="relative flex w-full px-2 py-2">
  <div>
    <h1 className="text-2xl font-bold ml-2">{user?.userName}</h1>
  </div>
  {logedUser?.userId === Number(parsedUserId) ? (
    <button
      onClick={() => setEditEnable((prev) => !prev)}
      className="rounded-full bg-white hover:bg-gray-500 shadow-lg w-8 h-8 flex items-center justify-center ml-auto mr-2"
      title="Edit"
    >
      <img src={pencil} alt="Edit" className="w-4 h-4" />
    </button>
  ) : (
    <div className="w-8 h-8" />
  )}
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

      {logedUser?.userId === Number(parsedUserId) && (
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
      )}
    </div>
  );
};

export default Profile;
