import { useParams } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, uploadPhoto, deletePhoto } from "../api/photoApi";
import PhotoCard from "../components/PhotoCard";

interface Photo {
    id: string; // Change from number to string
    url: string;
    isLocked: boolean;
  }
  
  

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: userId ? ["profile", userId] : ["profile", "unknown"], // Ensures queryKey is always valid
    queryFn: () => fetchUserProfile(userId!), // Safe because of `enabled`
    enabled: !!userId, // Prevents query execution if userId is undefined
  });

  // Upload Photo Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  });

  // Delete Photo Mutation
  const deleteMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  });

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile.</p>;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && userId) {
      const file = event.target.files[0];
      await uploadMutation.mutateAsync({ userId, file });
    }
  };

  const handleDelete = async (photoId: number) => {
    if (userId) {
        await deleteMutation.mutateAsync(photoId.toString());
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{profile?.name}'s Profile</h1>
      {user?.id === userId && (
        <div className="mb-4">
          <input type="file" onChange={handleUpload} />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
      {(profile?.photos ?? []).map((photo: Photo) => (
        <div key={photo.id}>
            <PhotoCard photo={{ ...photo, id: String(photo.id) }} /> 
            {user?.id === userId && (
            <button
                onClick={() => handleDelete(Number(photo.id))} 
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
                Delete
            </button>
            )}
        </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
