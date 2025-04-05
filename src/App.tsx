import Navbar from "./components/navBar/Navbar";
import AppRoutes from "./routes";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto pt-12 overflow-hidden select-none">
        <AppRoutes />
      </div>
    </>
  );
};

export default App;

