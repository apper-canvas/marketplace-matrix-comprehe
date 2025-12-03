import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromStorage = () => {
  try {
    const wishlistData = localStorage.getItem("marketplace_wishlist");
    if (wishlistData) {
      const parsed = JSON.parse(wishlistData);
      return {
        items: parsed.items || [],
        itemCount: parsed.items?.length || 0,
      };
    }
    return { items: [], itemCount: 0 };
  } catch (error) {
    console.error("Error loading wishlist from localStorage:", error);
    return { items: [], itemCount: 0 };
  }
};

const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem("marketplace_wishlist", JSON.stringify(wishlist));
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

const initialState = loadWishlistFromStorage();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.Id === product.Id);
      
      if (!existingItem) {
        state.items.push(product);
        state.itemCount = state.items.length;
        saveWishlistToStorage(state);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.Id !== productId);
      state.itemCount = state.items.length;
      saveWishlistToStorage(state);
    },
    clearWishlist: (state) => {
      state.items = [];
      state.itemCount = 0;
      saveWishlistToStorage(state);
    },
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.Id === product.Id);
      
      if (existingItemIndex >= 0) {
        state.items.splice(existingItemIndex, 1);
      } else {
        state.items.push(product);
      }
      
      state.itemCount = state.items.length;
      saveWishlistToStorage(state);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;