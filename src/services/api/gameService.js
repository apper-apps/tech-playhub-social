import gamesData from "@/services/mockData/games.json";
import playersData from "@/services/mockData/players.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const gameService = {
  async getActiveGames() {
    await delay(400);
    
    // Combine games with player data
    const gamesWithPlayers = gamesData.map(game => {
      const gamePlayers = playersData.filter(player => 
        game.playerIds && game.playerIds.includes(player.Id)
      );
      
      return {
        ...game,
        players: gamePlayers,
        currentPlayers: gamePlayers.length
      };
    });
    
    return gamesWithPlayers;
  },

  async getGameById(id) {
    await delay(300);
    
    const game = gamesData.find(game => game.Id === parseInt(id) || game.Id === id);
    if (!game) {
      // Create a mock game for demo purposes
      return {
        id: id,
        name: "Quiz Master",
        type: "quiz",
        description: "Test your knowledge in this exciting quiz game!",
        status: "waiting",
        maxPlayers: 4,
        minLevel: 1,
        duration: 5,
        players: [
          {
            userId: "user1",
            username: "You",
            avatar: "/avatars/avatar1.png",
            score: 0,
            isReady: true,
            isOnline: true
          },
          {
            userId: "user2", 
            username: "Alex",
            avatar: "/avatars/avatar2.png",
            score: 0,
            isReady: false,
            isOnline: true
          }
        ]
      };
    }
    
    const gamePlayers = playersData.filter(player => 
      game.playerIds && game.playerIds.includes(player.Id)
    );
    
    return {
      ...game,
      players: gamePlayers
    };
  },

  async joinGame(gameId) {
    await delay(500);
    
    // Mock joining a game
    const game = gamesData.find(g => g.Id === parseInt(gameId));
    if (!game) {
      throw new Error("Game not found");
    }
    
    if (game.currentPlayers >= game.maxPlayers) {
      throw new Error("Game is full");
    }
    
    // In a real app, this would add the current user to the game
    return { success: true, message: "Successfully joined game" };
  },

  async findOrCreateGame(gameType) {
    await delay(600);
    
    // Try to find an existing game with available slots
    const availableGame = gamesData.find(game => 
      game.type === gameType && 
      game.status === "waiting" && 
      game.currentPlayers < game.maxPlayers
    );
    
    if (availableGame) {
      return { ...availableGame };
    }
    
    // Create a new game
    const newGameId = Date.now().toString();
    const newGame = {
      id: newGameId,
      name: `${gameType} Game`,
      type: gameType,
      status: "waiting",
      currentPlayers: 1,
      maxPlayers: 4,
      minLevel: 1,
      duration: 5
    };
    
    return newGame;
  },

  async leaveGame(gameId) {
    await delay(300);
    return { success: true, message: "Left game successfully" };
  }
};

export default gameService;