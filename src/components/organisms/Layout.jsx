import React from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";

const Layout = ({ children }) => {
  const location = useLocation();
  const isGameRoom = location.pathname.includes("/game/");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header - Hidden in game rooms */}
      {!isGameRoom && <Header />}
      
      {/* Main Content */}
      <main className={`${!isGameRoom ? "pt-16 pb-20" : "pb-20"} px-4`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;