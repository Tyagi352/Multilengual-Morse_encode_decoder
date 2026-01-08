import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../Navbar';

// Provide token and setToken to nested routes via Outlet context
const DashboardPage = ({ token, setToken }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar setToken={setToken} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <Outlet context={{ token, setToken }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
