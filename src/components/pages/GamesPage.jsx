import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GameLobby from "@/components/organisms/GameLobby";

const GamesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
const categories = [
    { id: "all", name: "All Games", icon: "Grid3x3", count: 24 },
    { id: "quiz", name: "Quiz", icon: "Brain", count: 8 },
    { id: "cards", name: "Cards", icon: "Spade", count: 6 },
    { id: "dice", name: "Dice", icon: "Dice1", count: 5 },
    { id: "party", name: "Party", icon: "PartyPopper", count: 5 }
  ];
  
  const handleJoinGame = (game) => {
    navigate(`/game/${game.id}`);
  };
  
  const handleCreateGame = (gameType) => {
    // In a real app, this would create a new game and redirect
    const mockGameId = `${gameType}_${Date.now()}`;
    navigate(`/game/${mockGameId}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <motion.h1 
          className="text-4xl md:text-5xl font-display text-gradient-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Game Hub
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Challenge friends, compete in tournaments, and climb the leaderboards in our collection of multiplayer games.
        </motion.p>
      </div>
      
      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "primary" : "ghost"}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "relative transition-all duration-200",
              selectedCategory === category.id && "scale-105 shadow-lg"
            )}
          >
            <ApperIcon name={category.icon} className="w-4 h-4 mr-2" />
            {category.name}
            <Badge 
              variant={selectedCategory === category.id ? "default" : "secondary"} 
              size="sm"
              className="ml-2"
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </motion.div>
      
      {/* Featured Games Section */}
      <motion.div
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display text-white">Daily Tournament</h2>
              <p className="text-sm text-gray-400">Compete for amazing rewards!</p>
            </div>
          </div>
          
          <Badge variant="accent" className="animate-pulse">
            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
            2h 15m left
          </Badge>
        </div>
        
<div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient-accent">2,500</p>
              <p className="text-xs text-gray-400">Prize Pool</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">246</p>
              <p className="text-xs text-gray-400">Players</p>
            </div>
          </div>
          
          <Button variant="accent" size="lg">
            <ApperIcon name="Trophy" className="w-5 h-5 mr-2" />
            Join Tournament
          </Button>
        </div>
      </motion.div>
      
      {/* Games Lobby */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GameLobby
          selectedCategory={selectedCategory}
          onJoinGame={handleJoinGame}
          onCreateGame={handleCreateGame}
        />
      </motion.div>
    </div>
  );
};

export default GamesPage;