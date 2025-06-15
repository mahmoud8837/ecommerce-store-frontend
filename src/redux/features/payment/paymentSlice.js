import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payment: localStorage.getItem("payment")
    ? JSON.parse(localStorage.getItem("payment"))
    : null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("payment", JSON.stringify(state))
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("payment", JSON.stringify(state))
    }
  }
});

export const {saveShippingAddress, savePaymentMethod} = paymentSlice.actions;
export default paymentSlice.reducer