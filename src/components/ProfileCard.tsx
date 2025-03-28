import { Link } from "react-router-dom";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    profilePic: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <Link to={`/profile/${user.id}`} className="flex items-center p-4 bg-white shadow-md rounded-lg">
      <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
      <span className="text-lg font-semibold">{user.name}</span>
    </Link>
  );
};

export default ProfileCard;
