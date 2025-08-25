import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ChallengeCard from "@/components/molecules/ChallengeCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import userService from "@/services/api/userService";
import challengeService from "@/services/api/challengeService";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stats"); // stats, challenges, achievements
  
  const tabs = [
    { id: "stats", name: "Stats", icon: "BarChart3" },
    { id: "challenges", name: "Challenges", icon: "Target" },
    { id: "achievements", name: "Achievements", icon: "Trophy" }
  ];
  
  useEffect(() => {
    loadUserData();
    loadChallenges();
    loadAchievements();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await userService.getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadChallenges = async () => {
    try {
      const challengesData = await challengeService.getDailyChallenges();
      setChallenges(challengesData);
    } catch (err) {
      console.error("Failed to load challenges:", err);
    }
  };
  
  const loadAchievements = async () => {
    try {
      const achievementsData = await userService.getUserAchievements();
      setAchievements(achievementsData);
    } catch (err) {
      console.error("Failed to load achievements:", err);
    }
  };
  
  const handleClaimChallenge = async (challenge) => {
    try {
      await challengeService.claimChallenge(challenge.id);
      
      // Update user coins
      setCurrentUser(prev => ({ 
        ...prev, 
        coins: prev.coins + challenge.reward.coins,
        experience: prev.experience + (challenge.reward.experience || 0)
      }));
      
      // Remove completed challenge
      setChallenges(prev => prev.filter(c => c.id !== challenge.id));
      
      toast.success(`Claimed ${challenge.reward.coins} coins! 🎉`);
      
      if (challenge.reward.experience) {
        toast.info(`+${challenge.reward.experience} XP earned!`);
      }
      
    } catch (err) {
      toast.error("Failed to claim reward. Please try again.");
    }
  };
  
  const getExperienceProgress = () => {
    if (!currentUser) return 0;
    
    const currentLevelXp = currentUser.level * 1000;
    const nextLevelXp = (currentUser.level + 1) * 1000;
    const progress = ((currentUser.experience - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    
    return Math.max(0, Math.min(100, progress));
  };
  
  const getWinRate = () => {
    if (!currentUser || currentUser.stats.gamesPlayed === 0) return 0;
    return ((currentUser.stats.wins / currentUser.stats.gamesPlayed) * 100).toFixed(1);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error || !currentUser) {
    return (
      <Error 
        message={error || "Failed to load profile"}
        onRetry={loadUserData}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div 
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar 
              src={currentUser.avatar}
              size="2xl"
              online={true}
              alt={currentUser.username}
              className="ring-4 ring-purple-500/30"
            />
            <button className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors">
              <ApperIcon name="Camera" className="w-4 h-4" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-3">
              <h1 className="text-3xl font-display text-white">
                {currentUser.username}
              </h1>
              
              <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 md:mt-0">
                <Badge variant="primary" size="lg">
                  <ApperIcon name="Star" className="w-4 h-4 mr-1" />
                  Level {currentUser.level}
                </Badge>
                
                <Badge variant="accent">
                  <ApperIcon name="Trophy" className="w-4 h-4 mr-1" />
                  #{currentUser.rank || "1,234"}
                </Badge>
              </div>
            </div>
            
            {/* Experience Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Experience</span>
                <span className="text-white font-medium">
                  {currentUser.experience} XP
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getExperienceProgress()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {/* Currency */}
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
                <ApperIcon name="Coins" className="w-4 h-4 text-yellow-500 coin-glow" />
                <span className="font-medium text-yellow-500">
                  {currentUser.coins.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-3 py-1">
                <ApperIcon name="Diamond" className="w-4 h-4 text-pink-500 diamond-glow" />
                <span className="font-medium text-pink-500">
                  {currentUser.diamonds}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            
            <Button variant="primary" size="sm">
              <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Tab Navigation */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "transition-all duration-200",
              activeTab === tab.id && "scale-105 shadow-lg"
            )}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
            {tab.name}
          </Button>
        ))}
      </motion.div>
      
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Games Played */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Gamepad2" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {currentUser.stats.gamesPlayed}
                  </p>
                  <p className="text-sm text-gray-400">Games Played</p>
                </div>
              </div>
            </div>
            
            {/* Wins */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Trophy" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {currentUser.stats.wins}
                  </p>
                  <p className="text-sm text-gray-400">Total Wins</p>
                </div>
              </div>
            </div>
            
            {/* Win Rate */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {getWinRate()}%
                  </p>
                  <p className="text-sm text-gray-400">Win Rate</p>
                </div>
              </div>
            </div>
            
            {/* Best Streak */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {currentUser.stats.bestStreak || 0}
                  </p>
                  <p className="text-sm text-gray-400">Best Streak</p>
                </div>
              </div>
            </div>
            
            {/* Favorite Game */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 md:col-span-2">
              <h3 className="text-lg font-display text-white mb-4">Favorite Game</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Brain" className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">Quiz Master</p>
                  <p className="text-sm text-gray-400">
                    {currentUser.stats.favoriteGamePlays || 42} games played
                  </p>
                  <p className="text-sm text-green-500">
                    {currentUser.stats.favoriteGameWinRate || 73}% win rate
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 md:col-span-2">
              <h3 className="text-lg font-display text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Trophy" className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-white">Won Quiz Master</span>
                  </div>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="UserPlus" className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-white">Added new friend</span>
                  </div>
                  <span className="text-xs text-gray-400">5h ago</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="ShoppingCart" className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-white">Bought new avatar</span>
                  </div>
                  <span className="text-xs text-gray-400">1d ago</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div>
            {challenges.length === 0 ? (
              <Empty
                title="No active challenges"
                description="New challenges will appear here daily. Check back tomorrow!"
                icon="Target"
                action={() => window.location.reload()}
                actionText="Refresh"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={challenge}
                      onClaim={handleClaimChallenge}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            {achievements.length === 0 ? (
              <Empty
                title="No achievements yet"
                description="Start playing games to unlock achievements and earn rewards!"
                icon="Trophy"
                action={() => window.history.back()}
                actionText="Play Games"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "bg-gray-800 rounded-xl p-6 border-2 transition-all duration-300",
                      achievement.isUnlocked
                        ? "border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20"
                        : "border-gray-700 opacity-75"
                    )}
                  >
                    <div className="text-center space-y-3">
                      <div className={cn(
                        "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
                        achievement.isUnlocked
                          ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                          : "bg-gray-700"
                      )}>
                        <ApperIcon 
                          name={achievement.icon || "Trophy"} 
                          className="w-8 h-8 text-white" 
                        />
                      </div>
                      
                      <div>
                        <h3 className={cn(
                          "font-display text-lg mb-1",
                          achievement.isUnlocked ? "text-yellow-400" : "text-gray-400"
                        )}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      
                      {achievement.isUnlocked ? (
                        <Badge variant="accent">
                          <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      ) : (
                        <div className="text-xs text-gray-500">
                          {achievement.progress}/{achievement.requirement}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;