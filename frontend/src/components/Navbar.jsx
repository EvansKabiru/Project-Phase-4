import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { current_user, logout } = useContext(UserContext);

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          PRO-GET APP
        </Link>

        <div className="flex space-x-4">
          {current_user ? (
            <>
              <Link to="/myprofessionals" className="text-white">My Professionals</Link>
              <button
                onClick={logout}
                className="text-white bg-red-500 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white">Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
