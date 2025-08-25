const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const friendService = {
  async getFriends() {
    try {
      await delay(350);
      
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
          { field: { Name: "is_online_c" } },
          { field: { Name: "current_game_c" } },
          { field: { Name: "last_seen_c" } },
          { field: { Name: "wins_c" } },
          { field: { Name: "games_played_c" } },
          { field: { Name: "friends_since_c" } },
          { field: { Name: "user_id_c" } }
        ],
        orderBy: [{ fieldName: "friends_since_c", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('friend_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      return response.data.map(friend => ({
        Id: friend.Id,
        userId: friend.user_id_c?.Id || friend.user_id_c,
        username: friend.username_c,
        avatar: friend.avatar_c,
        level: friend.level_c || 1,
        isOnline: friend.is_online_c || false,
        currentGame: friend.current_game_c,
        lastSeen: friend.last_seen_c,
        wins: friend.wins_c || 0,
        gamesPlayed: friend.games_played_c || 0,
        friendsSince: friend.friends_since_c
      }));
    } catch (error) {
      console.error("Error fetching friends:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getFriendRequests() {
    await delay(300);
    // Mock friend requests since this typically requires separate table
    return [
      {
        id: "req1",
        userId: "user5",
        username: "Mike",
        avatar: "/avatars/avatar5.png",
        level: 8,
        sentAt: "2h ago"
      },
      {
        id: "req2", 
        userId: "user6",
        username: "Emma",
        avatar: "/avatars/avatar6.png", 
        level: 12,
        sentAt: "1d ago"
      },
      {
        id: "req3",
        userId: "user7",
        username: "David",
        avatar: "/avatars/avatar7.png",
        level: 5,
        sentAt: "3d ago"
      }
    ];
  },

  async searchUsers(query) {
    try {
      await delay(500);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "username_c" } },
          { field: { Name: "level_c" } }
        ],
        where: [
          {
            FieldName: "username_c",
            Operator: "Contains",
            Values: [query]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('user_profile_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      return response.data.map(user => ({
        id: user.Id,
        username: user.username_c,
        level: user.level_c || 1,
        requestSent: false
      }));
    } catch (error) {
      console.error("Error searching users:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async sendFriendRequest(userId) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: "Friend Request",
          user_id_c: parseInt(userId),
          friends_since_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('friend_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return { success: true, message: "Friend request sent" };
    } catch (error) {
      console.error("Error sending friend request:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async acceptFriendRequest(requestId) {
    await delay(350);
    return { success: true, message: "Friend request accepted" };
  },

  async declineFriendRequest(requestId) {
    await delay(300);
    return { success: true, message: "Friend request declined" };
  },

  async removeFriend(friendId) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(friendId)]
      };
      
      const response = await apperClient.deleteRecord('friend_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return { success: true, message: "Friend removed" };
    } catch (error) {
      console.error("Error removing friend:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default friendService;