import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ChallengeCard = ({ 
  challenge, 
  onClaim,
  className = "" 
}) => {
  const progressPercentage = Math.min((challenge.progress / challenge.requirement) * 100, 100);
  const isCompleted = challenge.progress >= challenge.requirement;
  
  const getChallengeIcon = (type) => {
    const icons = {
      wins: "Trophy",
      games: "GamepadIcon",
      friends: "Users",
      coins: "Coins",
      level: "Star"
    };
    return icons[type] || "Target";
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-gray-800 rounded-lg p-4 border-2",
        isCompleted 
          ? "border-green-500 bg-gradient-to-r from-green-900/20 to-emerald-900/20" 
          : "border-gray-700 hover:border-purple-500/30",
        "transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isCompleted 
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-purple-500 to-pink-500"
          )}>
            <ApperIcon 
              name={getChallengeIcon(challenge.type)} 
              className="w-5 h-5 text-white" 
            />
          </div>
          
          <div>
            <h3 className="font-medium text-white">
              {challenge.title}
            </h3>
            <p className="text-sm text-gray-400">
              {challenge.description}
            </p>
          </div>
        </div>
        
        {isCompleted && (
          <Badge variant="success" className="animate-bounce-in">
            <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">
            {challenge.progress}/{challenge.requirement}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              isCompleted
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Reward & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Gift" className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-yellow-500 font-medium">
            +{challenge.reward.coins} coins
          </span>
          {challenge.reward.experience && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-blue-500 font-medium">
                +{challenge.reward.experience} XP
              </span>
            </>
          )}
        </div>
        
        {isCompleted && (
          <Button 
            variant="accent" 
            size="sm"
            onClick={() => onClaim(challenge)}
            className="animate-glow"
          >
            <ApperIcon name="Gift" className="w-4 h-4 mr-1" />
            Claim
          </Button>
        )}
      </div>
      
      {/* Time Remaining */}
      {challenge.expiresAt && (
        <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-700">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-xs text-gray-400">
            Expires in {challenge.timeRemaining}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ChallengeCard;