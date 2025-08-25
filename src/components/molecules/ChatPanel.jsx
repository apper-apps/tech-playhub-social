import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const ChatPanel = ({ 
  messages = [], 
  onSendMessage,
  currentUser,
  isMinimized = false,
  onToggleMinimize,
  className = "" 
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  
  const emojis = ["😀", "😎", "🎉", "🔥", "💯", "👍", "😂", "❤️", "🎮", "🏆"];
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage({
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        content: newMessage,
        type: "text",
        timestamp: new Date()
      });
      setNewMessage("");
    }
  };
  
  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };
  
  if (isMinimized) {
    return (
      <motion.div
        className={cn(
          "fixed bottom-4 right-4 z-40",
          className
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          variant="primary"
          onClick={onToggleMinimize}
          className="rounded-full w-12 h-12 shadow-2xl"
        >
          <ApperIcon name="MessageCircle" className="w-5 h-5" />
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={cn(
        "bg-gray-800 border border-gray-700 rounded-lg overflow-hidden",
        "flex flex-col h-96 w-80",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Game Chat</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMinimize}
          className="p-1 text-white/80 hover:text-white"
        >
          <ApperIcon name="Minimize2" className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start space-x-2",
                message.userId === currentUser.id && "flex-row-reverse space-x-reverse"
              )}
            >
              <Avatar 
                src={message.avatar}
                size="sm"
                alt={message.username}
              />
              
              <div className={cn(
                "max-w-[70%]",
                message.userId === currentUser.id && "text-right"
              )}>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs font-medium text-gray-300">
                    {message.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <div className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  message.userId === currentUser.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gray-700 text-gray-200"
                )}>
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-700 p-3"
          >
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-lg hover:scale-125 transition-transform duration-150"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Message Input */}
      <div className="border-t border-gray-700 p-3">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="h-10 text-sm"
            />
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-400 hover:text-yellow-500"
          >
            <ApperIcon name="Smile" className="w-5 h-5" />
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!newMessage.trim()}
            className="px-4"
          >
            <ApperIcon name="Send" className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatPanel;