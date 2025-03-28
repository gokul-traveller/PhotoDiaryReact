import { useParams } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPhotoDetails, uploadInnerPhoto, toggleLockPhoto, grantAccess } from "../api/photoApi";

// Define the Photo Type
interface InnerPhoto {
  id: string;
  url: string;
}

interface Photo {
  id: string;
  url: string;
  ownerId: string;
  isLocked: boolean;
  innerPhotos: InnerPhoto[];
}

const PhotoDetails = () => {
  const { photoId } = useParams<{ photoId: string }>(); // Ensuring photoId is a string
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch Photo Details
  const { data: photo, isLoading, error } = useQuery<Photo>({
    queryKey: ["photo", photoId],
    queryFn: () => fetchPhotoDetails(photoId as string), // Ensure photoId is string
    enabled: !!photoId, // Avoid making a request if photoId is undefined
  });

  // Upload Inner Photo Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadInnerPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["photo", photoId] }),
  });

  // Lock/Unlock Photo Mutation
  const lockMutation = useMutation({
    mutationFn: toggleLockPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["photo", photoId] }),
  });

  // Grant Access Mutation
  const accessMutation = useMutation({
    mutationFn: grantAccess,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["photo", photoId] }),
  });

  if (isLoading) return <p>Loading photo...</p>;
  if (error) return <p>Error loading photo.</p>;
  if (!photo) return <p>No photo found.</p>; // Handle case where photo is undefined

  const handleUploadInnerPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      await uploadMutation.mutateAsync({ photoId: photo.id, file });
    }
  };

  const handleToggleLock = async () => {
    await lockMutation.mutateAsync(photo.id);
  };

  const handleGrantAccess = async (userEmail: string) => {
    if (!userEmail.trim()) return;
    await accessMutation.mutateAsync({ photoId: photo.id, userEmail });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Photo Details</h1>

      <img
        src={photo.url}
        alt="Photo"
        className="w-full max-w-md mx-auto rounded-lg shadow-md"
      />

      {user?.id === photo.ownerId && (
        <div className="mt-4">
          <button
            onClick={handleToggleLock}
            className={`px-4 py-2 text-white rounded-lg ${photo.isLocked ? "bg-red-500" : "bg-green-500"}`}
          >
            {photo.isLocked ? "Unlock Photo" : "Lock Photo"}
          </button>

          <div className="mt-4">
            <input type="file" onChange={handleUploadInnerPhoto} />
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter user email to grant access"
              className="border p-2 rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGrantAccess((e.target as HTMLInputElement).value);
              }}
            />
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mt-6">Inner Photos</h2>
      <div className="grid grid-cols-3 gap-4">
        {photo.innerPhotos.length > 0 ? (
          photo.innerPhotos.map((innerPhoto) => (
            <img
              key={innerPhoto.id}
              src={innerPhoto.url}
              alt="Inner Photo"
              className={`rounded-lg shadow-md ${photo.isLocked ? "opacity-50 blur-md" : ""}`}
            />
          ))
        ) : (
          <p className="text-gray-500">No inner photos available.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoDetails;
