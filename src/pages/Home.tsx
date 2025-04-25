import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../api/photoApi";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  userName: string;
  imageData: string;
  locked: boolean;
}

const Home = () => {
  const navigate = useNavigate();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) return <p className="text-center text-gray-600">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">Error loading users.</p>;
  
  return (
    <div className="mx-auto px-4 md:px-10 py-4">
      <SearchBar />
      <div className="grid gap-6 justify-center"
     style={{
       gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
     }}
>
        {users?.map((user: User) => {
          console.log(`User: ${user.userName}, isLocked: ${user.locked}`); // Log inside map()
          return (
          <div 
            key={user.id} 
            className={`flex flex-col items-center text-center cursor-pointer ${
              user.locked ? "opacity-70 cursor-not-allowed" : "hover:scale-105 transition-transform"
            }`}
            onClick={() => {
              if (!user.locked) {
                navigate(`/profile/${user.id}`);
              }
            }}
          >
            <img 
              src={`${user.imageData}`}  
              alt="User" 
              className="w-48 h-48 rounded-full object-cover border-4 border-stone-300 shadow-md"
            />
            <p className="mt-2 text-lg font-medium">{user.userName}{user.locked ? "(Locked😁😁)" : "(Unlocked)"}</p>
          </div>
        )})}
      </div>
    </div>
  );
};

export default Home;
