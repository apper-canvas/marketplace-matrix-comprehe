const STORAGE_KEY = "marketplace_wishlist";

class WishlistService {
  getAll() {
    try {
      const wishlistData = localStorage.getItem(STORAGE_KEY);
      if (wishlistData) {
        const parsed = JSON.parse(wishlistData);
        return [...(parsed.items || [])];
      }
      return [];
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  }

  add(product) {
    try {
      const current = this.getAll();
      const exists = current.find((item) => item.Id === product.Id);
      
      if (!exists) {
        const updated = [...current, product];
        const wishlistData = {
          items: updated,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistData));
        return updated;
      }
      
      return current;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return this.getAll();
    }
  }

  remove(productId) {
    try {
      const current = this.getAll();
      const updated = current.filter((item) => item.Id !== productId);
      const wishlistData = {
        items: updated,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistData));
      return updated;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return this.getAll();
    }
  }

  clear() {
    try {
      const wishlistData = {
        items: [],
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistData));
      return [];
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      return [];
    }
  }

  isInWishlist(productId) {
    const current = this.getAll();
    return current.some((item) => item.Id === productId);
  }

  getCount() {
    return this.getAll().length;
  }
}

export default new WishlistService();