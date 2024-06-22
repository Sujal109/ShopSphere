import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// Initialize cart state from localStorage if available
const getInitialCartState = () => {
  const cart = localStorage.getItem("cart");
  return cart
    ? JSON.parse(cart)
    : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
};

const initialState = getInitialCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      updateCart(state);
    },
    resetCart: (state) => {
      const newState = getInitialCartState();
      state.cartItems = newState.cartItems;
      state.shippingAddress = newState.shippingAddress;
      state.paymentMethod = newState.paymentMethod;
      updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
