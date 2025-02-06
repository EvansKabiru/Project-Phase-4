import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function Layout() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="min-h-[90vh] bg-gray-200 container mx-auto p-8">
        <Outlet />
        {/* Toast notifications */}
        <ToastContainer />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
