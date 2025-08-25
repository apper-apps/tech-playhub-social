import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const GameCard = ({ 
  game, 
  onJoin, 
  onQuickPlay,
  className = "" 
}) => {
  const getGameIcon = (type) => {
    const icons = {
      quiz: "Brain",
      cards: "Spade",
      dice: "Dice1",
      party: "PartyPopper"
    };
    return icons[type] || "Gamepad2";
  };
  
  const getGameColor = (type) => {
    const colors = {
      quiz: "from-blue-500 to-cyan-500",
      cards: "from-red-500 to-pink-500", 
      dice: "from-green-500 to-emerald-500",
      party: "from-purple-500 to-indigo-500"
    };
    return colors[type] || "from-purple-500 to-pink-500";
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "bg-gray-800 rounded-xl overflow-hidden shadow-lg",
        "border border-gray-700 hover:border-purple-500/50",
        "game-card-glow transition-all duration-300",
        className
      )}
    >
      {/* Game Header */}
      <div className={cn(
        "h-32 bg-gradient-to-br relative overflow-hidden",
        getGameColor(game.type)
      )}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon 
            name={getGameIcon(game.type)} 
            className="w-16 h-16 text-white/90 drop-shadow-lg" 
          />
        </div>
        
        {/* Player Count Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-black/40 text-white backdrop-blur-sm">
            <ApperIcon name="Users" className="w-3 h-3 mr-1" />
            {game.currentPlayers}/{game.maxPlayers}
          </Badge>
        </div>
        
        {/* Game Status */}
        {game.status === "waiting" && (
          <div className="absolute top-3 left-3">
            <Badge variant="success">
              <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
              Waiting
            </Badge>
          </div>
        )}
        
        {game.status === "playing" && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning">
              <ApperIcon name="Play" className="w-3 h-3 mr-1" />
              Playing
            </Badge>
          </div>
        )}
      </div>
      
      {/* Game Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-display text-white mb-1">
            {game.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">
            {game.description}
          </p>
        </div>
        
        {/* Game Info */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Trophy" className="w-4 h-4 mr-1 text-yellow-500" />
              <span>{game.minLevel}+ Level</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              <span>{game.duration}min</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {game.status === "waiting" ? (
            <>
              <Button 
                variant="primary" 
                size="sm" 
                className="flex-1"
                onClick={() => onJoin(game)}
              >
                <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                Join Game
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onQuickPlay(game.type)}
              >
                <ApperIcon name="Zap" className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1"
              onClick={() => onQuickPlay(game.type)}
            >
              <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
              Quick Play
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;