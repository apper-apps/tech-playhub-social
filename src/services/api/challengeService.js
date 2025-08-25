import challengesData from "@/services/mockData/challenges.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const challengeService = {
  async getDailyChallenges() {
    await delay(400);
    
    // Add time remaining and progress to challenges
    const challengesWithProgress = challengesData.map(challenge => ({
      ...challenge,
      timeRemaining: "18h 42m",
      expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000) // 18 hours from now
    }));
    
    return challengesWithProgress;
  },

  async getChallengeById(id) {
    await delay(300);
    const challenge = challengesData.find(c => c.Id === parseInt(id));
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    return { ...challenge };
  },

  async claimChallenge(challengeId) {
    await delay(500);
    
    const challenge = challengesData.find(c => c.Id === parseInt(challengeId));
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    
    if (challenge.progress < challenge.requirement) {
      throw new Error("Challenge not completed yet");
    }
    
    return {
      success: true,
      message: "Challenge reward claimed",
      reward: challenge.reward
    };
  },

  async updateChallengeProgress(challengeId, progress) {
    await delay(300);
    
    const challengeIndex = challengesData.findIndex(c => c.Id === parseInt(challengeId));
    if (challengeIndex === -1) {
      throw new Error("Challenge not found");
    }
    
    challengesData[challengeIndex].progress = progress;
    return { ...challengesData[challengeIndex] };
  }
};

export default challengeService;