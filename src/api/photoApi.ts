import axios from 'axios';


export interface Photo {
  id: string;
  imageData: string;
  locked: boolean;
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

  if (!response.ok){
    console.log("error loading photos");
    throw new Error("Failed to fetch public photos");
  } 
  console.log(response)
  return response.json();
};


export const fetchAllUsers = async () => {
  try {
  const response = await fetch("http://localhost:8080/api/photos", {
    method: "GET",
    credentials: "include",
  });
  console.log("data is not called");
  if (!response.ok) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
  console.log("data is about to be called");
  const data = await response.json(); 
  // console.log("Data is " + JSON.stringify(data, null, 2));
  return data;
}
  catch (error) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
};

// Fetch photo details
export const fetchUserCategories = async (photoId: number | undefined) => {
  try {
  const response = await fetch(`http://localhost:8080/api/profile/${photoId}`, {
    method: "GET",
    credentials: "include",
  });
  console.log("data is not called");
  if (!response.ok) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
  console.log("data is about to be called");
  const data = await response.json(); 
  // console.log("Data is " + JSON.stringify(data, null, 2));
  return data;
}
  catch (error) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
};

// Upload a new photo
export const uploadCategory = async(file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("image", file); // 'image' should match your backend's expected field

  try {
    const response = await axios.post("http://localhost:8080/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // you can handle it wherever this method is called
  }
};

// Delete a photo
export const deletePhoto = async (photoId: string) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/photo/${photoId}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Detele successful:", response.data);
  } catch (error) {
    console.error("Failed to delete photo:", error);
    throw new Error("Failed to delete photo");
  }
};

export const fetchUserPhotos = async (category: number | undefined) => {
  try {
  const response = await fetch(`http://localhost:8080/api/photo/${category}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
  const data = await response.json(); 
   console.log("Data is " + JSON.stringify(data, null, 2));
  return data;
}
  catch (error) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
};
