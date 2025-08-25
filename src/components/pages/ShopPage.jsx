import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import userService from "@/services/api/userService";
import shopService from "@/services/api/shopService";

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
    { id: "coins", name: "Premium Packs", icon: "Coins" }
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
const hasEnoughCoins = item.coinPrice ? (currentUser.coins_c || currentUser.coins) >= item.coinPrice : true;
    const hasEnoughDiamonds = item.diamondPrice ? (currentUser.diamonds_c || currentUser.diamonds) >= item.diamondPrice : true;
    const canAffordRealMoney = item.realMoneyPrice ? true : true; // Real money purchases handled externally
    
    if (!hasEnoughCoins && !hasEnoughDiamonds) {
      toast.error("Insufficient funds to purchase this item!");
      return;
    }
    
    try {
      setPurchasingItem(item.id);
      
      await shopService.purchaseItem(item.id);
      
      // Update user currency
// Handle real money purchases
      if (item.isRealMoney && item.realMoneyPrice) {
        toast.success(`Redirecting to payment gateway for $${item.realMoneyPrice}`);
        // In real implementation, integrate with payment processor
        return;
      }
      
      // Handle virtual currency purchases
      if (item.coinPrice) {
        setCurrentUser(prev => ({ 
          ...prev, 
          coins: (prev.coins_c || prev.coins) - item.coinPrice,
          coins_c: (prev.coins_c || prev.coins) - item.coinPrice
        }));
      }
      
      if (item.diamondPrice) {
        setCurrentUser(prev => ({ 
          ...prev, 
          diamonds: (prev.diamonds_c || prev.diamonds) - item.diamondPrice,
          diamonds_c: (prev.diamonds_c || prev.diamonds) - item.diamondPrice
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
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 rounded-full px-4 py-2 border border-yellow-500/30">
            <ApperIcon name="Coins" className="w-5 h-5 text-yellow-500 coin-glow" />
            <span className="text-lg font-bold text-yellow-500">
              {(currentUser.coins_c || currentUser.coins || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-900/20 to-pink-800/20 rounded-full px-4 py-2 border border-pink-500/30">
            <ApperIcon name="Diamond" className="w-4 h-4 text-pink-500 diamond-glow" />
            <span className="text-lg font-bold text-pink-500">
              {(currentUser.diamonds_c || currentUser.diamonds || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-full px-4 py-2 border border-green-500/30">
            <ApperIcon name="CreditCard" className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Premium</span>
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
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-bl-lg">
          <span className="text-xs font-bold">PREMIUM</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center animate-pulse-glow">
              <ApperIcon name="Star" className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display text-white">Legendary Bundle</h2>
              <p className="text-sm text-gray-400">Exclusive premium collection!</p>
            </div>
          </div>
          
          <Badge variant="accent" className="animate-pulse">
            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
            8h 42m left
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center animate-glow">
              <ApperIcon name="Crown" className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-display text-white">Dragon Emperor Pack</h3>
              <p className="text-sm text-gray-400">Avatar + Theme + 5000 Coins + 50 Diamonds</p>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center space-x-1">
                  <span className="text-green-400 line-through text-sm">$9.99</span>
                  <span className="text-xl font-bold text-green-400">$4.99</span>
                </div>
                <Badge variant="success" className="text-xs">50% OFF</Badge>
              </div>
            </div>
          </div>
          
          <Button variant="accent" size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
            <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
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