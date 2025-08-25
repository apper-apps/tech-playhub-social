import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import userService from "@/services/api/userService";

const Header = ({ className = "" }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    loadUserData();
    loadNotifications();
  }, []);
  
  const loadUserData = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };
  
  const loadNotifications = async () => {
    try {
      // Mock notifications for demo
      setNotifications([
        { id: 1, type: "friend", message: "Alex sent you a friend request", time: "2m ago" },
        { id: 2, type: "game", message: "You won Quiz Master challenge!", time: "5m ago" },
        { id: 3, type: "system", message: "Daily login bonus claimed", time: "1h ago" }
      ]);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };
  
  if (!currentUser) {
    return (
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-gray-900/95 backdrop-blur-md border-b border-gray-800",
        className
      )}>
        <div className="h-16 flex items-center justify-center">
          <div className="animate-pulse flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="w-32 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      </header>
    );
  }
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "bg-gray-900/95 backdrop-blur-md border-b border-gray-800",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Gamepad2" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display text-gradient-primary">
                PlayHub
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Social Gaming</p>
            </div>
          </div>
          
          {/* User Info & Stats */}
          <div className="flex items-center space-x-4">
            {/* Currency Display */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-800 rounded-full px-3 py-1">
                <ApperIcon name="Coins" className="w-4 h-4 text-yellow-500 coin-glow" />
                <span className="text-sm font-medium text-yellow-500">
                  {currentUser.coins.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 bg-gray-800 rounded-full px-3 py-1">
                <ApperIcon name="Diamond" className="w-4 h-4 text-pink-500 diamond-glow" />
                <span className="text-sm font-medium text-pink-500">
                  {currentUser.diamonds}
                </span>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 relative"
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                {notifications.length > 0 && (
                  <Badge 
                    variant="danger" 
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="font-medium text-white">Notifications</h3>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-3 hover:bg-gray-700/50 border-b border-gray-700/50 last:border-b-0">
                        <p className="text-sm text-white mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-gray-700">
                    <Button variant="ghost" size="sm" className="w-full text-center">
                      View All Notifications
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">
                  {currentUser.username}
                </p>
                <div className="flex items-center justify-end space-x-1">
                  <ApperIcon name="Star" className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-500 font-medium">
                    Level {currentUser.level}
                  </span>
                </div>
              </div>
              
              <Avatar 
                src={currentUser.avatar}
                size="md"
                online={true}
                alt={currentUser.username}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;