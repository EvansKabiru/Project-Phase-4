import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaSearch } from "react-icons/fa";
import { UserProvider } from "./context/UserContext";
import { ProfessionalProvider } from "./context/ProfessionalContext";
import { RatingProvider } from "./context/RatingContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Professionals from "./pages/Professionals";
import ProfessionalDetails from "./pages/ProfessionalDetails";
import MyProfessionals from "./pages/MyProfessionals";
import RateProfessionals from "./pages/RateProfessionals";
import Ratings from "./pages/Ratings";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  return (
    <UserProvider>
      <ProfessionalProvider>
        <RatingProvider>
          
            {/* Layout Component - Includes Navbar, Outlet for Pages, and Footer */}
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/professionals" element={<Professionals />} />
                <Route path="/professionals/:id" element={<ProfessionalDetails />} />
                <Route path="/myprofessionals" element={<MyProfessionals />} />
                <Route path="/rateprofessionals" element={<RateProfessionals />} />
                <Route path="/ratings" element={<Ratings />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                
              </Route>
            </Routes>
            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
          
        </RatingProvider>
      </ProfessionalProvider>
    </UserProvider>
  );
}

export default App;
