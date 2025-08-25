const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const playerService = {
  async getPlayers() {
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
          { field: { Name: "username_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "level_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "is_ready_c" } },
          { field: { Name: "is_online_c" } },
          { field: { Name: "joined_at_c" } },
          { field: { Name: "user_id_c" } }
        ],
        orderBy: [{ fieldName: "joined_at_c", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('player_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(player => ({
        Id: player.Id,
        userId: player.user_id_c?.Id || player.user_id_c,
        username: player.username_c,
        avatar: player.avatar_c,
        level: player.level_c || 1,
        score: player.score_c || 0,
        isReady: player.is_ready_c || false,
        isOnline: player.is_online_c || false,
        joinedAt: player.joined_at_c
      }));
    } catch (error) {
      console.error("Error fetching players:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getPlayerById(id) {
    try {
      await delay(250);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "level_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "is_ready_c" } },
          { field: { Name: "is_online_c" } },
          { field: { Name: "user_id_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('player_c', id, params);
      
      if (!response.success) {
        throw new Error("Player not found");
      }
      
      const player = response.data;
      return {
        Id: player.Id,
        userId: player.user_id_c?.Id || player.user_id_c,
        username: player.username_c,
        avatar: player.avatar_c,
        level: player.level_c || 1,
        score: player.score_c || 0,
        isReady: player.is_ready_c || false,
        isOnline: player.is_online_c || false
      };
    } catch (error) {
      console.error("Error fetching player by ID:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async updatePlayerScore(playerId, score) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(playerId),
          score_c: score
        }]
      };
      
      const response = await apperClient.updateRecord('player_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results[0].data;
    } catch (error) {
      console.error("Error updating player score:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default playerService;