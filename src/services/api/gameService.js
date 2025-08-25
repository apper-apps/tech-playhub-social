const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const gameService = {
  async getActiveGames() {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "current_players_c" } },
          { field: { Name: "max_players_c" } },
          { field: { Name: "min_level_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "player_ids_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('game_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      const games = response.data.map(game => ({
        Id: game.Id,
        name: game.Name,
        type: game.type_c,
        description: game.description_c,
        status: game.status_c,
        currentPlayers: game.current_players_c || 0,
        maxPlayers: game.max_players_c || 4,
        minLevel: game.min_level_c || 1,
        duration: game.duration_c || 5,
        difficulty: game.difficulty_c,
        playerIds: game.player_ids_c ? game.player_ids_c.split(',').map(id => parseInt(id.trim())) : []
      }));
      
      return games;
    } catch (error) {
      console.error("Error fetching active games:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getGameById(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "current_players_c" } },
          { field: { Name: "max_players_c" } },
          { field: { Name: "min_level_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "player_ids_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('game_c', id, params);
      
      if (!response.success) {
        // Create a mock game for demo purposes
        return {
          Id: id,
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
      
      const game = response.data;
      return {
        Id: game.Id,
        name: game.Name,
        type: game.type_c,
        description: game.description_c,
        status: game.status_c,
        currentPlayers: game.current_players_c || 0,
        maxPlayers: game.max_players_c || 4,
        minLevel: game.min_level_c || 1,
        duration: game.duration_c || 5,
        difficulty: game.difficulty_c,
        playerIds: game.player_ids_c ? game.player_ids_c.split(',').map(id => parseInt(id.trim())) : [],
        players: []
      };
    } catch (error) {
      console.error("Error fetching game by ID:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async joinGame(gameId) {
    try {
      await delay(500);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Get current game data
      const game = await this.getGameById(gameId);
      if (!game) {
        throw new Error("Game not found");
      }
      
      if (game.currentPlayers >= game.maxPlayers) {
        throw new Error("Game is full");
      }
      
      // Update player count
      const params = {
        records: [{
          Id: parseInt(gameId),
          current_players_c: game.currentPlayers + 1
        }]
      };
      
      const response = await apperClient.updateRecord('game_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return { success: true, message: "Successfully joined game" };
    } catch (error) {
      console.error("Error joining game:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async findOrCreateGame(gameType) {
    try {
      await delay(600);
      
      // Try to find an existing game with available slots
      const games = await this.getActiveGames();
      const availableGame = games.find(game => 
        game.type === gameType && 
        game.status === "waiting" && 
        game.currentPlayers < game.maxPlayers
      );
      
      if (availableGame) {
        return availableGame;
      }
      
      // Create a new game
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `${gameType} Game`,
          type_c: gameType,
          status_c: "waiting",
          current_players_c: 1,
          max_players_c: 4,
          min_level_c: 1,
          duration_c: 5,
          difficulty_c: "medium"
        }]
      };
      
      const response = await apperClient.createRecord('game_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const createdGame = response.results[0];
      return {
        Id: createdGame.data.Id,
        name: createdGame.data.Name,
        type: gameType,
        status: "waiting",
        currentPlayers: 1,
        maxPlayers: 4,
        minLevel: 1,
        duration: 5
      };
    } catch (error) {
      console.error("Error finding or creating game:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async leaveGame(gameId) {
    try {
      await delay(300);
      
      const game = await this.getGameById(gameId);
      if (!game) {
        throw new Error("Game not found");
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Update player count
      const params = {
        records: [{
          Id: parseInt(gameId),
          current_players_c: Math.max(0, game.currentPlayers - 1)
        }]
      };
      
      const response = await apperClient.updateRecord('game_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return { success: true, message: "Left game successfully" };
    } catch (error) {
      console.error("Error leaving game:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default gameService;