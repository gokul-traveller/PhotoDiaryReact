import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers, updateUserLock } from "../api/photoApi";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import lock from "/src/assets/lock.svg";
import lockProfile from "/src/assets/lockProfile.svg";
import unlock from "/src/assets/unlock.svg";
import LoadingPopup from "./LoadingPopup";

interface User {
  userId: number;
  userName: string;
  imageData: string;
  email: string;
  locked: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const logedUser = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!logedUser) navigate("/login");
  }, [logedUser, navigate]);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const handleLockToggle = async (userId: number, lock: boolean) => {
    setLoading(true);
    try {
      await Promise.all([
        updateUserLock(userId, lock),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
      refetch();
    } catch (err) {
      console.error("Failed to toggle lock", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users?.filter((user: User) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-center text-gray-600">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">Error loading users.</p>;

  return (
    <div className="mx-auto px-4 md:px-10 py-4">
      {loading && <LoadingPopup />}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div
        className="grid gap-6 justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {filteredUsers?.map((user: User) => (
          <div
            key={user.userId}
            className={`flex flex-col items-center text-center cursor-pointer ${
              user.locked
                ? "cursor-not-allowed"
                : "hover:scale-105 transition-transform"
            }`}
            onClick={() => !user.locked && navigate(`/profile/${user.userId}`)}
          >
            <div className="relative w-48 h-48">
              <img
                src={user.imageData}
                alt="User"
                className={`w-full h-full rounded-full object-cover border-4 shadow-md transition-all duration-300 ${
                  user.locked
                    ? "border-red-700 filter grayscale blur-[1px] brightness-75"
                    : "border-stone-300"
                }`}
              />
              {user.locked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40">
                  <img src={lockProfile} alt="Locked" className="w-10 h-10 opacity-90" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center mt-2 space-x-2">
              <p className="text-lg font-medium">{user.userName}</p>
              {user.userId === logedUser?.userId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLockToggle(user.userId, !user.locked);
                  }}
                  className={`p-1 rounded-full shadow-lg ${
                    user.locked
                      ? "bg-white hover:bg-green-600"
                      : "bg-white hover:bg-red-600"
                  }`}
                  title={user.locked ? "Unlock" : "Lock"}
                >
                  <img
                    src={user.locked ? unlock : lock}
                    alt={user.locked ? "Unlock" : "Lock"}
                    className="w-4 h-4"
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
