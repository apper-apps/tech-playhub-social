const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const challengeService = {
  async getDailyChallenges() {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "requirement_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "reward_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "expires_at_c" } }
        ],
        where: [
          {
            FieldName: "expires_at_c",
            Operator: "GreaterThan",
            Values: [new Date().toISOString()]
          }
        ],
        orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('challenge_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format and add time remaining
      const challengesWithProgress = response.data.map(challenge => {
        const reward = challenge.reward_c ? JSON.parse(challenge.reward_c) : { coins: 100 };
        const expiresAt = new Date(challenge.expires_at_c);
        const now = new Date();
        const timeRemaining = Math.max(0, expiresAt - now);
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
          Id: challenge.Id,
          title: challenge.title_c,
          description: challenge.description_c,
          type: challenge.type_c,
          requirement: challenge.requirement_c || 1,
          progress: challenge.progress_c || 0,
          reward: reward,
          timeRemaining: `${hours}h ${minutes}m`,
          expiresAt: expiresAt
        };
      });
      
      return challengesWithProgress;
    } catch (error) {
      console.error("Error fetching daily challenges:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getChallengeById(id) {
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "requirement_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "reward_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('challenge_c', id, params);
      
      if (!response.success) {
        throw new Error("Challenge not found");
      }
      
      const challenge = response.data;
      const reward = challenge.reward_c ? JSON.parse(challenge.reward_c) : { coins: 100 };
      
      return {
        Id: challenge.Id,
        title: challenge.title_c,
        description: challenge.description_c,
        type: challenge.type_c,
        requirement: challenge.requirement_c || 1,
        progress: challenge.progress_c || 0,
        reward: reward
      };
    } catch (error) {
      console.error("Error fetching challenge by ID:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async claimChallenge(challengeId) {
    try {
      await delay(500);
      
      const challenge = await this.getChallengeById(challengeId);
      if (!challenge) {
        throw new Error("Challenge not found");
      }
      
      if (challenge.progress < challenge.requirement) {
        throw new Error("Challenge not completed yet");
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Delete the challenge after claiming
      const params = {
        RecordIds: [parseInt(challengeId)]
      };
      
      const response = await apperClient.deleteRecord('challenge_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return {
        success: true,
        message: "Challenge reward claimed",
        reward: challenge.reward
      };
    } catch (error) {
      console.error("Error claiming challenge:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async updateChallengeProgress(challengeId, progress) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(challengeId),
          progress_c: progress
        }]
      };
      
      const response = await apperClient.updateRecord('challenge_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results[0].data;
    } catch (error) {
      console.error("Error updating challenge progress:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};
export default challengeService;