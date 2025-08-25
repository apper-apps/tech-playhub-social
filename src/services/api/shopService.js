const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shopService = {
  async getShopItems() {
    try {
      await delay(450);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "coin_price_c" } },
          { field: { Name: "diamond_price_c" } },
          { field: { Name: "rarity_c" } },
          { field: { Name: "is_new_c" } },
          { field: { Name: "is_featured_c" } },
          { field: { Name: "is_purchased_c" } },
          { field: { Name: "image_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('shop_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        description: item.description_c,
        category: item.category_c,
        coinPrice: item.coin_price_c,
        diamondPrice: item.diamond_price_c,
        rarity: item.rarity_c,
        isNew: item.is_new_c || false,
        isFeatured: item.is_featured_c || false,
        isPurchased: item.is_purchased_c || false,
        image: item.image_c
      }));
    } catch (error) {
      console.error("Error fetching shop items:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getFeaturedItems() {
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
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "coin_price_c" } },
          { field: { Name: "diamond_price_c" } },
          { field: { Name: "rarity_c" } },
          { field: { Name: "is_new_c" } },
          { field: { Name: "is_featured_c" } },
          { field: { Name: "is_purchased_c" } },
          { field: { Name: "image_c" } }
        ],
        where: [
          {
            FieldName: "is_featured_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('shop_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        description: item.description_c,
        category: item.category_c,
        coinPrice: item.coin_price_c,
        diamondPrice: item.diamond_price_c,
        rarity: item.rarity_c,
        isNew: item.is_new_c || false,
        isFeatured: item.is_featured_c || false,
        isPurchased: item.is_purchased_c || false,
        image: item.image_c
      }));
    } catch (error) {
      console.error("Error fetching featured items:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getItemsByCategory(category) {
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
          { field: { Name: "description_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "coin_price_c" } },
          { field: { Name: "diamond_price_c" } },
          { field: { Name: "rarity_c" } },
          { field: { Name: "is_new_c" } },
          { field: { Name: "is_featured_c" } },
          { field: { Name: "is_purchased_c" } },
          { field: { Name: "image_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('shop_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        description: item.description_c,
        category: item.category_c,
        coinPrice: item.coin_price_c,
        diamondPrice: item.diamond_price_c,
        rarity: item.rarity_c,
        isNew: item.is_new_c || false,
        isFeatured: item.is_featured_c || false,
        isPurchased: item.is_purchased_c || false,
        image: item.image_c
      }));
    } catch (error) {
      console.error("Error fetching items by category:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async purchaseItem(itemId) {
    try {
      await delay(600);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Mark item as purchased
      const params = {
        records: [{
          Id: parseInt(itemId),
          is_purchased_c: true
        }]
      };
      
      const response = await apperClient.updateRecord('shop_item_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const item = response.results[0];
      return {
        success: true,
        message: `Successfully purchased ${item.data.Name}`,
        item: item.data
      };
    } catch (error) {
      console.error("Error purchasing item:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getUserPurchases() {
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
          { field: { Name: "CreatedOn" } }
        ],
        where: [
          {
            FieldName: "is_purchased_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('shop_item_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform to expected format
      return response.data.map(item => ({
        Id: item.Id,
        purchasedAt: item.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching user purchases:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};

export default shopService;