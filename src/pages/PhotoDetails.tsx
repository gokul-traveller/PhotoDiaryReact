import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import PhotoCard from "../components/PhotoCard";

interface Photo {
  id: number;
  url: string;
  isLocked: boolean;
}

interface Profile {
  id: string;
  name: string;
  locked: boolean;
  photos: Photo[];
}

const initialDummyProfiles: Record<string, Profile> = {
  "1": {
    id: "1",
    name: "Alice",
    locked: false,
    photos: [],
  },
  "2": {
    id: "2",
    name: "Bob",
    locked: true,
    photos: [],
  },
};

const PhotoDetails = () => {
  const id = useRef(0);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const [profiles, setProfiles] = useState(initialDummyProfiles); // store all profiles
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setProfile({
    id: "6",
    name: "Bob",
    locked: true,
    photos: [],
  });
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenIndex === null) return;
      if (e.key === "ArrowLeft") {
        setFullscreenIndex((prev) => (prev! > 0 ? prev! - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setFullscreenIndex((prev) => (prev! < (profile?.photos.length ?? 0) - 1 ? prev! + 1 : prev));
      } else if (e.key === "Escape") {
        setFullscreenIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenIndex, profile?.photos.length]);

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

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto: Photo = {
        id:id.current += 1,
        url: reader.result as string,
        isLocked: false,
      };

      const updatedProfile = {
        ...profile,
        photos: [...profile.photos, newPhoto],
      };

      setProfile(updatedProfile);
      setProfiles((prev) => ({
        ...prev,
        [profile.id]: updatedProfile,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleDelete = (photoId: number) => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      photos: profile.photos.filter((p) => p.id !== photoId),
    };

    setProfile(updatedProfile);
    setProfiles((prev) => ({
      ...prev,
      [profile.id]: updatedProfile,
    }));
  };

  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!profile) return <p className="text-center text-red-500">Profile not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{profile.name} Profile</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profile.photos.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No photos uploaded yet.
          </p>
        ) : (
          profile.photos.map((photo, index) => (
            <div key={photo.id}>
              <div onClick={() => setFullscreenIndex(index)}>
                <PhotoCard photo={photo} />
              </div>

              {user?.id === profile.id && (
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
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
      {fullscreenIndex !== null && profile.photos[fullscreenIndex] && (
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
      src={profile.photos[fullscreenIndex].url}
      alt="Fullscreen"
      className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105 object-contain"
    />

    {/* Right Arrow */}
    {fullscreenIndex < profile.photos.length - 1 && (
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