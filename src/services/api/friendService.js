import friendsData from "@/services/mockData/friends.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const friendService = {
  async getFriends() {
    await delay(350);
    return friendsData.map(friend => ({ ...friend }));
  },

  async getFriendRequests() {
    await delay(300);
    // Mock friend requests
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
    await delay(500);
    
    // Mock search results
    const mockUsers = [
      {
        id: "search1",
        username: "GamerPro",
        level: 15,
        requestSent: false
      },
      {
        id: "search2",
        username: "QuizMaster",
        level: 22,
        requestSent: false
      },
      {
        id: "search3",
        username: "CardShark",
        level: 9,
        requestSent: false
      },
      {
        id: "search4",
        username: "DiceRoller",
        level: 11,
        requestSent: true
      }
    ];
    
    // Filter based on search query
    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase())
    );
  },

  async sendFriendRequest(userId) {
    await delay(400);
    return { success: true, message: "Friend request sent" };
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
    await delay(400);
    return { success: true, message: "Friend removed" };
  }
};

export default friendService;