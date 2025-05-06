import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import wrong from "/src/assets/wrong.svg";
import pencil from "/src/assets/pencil.svg";
import save from "/src/assets/save.svg";
import PhotoCard from "../components/PhotoCard";
import Logo from "../components/navBar/Logo";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserCategories, uploadCategory, deletePhoto ,updateCategoryTitle } from "../api/photoApi";

interface Photo {
  categoryId: number;
  publicId: string;
  name: string;
  imageData: string; // from backend
  locked: boolean;
}

const Profile: React.FC = () => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [newTitle, setNewTitle] = React.useState<string>("");
  const { userId } = useParams<{ userId: string }>();
  const parsedPhotoId = userId?userId:"0";
  console.log(Number(parsedPhotoId));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: category, isLoading, error, refetch } = useQuery({
    queryKey: ["category", parsedPhotoId],
    queryFn: () => fetchUserCategories(Number(parsedPhotoId)),
    enabled: !!parsedPhotoId,
  });

  const triggerFileSelect = () => {
   // console.log("category info"+category[0].categoryId);
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadCategory(file,parsedPhotoId);
      console.log("Image uploaded from component!");
      refetch();
    } catch (err) {
      console.error("Upload failed in component:", err);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      await deletePhoto(publicId);
      console.log("Image deleted:", publicId);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const editTittle = (categoryId: number, currentTitle: string) => {
    setEditingId(categoryId);
    setNewTitle(currentTitle);
  };
  const saveTitle = async (categoryId: number) => {
    try {
      await updateCategoryTitle(categoryId, newTitle); // define this in `photoApi.ts`
      setEditingId(null);
      refetch(); // refresh the data
    } catch (err) {
      console.error("Error updating title:", err);
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
          category.map((photos : Photo) => (
            <div  key={photos.categoryId} className="relative w-full">
              <PhotoCard
                photo={{
                  photoId: photos.categoryId,
                  url: photos.imageData,
                  isLocked: photos.locked,
                }}
              /> 
              <div className="absolute inset-0 flex items-center justify-center " style={{ pointerEvents: "none" }}>

              <span className="text-white px-4 py-1 rounded-lg text-5xl font-semibold" style={{
                textShadow: `
                0 0 4px rgba(0, 0, 0, 0.8),
                0 0 8px rgba(0, 0, 0, 0.7),
                0 0 16px rgba(0, 0, 0, 0.6),
                0 0 32px rgba(0, 0, 0, 0.5)`,
              }}>
                {editingId === photos.categoryId ?
                (
                  <div>
                    <input
                      className=" text-center focus:outline-none bg-transparent border-none"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="absolute top-2 left-2 p-1 rounded-full bg-black hover:bg-gray-500 shadow-lg"
                      title="Cancel"
                    >
                      <img src={wrong} alt="Cancel" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveTitle(photos.categoryId)}
                      className="absolute top-2 left-10 p-1 rounded-full bg-green-600 hover:bg-white shadow-lg"
                      title="Save"
                    >
                      <img src={save} alt="Save" className="w-4 h-4" />
                    </button>
                    </div>
                ):
                (
                  <div>
                    {photos.name}
                    <button
                      onClick={() => editTittle(photos.categoryId, photos.name)}
                      className="absolute top-2 left-2 p-1 rounded-full bg-white hover:bg-gray-500 shadow-lg"
                      title="edit_tittle"
                    >
                      <img src={pencil} alt="Edit" className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </span>
              </div>
              <button
                onClick={() => handleDelete(photos.publicId)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black hover:bg-white shadow-lg"
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
