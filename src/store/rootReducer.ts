import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
});

export type Dispatch = typeof store.dispatch;

export default store;
