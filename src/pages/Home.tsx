import { useQuery } from "@tanstack/react-query";
import { fetchAllPhotos } from "../api/photoApi";

interface Photo {
  id: string;
  url: string;
  isLocked: boolean;
}

const Home = () => {
  const { data: photos, isLoading, error } = useQuery({
    queryKey: ["photos"],
    queryFn: fetchAllPhotos,
  });

  // if (isLoading) return <p>Loading photos...</p>;
  // if (error) return <p>Error loading photos.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Photossssssssssssssss</h1>
      <div className="grid grid-cols-3 gap-4">
      {photos?.map((photo: Photo) => (
        <div key={photo.id}>
          <img src={photo.url} alt="Photo" />
        </div>
      ))}
      </div>
    </div>
  );
};

export default Home;
