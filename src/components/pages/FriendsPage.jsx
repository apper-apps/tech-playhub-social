import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import FriendCard from "@/components/molecules/FriendCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import friendService from "@/services/api/friendService";
import { toast } from "react-toastify";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends"); // friends, requests, search
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const tabs = [
    { id: "friends", name: "Friends", icon: "Users", count: 0 },
    { id: "requests", name: "Requests", icon: "UserPlus", count: 0 },
    { id: "search", name: "Find Friends", icon: "Search", count: null }
  ];
  
  useEffect(() => {
    loadFriends();
    loadFriendRequests();
  }, []);
  
  useEffect(() => {
    // Update tab counts
    tabs[0].count = friends.length;
    tabs[1].count = friendRequests.length;
  }, [friends, friendRequests]);
  
  const loadFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const friendsData = await friendService.getFriends();
      setFriends(friendsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadFriendRequests = async () => {
    try {
      const requestsData = await friendService.getFriendRequests();
      setFriendRequests(requestsData);
    } catch (err) {
      console.error("Failed to load friend requests:", err);
    }
  };
  
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearching(true);
      const results = await friendService.searchUsers(query);
      setSearchResults(results);
    } catch (err) {
      toast.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };
  
  const handleInviteToGame = (friend) => {
    toast.success(`Game invitation sent to ${friend.username}!`);
  };
  
  const handleSendMessage = (friend) => {
    toast.info(`Opening chat with ${friend.username}...`);
  };
  
  const handleRemoveFriend = async (friend) => {
    try {
      await friendService.removeFriend(friend.id);
      setFriends(prev => prev.filter(f => f.id !== friend.id));
      toast.success(`Removed ${friend.username} from friends`);
    } catch (err) {
      toast.error("Failed to remove friend");
    }
  };
  
  const handleAcceptRequest = async (request) => {
    try {
      await friendService.acceptFriendRequest(request.id);
      setFriendRequests(prev => prev.filter(r => r.id !== request.id));
      loadFriends(); // Reload friends list
      toast.success(`${request.username} is now your friend!`);
    } catch (err) {
      toast.error("Failed to accept friend request");
    }
  };
  
  const handleDeclineRequest = async (request) => {
    try {
      await friendService.declineFriendRequest(request.id);
      setFriendRequests(prev => prev.filter(r => r.id !== request.id));
      toast.info(`Declined friend request from ${request.username}`);
    } catch (err) {
      toast.error("Failed to decline friend request");
    }
  };
  
  const handleSendFriendRequest = async (user) => {
    try {
      await friendService.sendFriendRequest(user.id);
      toast.success(`Friend request sent to ${user.username}!`);
      setSearchResults(prev => 
        prev.map(u => u.id === user.id ? { ...u, requestSent: true } : u)
      );
    } catch (err) {
      toast.error("Failed to send friend request");
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadFriends}
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
          Friends
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Connect with friends, invite them to games, and build your gaming community.
        </motion.p>
      </div>
      
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
              "relative transition-all duration-200",
              activeTab === tab.id && "scale-105 shadow-lg"
            )}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
            {tab.name}
            {tab.count !== null && tab.count > 0 && (
              <Badge 
                variant={activeTab === tab.id ? "default" : "secondary"} 
                size="sm"
                className="ml-2"
              >
                {tab.count}
              </Badge>
            )}
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
        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div className="space-y-6">
            {friends.length === 0 ? (
              <Empty
                title="No friends yet"
                description="Start building your gaming community by adding friends!"
                icon="Users"
                action={() => setActiveTab("search")}
                actionText="Find Friends"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FriendCard
                      friend={friend}
                      onInvite={handleInviteToGame}
                      onMessage={handleSendMessage}
                      onRemove={handleRemoveFriend}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Friend Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {friendRequests.length === 0 ? (
              <Empty
                title="No friend requests"
                description="When someone sends you a friend request, it will appear here."
                icon="UserPlus"
                action={() => setActiveTab("search")}
                actionText="Find Friends"
              />
            ) : (
              <div className="space-y-4">
                {friendRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {request.username[0].toUpperCase()}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-white">{request.username}</h3>
                          <p className="text-sm text-gray-400">
                            Level {request.level} • Sent {request.sentAt}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAcceptRequest(request)}
                        >
                          <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeclineRequest(request)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <ApperIcon name="X" className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
              <div className="flex space-x-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for players..."
                  className="flex-1"
                />
                <Button 
                  type="submit"
                  variant="primary"
                  disabled={searching || !searchQuery.trim()}
                >
                  {searching ? (
                    <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Search" className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
            
            {/* Search Results */}
            {searching && (
              <div className="text-center py-8">
                <ApperIcon name="Loader" className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
                <p className="text-gray-400">Searching for players...</p>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-display text-white text-center">
                  Search Results
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {user.username[0].toUpperCase()}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-white">{user.username}</h3>
                          <p className="text-sm text-gray-400">Level {user.level}</p>
                        </div>
                        
                        <Button
                          variant={user.requestSent ? "secondary" : "primary"}
                          size="sm"
                          onClick={() => handleSendFriendRequest(user)}
                          disabled={user.requestSent}
                          className="w-full"
                        >
                          {user.requestSent ? (
                            <>
                              <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                              Add Friend
                            </>
                          )}
</Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {!searching && searchQuery && searchResults.length === 0 && (
              <Empty
                title="No players found"
                description="Try searching with a different username or keyword."
                icon="Search"
                action={() => setSearchQuery("")}
                actionText="Clear Search"
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FriendsPage;