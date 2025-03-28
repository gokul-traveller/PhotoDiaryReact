import Navbar from "./components/navBar/Navbar";
import AppRoutes from "./routes";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <AppRoutes />
      </div>
    </>
  );
};

export default App;

