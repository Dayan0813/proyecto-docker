import { useLocation } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import "./styles/main.css";

export default function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}
      <main>
        <AppRouter />
      </main>
      <ToastContainer />
    </div>
  );
}
