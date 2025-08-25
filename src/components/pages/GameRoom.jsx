import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ChatPanel from "@/components/molecules/ChatPanel";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import userService from "@/services/api/userService";
import gameService from "@/services/api/gameService";

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
const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Jupiter", "Saturn", "Neptune"],
      correct: 1,
      timeLimit: 30,
      category: "science"
    },
    {
      id: 2,
      question: "Which programming language is known as the 'language of the web'?",
      options: ["Python", "Java", "JavaScript", "C++"],
      correct: 2,
      timeLimit: 25,
      category: "technology"
    },
    {
      id: 3,
      question: "In which year did the Berlin Wall fall?",
      options: ["1987", "1989", "1991", "1993"],
      correct: 1,
      timeLimit: 30,
      category: "history"
    },
    {
      id: 4,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
      timeLimit: 20,
      category: "science"
    }
  ]);
  
  useEffect(() => {
loadGameData();
    loadCurrentUser();
    
    // Enhanced real-time game timer
    const interval = setInterval(() => {
      if (gameState === "playing" && timeLeft > 0) {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            // Auto-submit when time runs out
            handleSubmitAnswer();
          }
          return newTime;
        });
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
        },
        {
          id: "4",
          playerId: "player2",
          playerName: "Alex",
          avatar: "/avatars/avatar2.png",
          message: "This is getting intense! 🔥",
          type: "text",
          timestamp: new Date(Date.now() - 15000)
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
setTimeLeft(questions[0]?.timeLimit || 30);
    toast.success("🎮 Game started! Show your skills!");
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
const currentQuestionData = questions[currentQuestion];
      const correct = selectedAnswer === currentQuestionData.correct;
      const points = correct ? (timeLeft > 15 ? 150 : timeLeft > 5 ? 100 : 50) : 0;
      
      if (correct) {
        toast.success(`🎯 Correct! +${points} points! ${timeLeft > 15 ? 'Lightning fast!' : 'Nice job!'}`);
      } else {
        const correctAnswer = currentQuestionData.options[currentQuestionData.correct];
        toast.error(`❌ Wrong! Correct answer: ${correctAnswer}`);
      }
      
      // Move to next question or end game
      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setTimeLeft(questions[currentQuestion + 1]?.timeLimit || 30);
        }, 2000); // Give time to see the correct answer
      } else {
        setTimeout(() => {
          setGameState("finished");
          toast.success("🏆 Quiz completed! Great job!");
        }, 2000);
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
{/* Question */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-purple-900/30">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <Badge variant={timeLeft > 10 ? "success" : "error"}>
                    {timeLeft}s remaining
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-display text-white mb-6">
                  {questions[currentQuestion]?.question}
                </h2>
                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
{questions[currentQuestion]?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all duration-200 relative",
                        selectedAnswer === index
                          ? "border-purple-500 bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-white shadow-lg"
                          : "border-gray-600 bg-gray-800 text-gray-300 hover:border-purple-400 hover:bg-gray-700"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                          selectedAnswer === index
                            ? "bg-purple-500 text-white shadow-md"
                            : "bg-gray-600 text-gray-300"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1 font-medium">{option}</span>
                        {selectedAnswer === index && (
                          <ApperIcon name="Check" className="w-5 h-5 text-purple-400" />
                        )}
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
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-500/30 mb-4">
                  <p className="text-xl text-white mb-2">🎉 Congratulations! You earned:</p>
                  <div className="flex items-center justify-center space-x-4 text-lg">
                    <div className="flex items-center">
                      <ApperIcon name="Coins" className="w-6 h-6 text-yellow-500 mr-2 coin-glow" />
                      <span className="text-yellow-500 font-bold">350 Coins</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Diamond" className="w-5 h-5 text-pink-500 mr-2 diamond-glow" />
                      <span className="text-pink-500 font-bold">5 Diamonds</span>
                    </div>
                  </div>
                </div>
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