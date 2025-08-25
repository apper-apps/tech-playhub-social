import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import shopService from "@/services/api/shopService";
import userService from "@/services/api/userService";
import { toast } from "react-toastify";

const ShopPage = () => {
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchasingItem, setPurchasingItem] = useState(null);
  
  const categories = [
    { id: "all", name: "All Items", icon: "Grid3x3" },
    { id: "avatars", name: "Avatars", icon: "User" },
    { id: "themes", name: "Themes", icon: "Palette" },
    { id: "emojis", name: "Emojis", icon: "Smile" },
    { id: "coins", name: "Coin Packs", icon: "Coins" }
  ];
  
  useEffect(() => {
    loadShopItems();
    loadCurrentUser();
  }, [selectedCategory]);
  
  const loadShopItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const shopData = await shopService.getShopItems();
      const filteredItems = selectedCategory === "all" 
        ? shopData 
        : shopData.filter(item => item.category === selectedCategory);
      
      setItems(filteredItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadCurrentUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };
  
  const handlePurchase = async (item) => {
    if (!currentUser) return;
    
    // Check if user has enough currency
    const hasEnoughCoins = currentUser.coins >= item.coinPrice;
    const hasEnoughDiamonds = item.diamondPrice ? currentUser.diamonds >= item.diamondPrice : true;
    
    if (!hasEnoughCoins && !hasEnoughDiamonds) {
      toast.error("Insufficient funds to purchase this item!");
      return;
    }
    
    try {
      setPurchasingItem(item.id);
      
      await shopService.purchaseItem(item.id);
      
      // Update user currency
      if (item.coinPrice) {
        setCurrentUser(prev => ({ 
          ...prev, 
          coins: prev.coins - item.coinPrice 
        }));
      }
      
      if (item.diamondPrice) {
        setCurrentUser(prev => ({ 
          ...prev, 
          diamonds: prev.diamonds - item.diamondPrice 
        }));
      }
      
      toast.success(`${item.name} purchased successfully! 🎉`);
      
      // Mark item as purchased
      setItems(prev => 
        prev.map(i => i.id === item.id ? { ...i, isPurchased: true } : i)
      );
      
    } catch (err) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setPurchasingItem(null);
    }
  };
  
  const getItemIcon = (category) => {
    const icons = {
      avatars: "User",
      themes: "Palette", 
      emojis: "Smile",
      coins: "Coins",
      diamonds: "Diamond"
    };
    return icons[category] || "Package";
  };
  
  const getRarityColor = (rarity) => {
    const colors = {
      common: "from-gray-500 to-gray-600",
      rare: "from-blue-500 to-blue-600",
      epic: "from-purple-500 to-purple-600",
      legendary: "from-yellow-500 to-orange-500"
    };
    return colors[rarity] || colors.common;
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadShopItems}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <motion.h1 
          className="text-4xl md:text-5xl font-display text-gradient-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Shop
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Customize your profile with avatars, themes, emojis and more!
        </motion.p>
      </div>
      
      {/* User Currency Display */}
      {currentUser && (
        <motion.div 
          className="flex justify-center space-x-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
            <ApperIcon name="Coins" className="w-5 h-5 text-yellow-500 coin-glow" />
            <span className="text-lg font-bold text-yellow-500">
              {currentUser.coins.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400">coins</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
            <ApperIcon name="Diamond" className="w-5 h-5 text-pink-500 diamond-glow" />
            <span className="text-lg font-bold text-pink-500">
              {currentUser.diamonds}
            </span>
            <span className="text-sm text-gray-400">diamonds</span>
          </div>
        </motion.div>
      )}
      
      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "primary" : "ghost"}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "transition-all duration-200",
              selectedCategory === category.id && "scale-105 shadow-lg"
            )}
          >
            <ApperIcon name={category.icon} className="w-4 h-4 mr-2" />
            {category.name}
          </Button>
        ))}
      </motion.div>
      
      {/* Featured Item */}
      <motion.div
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display text-white">Daily Deal</h2>
              <p className="text-sm text-gray-400">50% off for today only!</p>
            </div>
          </div>
          
          <Badge variant="accent" className="animate-pulse">
            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
            12h 34m left
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-display text-white">Royal Crown Avatar</h3>
              <p className="text-sm text-gray-400">Show your royal status</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-yellow-500 line-through">1000</span>
                <span className="text-xl font-bold text-yellow-500">500 coins</span>
              </div>
            </div>
          </div>
          
          <Button variant="accent" size="lg">
            <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
            Buy Now
          </Button>
        </div>
      </motion.div>
      
      {/* Shop Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {items.length === 0 ? (
          <Empty
            title="No items available"
            description="Check back later for new items and deals!"
            icon="ShoppingBag"
            action={() => setSelectedCategory("all")}
            actionText="View All Items"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{items.map((item, index) => (
              <motion.div
                key={item.id || `item-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-gray-800 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02]",
                  item.rarity === "legendary" && "border-yellow-500/30 hover:border-yellow-500/50",
                  item.rarity === "epic" && "border-purple-500/30 hover:border-purple-500/50",
                  item.rarity === "rare" && "border-blue-500/30 hover:border-blue-500/50",
                  item.rarity === "common" && "border-gray-600 hover:border-gray-500"
                )}
              >
                {/* Item Header */}
                <div className={cn(
                  "h-32 bg-gradient-to-br relative overflow-hidden",
                  getRarityColor(item.rarity)
                )}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ApperIcon 
                      name={getItemIcon(item.category)} 
                      className="w-16 h-16 text-white/90 drop-shadow-lg" 
                    />
                  </div>
                  
                  {/* Rarity Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="default" 
                      className="bg-black/40 text-white backdrop-blur-sm capitalize"
                    >
                      {item.rarity}
                    </Badge>
                  </div>
                  
                  {/* New Badge */}
                  {item.isNew && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="accent" className="animate-pulse">
                        New!
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Item Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-display text-white mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {item.coinPrice && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Coins" className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-yellow-500">
                            {item.coinPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {item.diamondPrice && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Diamond" className="w-4 h-4 text-pink-500" />
                          <span className="text-sm font-medium text-pink-500">
                            {item.diamondPrice}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Purchase Button */}
                  <div className="pt-2">
                    {item.isPurchased ? (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                        Owned
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handlePurchase(item)}
                        disabled={purchasingItem === item.id}
                      >
                        {purchasingItem === item.id ? (
                          <>
                            <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                            Purchasing...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                            Buy
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShopPage;