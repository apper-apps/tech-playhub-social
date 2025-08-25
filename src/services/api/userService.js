const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  async getCurrentUser() {
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
          { field: { Name: "email_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "level_c" } },
          { field: { Name: "experience_c" } },
          { field: { Name: "coins_c" } },
          { field: { Name: "diamonds_c" } },
          { field: { Name: "rank_c" } },
          { field: { Name: "stats_c" } },
          { field: { Name: "friends_c" } },
          { field: { Name: "achievements_c" } },
          { field: { Name: "games_played_c" } },
          { field: { Name: "wins_c" } },
          { field: { Name: "losses_c" } },
          { field: { Name: "best_streak_c" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };
      
      const response = await apperClient.fetchRecords('user_profile_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
// Return mock user if no database user found
        return {
          Id: 1,
          username: "PlayerOne",
          email: "player@example.com",
          avatar: "/avatars/avatar1.png",
          level: 1,
          experience: 0,
          coins: 500,
          diamonds: 5,
          rank: 999,
          stats: {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            bestStreak: 0
          }
        };
      }
      
      const user = response.data[0];
      const stats = user.stats_c ? JSON.parse(user.stats_c) : {};
      
      // Transform to expected format
      return {
        Id: user.Id,
        username: user.username_c,
        username_c: user.username_c,
        email: user.email_c,
        email_c: user.email_c,
        avatar: user.avatar_c,
        avatar_c: user.avatar_c,
        level: user.level_c || 1,
        level_c: user.level_c || 1,
        experience: user.experience_c || 0,
        experience_c: user.experience_c || 0,
        coins: user.coins_c || 0,
        coins_c: user.coins_c || 0,
        diamonds: user.diamonds_c || 0,
        diamonds_c: user.diamonds_c || 0,
        rank: user.rank_c,
        rank_c: user.rank_c,
        stats: {
          gamesPlayed: user.games_played_c || stats.gamesPlayed || 0,
          wins: user.wins_c || stats.wins || 0,
          losses: user.losses_c || stats.losses || 0,
          bestStreak: user.best_streak_c || stats.bestStreak || 0,
          favoriteGame: stats.favoriteGame || "quiz",
          favoriteGamePlays: stats.favoriteGamePlays || 42,
          favoriteGameWinRate: stats.favoriteGameWinRate || 73
        }
      };
    } catch (error) {
      console.error("Error fetching current user:", error?.response?.data?.message || error.message);
// Return mock user on error
      return {
        Id: 1,
        username: "PlayerOne",
        email: "player@example.com",
        avatar: "/avatars/avatar1.png",
        level: 1,
        experience: 0,
        coins: 500,
        diamonds: 5,
        rank: 999,
        stats: {
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          bestStreak: 0
        }
      };
    }
  },

  async getUsers() {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username_c" } },
          { field: { Name: "level_c" } },
          { field: { Name: "avatar_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('user_profile_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(user => ({
        Id: user.Id,
        username: user.username_c,
        level: user.level_c || 1,
        avatar: user.avatar_c
      }));
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getUserById(id) {
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
          { field: { Name: "email_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "level_c" } },
          { field: { Name: "experience_c" } },
          { field: { Name: "coins_c" } },
          { field: { Name: "diamonds_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('user_profile_c', id, params);
      
      if (!response.success) {
        throw new Error("User not found");
      }
      
      const user = response.data;
      return {
        Id: user.Id,
        username: user.username_c,
        email: user.email_c,
        avatar: user.avatar_c,
        level: user.level_c || 1,
        experience: user.experience_c || 0,
        coins: user.coins_c || 0,
        diamonds: user.diamonds_c || 0
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async updateUser(id, updates) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Filter updates to only include updateable fields
      const updateableFields = {
        Id: parseInt(id)
      };
      
      if (updates.username) updateableFields.username_c = updates.username;
      if (updates.email) updateableFields.email_c = updates.email;
      if (updates.avatar) updateableFields.avatar_c = updates.avatar;
      if (updates.level !== undefined) updateableFields.level_c = updates.level;
      if (updates.experience !== undefined) updateableFields.experience_c = updates.experience;
      if (updates.coins !== undefined) updateableFields.coins_c = updates.coins;
      if (updates.diamonds !== undefined) updateableFields.diamonds_c = updates.diamonds;
      
      const params = {
        records: [updateableFields]
      };
      
      const response = await apperClient.updateRecord('user_profile_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const updatedUser = response.results[0];
      return updatedUser.data;
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getUserAchievements() {
    await delay(400);
    // Mock achievements data since achievements typically require separate management
    return [
      {
        id: "1",
        name: "First Victory",
        description: "Win your first game",
        icon: "Trophy",
        isUnlocked: true,
        progress: 1,
        requirement: 1,
        unlockedAt: "2023-12-01"
      },
      {
        id: "2", 
        name: "Quiz Master",
        description: "Answer 100 quiz questions correctly",
        icon: "Brain",
        isUnlocked: true,
        progress: 100,
        requirement: 100,
        unlockedAt: "2023-12-15"
      },
      {
        id: "3",
        name: "Social Butterfly",
        description: "Add 10 friends",
        icon: "Users",
        isUnlocked: false,
        progress: 6,
        requirement: 10
      },
      {
        id: "4",
        name: "Win Streak",
        description: "Win 5 games in a row",
        icon: "Zap",
        isUnlocked: false,
        progress: 3,
        requirement: 5
      }
    ];
}
};

export default userService;