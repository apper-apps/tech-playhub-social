import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import GameCard from "@/components/molecules/GameCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import gameService from "@/services/api/gameService";
import { toast } from "react-toastify";

const GameLobby = ({ 
  selectedCategory = "all",
  onJoinGame,
  onCreateGame,
  className = "" 
}) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
const categories = [
    { id: "all", name: "All Games", icon: "Grid3x3" },
    { id: "quiz", name: "Quiz", icon: "Brain" },
    { id: "cards", name: "Cards", icon: "Spade" },
    { id: "dice", name: "Dice", icon: "Dice1" },
    { id: "party", name: "Party", icon: "PartyPopper" }
  ];
  
  useEffect(() => {
    loadGames();
  }, [selectedCategory]);
  
  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const gamesData = await gameService.getActiveGames();
      const filteredGames = selectedCategory === "all" 
        ? gamesData 
        : gamesData.filter(game => game.type === selectedCategory);
      
      setGames(filteredGames);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoinGame = async (game) => {
    try {
      await gameService.joinGame(game.id);
      toast.success(`Joined ${game.name}!`);
      onJoinGame(game);
    } catch (err) {
      toast.error("Failed to join game. Please try again.");
    }
  };
  
  const handleQuickPlay = async (gameType) => {
    try {
      const game = await gameService.findOrCreateGame(gameType);
      toast.success("Finding players...");
      onJoinGame(game);
    } catch (err) {
      toast.error("Failed to start quick play. Please try again.");
    }
  };
  
  const handleCreateGame = (gameType) => {
    onCreateGame(gameType);
  };
  
  if (loading) {
    return <Loading className={className} />;
  }
  
  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadGames}
        className={className}
      />
    );
  }
  
  if (games.length === 0) {
    return (
      <Empty
        title="No active games"
        description="Be the first to start a game and invite your friends to play!"
        icon="Gamepad2"
action={() => handleCreateGame(selectedCategory === "all" ? "party" : selectedCategory)}
        actionText="Create Game"
        className={className}
      />
    );
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="primary"
onClick={() => handleQuickPlay("party")}
          className="flex-1 sm:flex-none"
        >
          <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
          Quick Play
        </Button>
        
        <Button 
          variant="accent"
onClick={() => handleCreateGame(selectedCategory === "all" ? "party" : selectedCategory)}
          className="flex-1 sm:flex-none"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Game
        </Button>
      </div>
      
      {/* Games Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
{games.map((game, index) => (
          <motion.div
            key={game.id || `game-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GameCard
              game={game}
              onJoin={handleJoinGame}
              onQuickPlay={handleQuickPlay}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Load More Button */}
      {games.length >= 6 && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline"
            onClick={loadGames}
          >
            <ApperIcon name="RotateCw" className="w-4 h-4 mr-2" />
            Refresh Games
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameLobby;