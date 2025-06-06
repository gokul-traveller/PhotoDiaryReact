import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import lock from "/src/assets/lock.svg";

interface PhotoCardProps {
  photo: {
    photoId: number;
    url: string;
    isLocked: boolean;
  };
  onClick?: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  console.log("all the photoid from card" + photo.photoId);
  const navigate = useNavigate();
  const location = useLocation();

  const isPhotoDetailsPage = location.pathname.includes("/photo/");

  const handleClick = () => {
    console.log("this is the photoid form photocard"  + photo.photoId + isPhotoDetailsPage)
    if (!isPhotoDetailsPage && !photo.isLocked) {
      console.log("this is the photoid form photocard"  + photo.photoId)
      navigate(`/photo/${photo.photoId}`);
    }
    // Otherwise, PhotoDetails will handle full-screen on click
  };

  return (
    <div
      className="relative shadow-md overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={photo.url}
        alt="User Photo"
        className={`w-full h-52 object-cover ${
          photo.isLocked ? "opacity-50 blur-sm" : ""
        }`}
      />
      {photo.isLocked && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="absolute top-2 right-2 p-1 rounded-full bg-red-500 shadow-lg">
            <img src={lock} alt="Delete" className="w-4 h-4" />
          </div>  
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
