import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { current_user, logout, authToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      toast.error("You must be logged in to view the profile.");
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [authToken, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!current_user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-center">User Not Found</h2>
        <p className="text-center text-gray-600">Please log in again.</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Full Name</label>
          <p className="text-lg">{current_user.full_name || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <p className="text-lg">{current_user.email || "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Professional Status</label>
          <p className="text-lg">
            {current_user.is_professional ? "Professional" : "Non-Professional"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Role</label>
          <p className="text-lg">{current_user.is_admin ? "Admin" : "User"}</p>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
