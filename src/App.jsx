import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import GamesPage from "@/components/pages/GamesPage";
import GameRoom from "@/components/pages/GameRoom";
import FriendsPage from "@/components/pages/FriendsPage";
import ShopPage from "@/components/pages/ShopPage";
import ProfilePage from "@/components/pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Layout>
          <Routes>
            <Route path="/" element={<GamesPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/game/:gameId" element={<GameRoom />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;