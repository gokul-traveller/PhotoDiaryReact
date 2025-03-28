import { Link } from "react-router-dom";

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    isLocked: boolean;
  };
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div className="relative rounded-lg shadow-md overflow-hidden">
      <Link to={`/photo/${photo.id}`}>
        <img
          src={photo.url}
          alt="User Photo"
          className={`w-full h-48 object-cover ${photo.isLocked ? "opacity-50 blur-sm" : ""}`}
        />
      </Link>

      {photo.isLocked && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="text-white font-bold">🔒 Locked</span>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
