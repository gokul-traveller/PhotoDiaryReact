import axios from 'axios';
import { useAuthStore } from "../context/authStore";


export interface Photo {
  photoId: string;
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
    // Get userId from Zustand store or localStorage
    const authStore = useAuthStore.getState(); // Zustand store access outside components
    const userId = authStore.user?.userId || null;
    console.log(userId);
    console.log(userId
      ? `http://localhost:8080/api/photos?userId=${userId}`
      : `http://localhost:8080/api/photos`);

    // Construct the URL based on whether user is logged in
    const url = userId
      ? `http://localhost:8080/api/photos?userId=${userId}`
      : `http://localhost:8080/api/photos`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.log("error loading photos");
      throw new Error("Failed to fetch photos");
    }

    const data = await response.json();
    console.log("Fetched user data:", data);
    return data;
  } catch (error) {
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
  console.log("Data is " + JSON.stringify(data, null, 2));
  return data;
}
  catch (error) {
    console.log("error loading photos");
    throw new Error("Failed to fetch photos");
  }
};

// Upload a new photo
export const uploadCategory = async(file: File ,userId : string): Promise<void> => {
  const formData = new FormData();
  formData.append("image", file ); // 'image' should match your backend's expected field
  formData.append("userId", userId);

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
export const deletePhoto = async (publicId: string) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/photo/${publicId}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Detele successful:", response.data);
  } catch (error) {
    console.error("Failed to delete photo:", error);
    throw new Error("Failed to delete photo");
  }
};

export const fetchUserPhotos = async (category: string | undefined) => {
  try {
  const response = await fetch(`http://localhost:8080/api/photo/${category}`, {
    method: "GET",
    credentials: "include",
  });
  console.log("category is "+category);
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

// Upload an inner photo inside a locked/unlocked outer photo
export const uploadInnerPhoto = async(photoId: string,file: File): Promise<void> => {
  console.log("in uploadInnerPhoto api call");
  const formData = new FormData();
  formData.append("image", file); // 'image' should match your backend's expected field

  try {
    const response = await axios.post(
      `http://localhost:8080/api/${photoId}/uploadInnerPhoto`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // ✅ include cookies/session
      }
    );
    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // you can handle it wherever this method is called
  }
};

// Delete a photo
export const deleteInnerPhoto = async (publicId: string) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/InnerPhoto/${publicId}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Detele successful:", response.data);
  } catch (error) {
    console.error("Failed to delete photo:", error);
    throw new Error("Failed to delete photo");
  }
};

// Update Category Text
export const updateCategoryTitle = async (categoryId: number ,title : string) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/photo/${categoryId}/${title}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Update successful:", response.data);
  } catch (error) {
    console.error("Failed to Update Category:", error);
    throw new Error("Failed to Update Category");
  }
};

// Update Category Lock
export const updateCategoryLock = async (categoryId: number ,lock : boolean) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/photo/lock/${categoryId}/${lock}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Update successful:", response.data);
  } catch (error) {
    console.error("Failed to Update Category:", error);
    throw new Error("Failed to Update Category");
  }
};


export const updatePhotoLock = async (PhotoId: number ,lock : boolean) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/Innerphoto/lock/${PhotoId}/${lock}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Update successful:", response.data);
  } catch (error) {
    console.error("Failed to Update Category:", error);
    throw new Error("Failed to Update Category");
  }
};

export const updateUserLock = async (userId: number ,lock : boolean) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/user/lock/${userId}/${lock}`, {
      withCredentials: true, // same as `credentials: "include"` in fetch
    });
    console.log("Update successful:", response.data);
  } catch (error) {
    console.error("Failed to Update Category:", error);
    throw new Error("Failed to Update Category");
  }
};

// Fetch a user's profile
export const fetchUserById = async (userId: number) => {
  console.log("user fetch method called")
  if (!userId) throw new Error("User ID is required");

  const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch user profile");

  return response.json();
};

// Fetch a user's profile
export const fetchCategoryById = async (categoryId: number) => {
  console.log("user fetch method called")
  if (!categoryId) throw new Error("User ID is required");

  const response = await fetch(`http://localhost:8080/api/category/${categoryId}`, {
    credentials: "include",
  });
  console.log(response.json);
  if (!response.ok) throw new Error("Failed to fetch user profile");

  return response.json();
};

// Fetch a user's profile
export const fetchCategoryUser = async (categoryId: number) => {
  console.log("user fetch method called")
  if (!categoryId) throw new Error("User ID is required");

  const response = await fetch(`http://localhost:8080/api/photo/${categoryId}/user`, {
    credentials: "include",
  });
  console.log(response.json);
  if (!response.ok) throw new Error("Failed to fetch user profile");

  return response.json();
};