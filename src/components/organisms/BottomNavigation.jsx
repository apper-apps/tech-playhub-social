import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const BottomNavigation = ({ className = "" }) => {
  const location = useLocation();
  const isGameRoom = location.pathname.includes("/game/");
  
  const navItems = [
    {
      path: "/games",
      label: "Games",
      icon: "Gamepad2",
      badge: null
    },
    {
      path: "/friends", 
      label: "Friends",
      icon: "Users",
      badge: 3 // Mock notification count
    },
    {
      path: "/shop",
      label: "Shop",
      icon: "ShoppingBag", 
      badge: null
    },
    {
      path: "/profile",
      label: "Profile", 
      icon: "User",
      badge: null
    }
  ];
  
  if (isGameRoom) {
    return (
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-gray-900/95 backdrop-blur-md border-t border-gray-800",
        className
      )}>
        <div className="flex items-center justify-center h-16 px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium shadow-lg"
            onClick={() => window.history.back()}
          >
            <ApperIcon name="LogOut" className="w-5 h-5" />
            <span>Leave Game</span>
          </motion.button>
        </div>
      </div>
    );
  }
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-40",
      "bg-gray-900/95 backdrop-blur-md border-t border-gray-800",
      className
    )}>
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 relative",
                "hover:bg-gray-800/50",
                isActive
                  ? "text-purple-400 bg-gray-800/70"
                  : "text-gray-400 hover:text-gray-300"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "w-6 h-6 transition-all duration-200",
                      isActive && "scale-110 drop-shadow-lg"
                    )} 
                  />
                  
                  {item.badge && (
                    <Badge 
                      variant="danger" 
                      size="sm"
                      className="absolute -top-2 -right-2 min-w-[16px] h-[16px] text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;