import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TopInfoBar from '../components/TopInfoBar';
import Footer from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopInfoBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 