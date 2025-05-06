import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

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
    if (!isPhotoDetailsPage) {
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
        className={`w-full h-64 object-cover ${
          photo.isLocked ? "opacity-50 blur-sm" : ""
        }`}
      />
      {photo.isLocked && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="text-white font-bold">🔒 Locked</span>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
