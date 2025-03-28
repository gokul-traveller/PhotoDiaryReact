export interface Photo {
  id: string;
  url: string;
  isLocked: boolean;
  ownerId: string;
  innerPhotos: Photo[];
}

// Fetch a user's profile
export const fetchUserProfile = async (userId: string | undefined) => {
  if (!userId) throw new Error("User ID is required");

  const response = await fetch(`/api/users/${userId}/profile`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch user profile");

  return response.json();
};

// Fetch photo details
export const fetchPhotoDetails = async (photoId: string | undefined) => {
  if (!photoId) throw new Error("Photo ID is required");

  const response = await fetch(`/api/photos/${photoId}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch photo details");

  return response.json();
};

// Upload a new photo
export const uploadPhoto = async ({ userId, file }: { userId: string | undefined; file: File }) => {
  if (!userId) throw new Error("User ID is required");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/users/${userId}/photos`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to upload photo");

  return response.json();
};

// Upload an inner photo inside a locked/unlocked outer photo
export const uploadInnerPhoto = async ({ photoId, file }: { photoId: string | undefined; file: File }) => {
  if (!photoId) throw new Error("Photo ID is required");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/photos/${photoId}/inner`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to upload inner photo");

  return response.json();
};

// Delete a photo
export const deletePhoto = async (photoId: string) => {
  const response = await fetch(`/api/photos/${photoId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to delete photo");

  return response.json();
};

// Lock or unlock a photo
export const toggleLockPhoto = async (photoId: string) => {
  const response = await fetch(`/api/photos/${photoId}/lock`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to toggle photo lock");

  return response.json();
};

// Grant access to a locked photo
export const grantAccess = async ({ photoId, userEmail }: { photoId: string; userEmail: string }) => {
  const response = await fetch(`/api/photos/${photoId}/access`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userEmail }),
  });

  if (!response.ok) throw new Error("Failed to grant access");

  return response.json();
};

// Fetch all public photos for the main page
export const fetchPublicPhotos = async () => {
  const response = await fetch(`/api/photos/public`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch public photos");

  return response.json();
};


export const fetchAllPhotos = async () => {
  const response = await fetch("/api/photos", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }

  return response.json();
};
