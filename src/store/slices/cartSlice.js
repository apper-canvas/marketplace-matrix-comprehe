import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return { items: [], total: 0, itemCount: 0 };
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    return { items: [], total: 0, itemCount: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (error) {
    console.error("Could not save cart to localStorage:", error);
  }
};

const calculateCartTotals = (items) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return { itemCount, total };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.Id === product.Id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          Id: product.Id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity: 1,
        });
      }
      
      const totals = calculateCartTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
      
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.Id !== productId);
      
      const totals = calculateCartTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
      
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.Id === productId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity <= 0) {
        state.items = state.items.filter(item => item.Id !== productId);
      }
      
      const totals = calculateCartTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
      
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;