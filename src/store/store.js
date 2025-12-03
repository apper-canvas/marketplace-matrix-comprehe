import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import wishlistSlice from "./slices/wishlistSlice";
import userSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishlistSlice,
    user: userSlice,
  },
  devTools: typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__,
});