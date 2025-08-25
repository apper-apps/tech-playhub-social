import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ChatPanel from "@/components/molecules/ChatPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import gameService from "@/services/api/gameService";
import userService from "@/services/api/userService";
import { toast } from "react-toastify";

const GameRoom = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  const [game, setGame] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState("waiting"); // waiting, playing, finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Mock quiz question
  const mockQuestions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      timeLimit: 30
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      timeLimit: 30
    }
  ];
  
  useEffect(() => {
    loadGameData();
    loadCurrentUser();
    
    // Mock real-time updates
    const interval = setInterval(() => {
      if (gameState === "playing" && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameId, gameState, timeLeft]);
  
  const loadGameData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const gameData = await gameService.getGameById(gameId);
      setGame(gameData);
      
      // Initialize chat with some messages
      setChatMessages([
        {
          id: 1,
          userId: "user2",
          username: "Alex",
          avatar: "/avatars/avatar2.png",
          content: "Good luck everyone! 🎮",
          type: "text",
          timestamp: new Date(Date.now() - 60000)
        },
        {
          id: 2,
          userId: "user3", 
          username: "Sarah",
          avatar: "/avatars/avatar3.png",
          content: "Let's do this! 🔥",
          type: "text",
          timestamp: new Date(Date.now() - 30000)
        }
      ]);
      
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
  
  const handleStartGame = () => {
    setGameState("playing");
    setTimeLeft(mockQuestions[0].timeLimit);
    toast.success("Game started! Good luck!");
  };
  
  const handleLeaveGame = () => {
    toast.info("Left the game");
    navigate("/games");
  };
  
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      // Mock answer submission
      const correct = selectedAnswer === mockQuestions[currentQuestion].correct;
      if (correct) {
        toast.success("+100 points! Correct answer! 🎉");
      } else {
        toast.error("Wrong answer! Better luck next time.");
      }
      
      // Move to next question or end game
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(mockQuestions[currentQuestion + 1].timeLimit);
      } else {
        setGameState("finished");
        toast.success("Game completed! 🏆");
      }
    }
  };
  
  const handleSendMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message={error || "Game not found"}
          onRetry={() => navigate("/games")}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative">
      {/* Game Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeaveGame}
              className="text-red-400 hover:text-red-300"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Leave
            </Button>
            
            <div>
              <h1 className="text-xl font-display text-white">{game.name}</h1>
              <p className="text-sm text-gray-400">{game.type} • Room #{game.id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {gameState === "playing" && (
              <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <ApperIcon name="Timer" className="w-4 h-4" />
                <span className="font-mono font-bold">{timeLeft}s</span>
              </div>
            )}
            
            <Badge variant={gameState === "playing" ? "success" : "default"}>
              {gameState === "waiting" && "Waiting"}
              {gameState === "playing" && "Playing"}
              {gameState === "finished" && "Finished"}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Players List */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display text-white mb-3">
            Players ({game.players.length}/{game.maxPlayers})
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {game.players.map((player, index) => (
            <motion.div
              key={player.userId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700"
            >
              <Avatar 
                src={player.avatar}
                size="lg"
                online={player.isOnline}
                className="mx-auto mb-2"
              />
              <p className="text-sm font-medium text-white truncate">
                {player.username}
              </p>
              <p className="text-xs text-gray-400">
                {player.score} points
              </p>
              {player.isReady && gameState === "waiting" && (
                <Badge variant="success" size="sm" className="mt-1">
                  Ready
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Game Content */}
      <div className="flex-1 p-4">
        <AnimatePresence mode="wait">
          {gameState === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
                  <ApperIcon name="Clock" className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl font-display text-white mb-3">
                  Waiting for Players
                </h2>
                <p className="text-gray-400 mb-6">
                  The game will start automatically when all players are ready.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleStartGame}
                    disabled={game.players.length < 2}
                  >
                    <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                  
                  <p className="text-sm text-gray-500">
                    Need at least 2 players to start
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Question */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="primary">
                    Question {currentQuestion + 1} of {mockQuestions.length}
                  </Badge>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Time Remaining</p>
                    <p className="text-2xl font-bold text-white font-mono">{timeLeft}s</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-display text-white mb-6">
                  {mockQuestions[currentQuestion].question}
                </h2>
                
                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {mockQuestions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all duration-200",
                        selectedAnswer === index
                          ? "border-purple-500 bg-purple-900/30 text-white"
                          : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          selectedAnswer === index
                            ? "bg-purple-500 text-white"
                            : "bg-gray-600 text-gray-300"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null || timeLeft === 0}
                  >
                    <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2" />
                    Submit Answer
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {gameState === "finished" && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce-in">
                  <ApperIcon name="Trophy" className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-3xl font-display text-gradient-accent mb-3">
                  Game Complete!
                </h2>
                <p className="text-xl text-white mb-2">You earned 150 coins! 🎉</p>
                <p className="text-gray-400 mb-6">Great job on completing the quiz!</p>
                
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate("/games")}
                  >
                    <ApperIcon name="Home" className="w-5 h-5 mr-2" />
                    Back to Games
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Floating Chat */}
      {currentUser && (
        <div className={cn(
          "fixed z-50 transition-all duration-300",
          chatMinimized ? "bottom-4 right-4" : "bottom-4 right-4"
        )}>
          <ChatPanel
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
            isMinimized={chatMinimized}
            onToggleMinimize={() => setChatMinimized(!chatMinimized)}
          />
        </div>
      )}
    </div>
  );
};

export default GameRoom;