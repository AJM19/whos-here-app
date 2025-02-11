import { configureStore } from "@reduxjs/toolkit";
import { whosHereAPI } from "./queries/whosHereAPI";

export const store = configureStore({
  reducer: {
    [whosHereAPI.reducerPath]: whosHereAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(whosHereAPI.middleware),
});
