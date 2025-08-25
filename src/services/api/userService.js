import userData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  async getCurrentUser() {
    await delay(300);
    return { ...userData[0] }; // Return copy of first user as current user
  },

  async getUsers() {
    await delay(200);
    return userData.map(user => ({ ...user }));
  },

  async getUserById(id) {
    await delay(250);
    const user = userData.find(user => user.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async updateUser(id, updates) {
    await delay(300);
    const userIndex = userData.findIndex(user => user.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    userData[userIndex] = { ...userData[userIndex], ...updates };
    return { ...userData[userIndex] };
  },

  async getUserAchievements() {
    await delay(400);
    // Mock achievements data
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