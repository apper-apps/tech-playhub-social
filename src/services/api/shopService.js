import shopData from "@/services/mockData/shop.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const shopService = {
  async getShopItems() {
    await delay(450);
    return shopData.map(item => ({ ...item }));
  },

  async getFeaturedItems() {
    await delay(300);
    const featured = shopData.filter(item => item.isFeatured);
    return featured.map(item => ({ ...item }));
  },

  async getItemsByCategory(category) {
    await delay(350);
    const items = shopData.filter(item => item.category === category);
    return items.map(item => ({ ...item }));
  },

  async purchaseItem(itemId) {
    await delay(600);
    
    const item = shopData.find(item => item.Id === parseInt(itemId));
    if (!item) {
      throw new Error("Item not found");
    }
    
    // Mock successful purchase
    return {
      success: true,
      message: `Successfully purchased ${item.name}`,
      item: { ...item }
    };
  },

  async getUserPurchases() {
    await delay(400);
    // Mock user's purchased items
    return [
      { Id: 1, purchasedAt: "2023-12-20" },
      { Id: 3, purchasedAt: "2023-12-18" }
    ];
  }
};

export default shopService;