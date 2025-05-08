import React, { useState } from "react";
import wrong from "/src/assets/wrong.svg";
import pencil from "/src/assets/pencil.svg";
import save from "/src/assets/save.svg";
import lock from "/src/assets/lock.svg";
import unlock from "/src/assets/unlock.svg";
import PhotoCard from "../components/PhotoCard";
import { updateCategoryTitle, updateCategoryLock, deletePhoto } from "../api/photoApi";

interface EditablePhotoCardProps {
  photo: {
    categoryId: number;
    publicId: string;
    name: string;
    imageData: string;
    locked: boolean;
  };
  editEnable: boolean;
  refetch: () => void;
}

const EditablePhotoCard: React.FC<EditablePhotoCardProps> = ({
  photo,
  editEnable,
  refetch,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(photo.name);
  const [locked, setLocked] = useState(false);

  const handleSave = async () => {
    try {
      await updateCategoryTitle(photo.categoryId, title);
      setEditing(false);
      refetch();
    } catch (err) {
      console.error("Failed to update title", err);
    }
  };

  const handleLockToggle = async () => {
    try {
      await updateCategoryLock(photo.categoryId, !locked);
      setLocked(!locked);
      refetch();
    } catch (err) {
      console.error("Failed to toggle lock", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePhoto(photo.publicId);
      refetch();
    } catch (err) {
      console.error("Failed to delete photo", err);
    }
  };

  return (
<div className="relative w-full">
  {/* Background PhotoCard (clickable) */}
  <PhotoCard
    photo={{
      photoId: photo.categoryId,
      url: photo.imageData,
      isLocked: photo.locked,
    }}
  />

  {/* Overlay title (non-blocking) */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {editing ? (
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-white text-5xl font-semibold text-center bg-transparent border-none focus:outline-none pointer-events-auto"
        autoFocus
        style={{
          textShadow: `
            0 0 4px rgba(0, 0, 0, 0.8),
            0 0 8px rgba(0, 0, 0, 0.7),
            0 0 16px rgba(0, 0, 0, 0.6),
            0 0 32px rgba(0, 0, 0, 0.5)
          `,
        }}
      />
    ) : (
      <span
        className="text-white text-5xl font-semibold pointer-events-none"
        style={{
          textShadow: `
            0 0 4px rgba(0, 0, 0, 0.8),
            0 0 8px rgba(0, 0, 0, 0.7),
            0 0 16px rgba(0, 0, 0, 0.6),
            0 0 32px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        {title}
      </span>
    )}
  </div>

  {/* Buttons (independent, clickable, absolutely positioned) */}
  {editEnable && (
    <>
      {editing ? (
        <>
          <button
            onClick={() => setEditing(false)}
            className="absolute top-2 left-2 p-1 rounded-full bg-black hover:bg-gray-500 shadow-lg"
            title="Cancel"
          >
            <img src={wrong} alt="Cancel" className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="absolute top-2 left-10 p-1 rounded-full bg-green-600 hover:bg-white shadow-lg"
            title="Save"
          >
            <img src={save} alt="Save" className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="absolute top-2 left-2 p-1 rounded-full bg-white hover:bg-gray-500 shadow-lg"
          title="Edit"
        >
          <img src={pencil} alt="Edit" className="w-4 h-4" />
        </button>
      )}

      {/* Lock and delete always available in edit mode */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full bg-black hover:bg-white shadow-lg"
        title="Delete"
      >
        <img src={wrong} alt="Delete" className="w-4 h-4" />
      </button>
      <button
        onClick={handleLockToggle}
        className={`absolute top-2 right-10 p-1 rounded-full shadow-lg ${
          locked ? "bg-white hover:bg-green-600" : "bg-white hover:bg-red-600"
        }`}
        title={locked ? "Unlock" : "Lock"}
      >
        <img
          src={locked ? unlock : lock}
          alt={locked ? "Unlock" : "Lock"}
          className="w-4 h-4"
        />
      </button>
    </>
  )}
</div>

  );
};

export default EditablePhotoCard;
