import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const FriendCard = ({ 
  friend, 
  onInvite, 
  onMessage,
  onRemove,
  className = "" 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "bg-gray-800 rounded-lg p-4 border border-gray-700",
        "hover:border-purple-500/30 transition-all duration-200",
        friend.isOnline && "friend-online",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Friend Info */}
        <div className="flex items-center space-x-3">
          <Avatar 
            src={friend.avatar}
            size="lg"
            online={friend.isOnline}
            alt={friend.username}
          />
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-white">
                {friend.username}
              </h3>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Star" className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-medium">
                  {friend.level}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              {friend.isOnline ? (
                <Badge variant="online" size="sm">
                  <ApperIcon name="Circle" className="w-2 h-2 mr-1 fill-current" />
                  {friend.currentGame ? `Playing ${friend.currentGame}` : "Online"}
                </Badge>
              ) : (
                <span className="text-sm text-gray-400">
                  Last seen {friend.lastSeen}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {friend.isOnline && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onInvite(friend)}
              className="px-3"
            >
              <ApperIcon name="GamepadIcon" className="w-4 h-4 mr-1" />
              Invite
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMessage(friend)}
            className="p-2"
          >
            <ApperIcon name="MessageCircle" className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRemove(friend)}
            className="p-2 text-gray-400 hover:text-red-400"
          >
            <ApperIcon name="UserMinus" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Friend Stats */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <ApperIcon name="Trophy" className="w-4 h-4 mr-1 text-yellow-500" />
            <span>{friend.wins} wins</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Target" className="w-4 h-4 mr-1 text-blue-500" />
            <span>{friend.gamesPlayed} games</span>
          </div>
        </div>
        
        {friend.isOnline && friend.currentGame && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onInvite(friend)}
            className="text-xs px-2 py-1"
          >
            <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
            Watch
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default FriendCard;