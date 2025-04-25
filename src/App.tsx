import Navbar from "./components/navBar/Navbar";
import AppRoutes from "./routes";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="h-12 md:h-12" /> 
      <div className="mx-auto overflow-hidden select-none">
        <AppRoutes />
      </div>
    </>
  );
};

export default App;

