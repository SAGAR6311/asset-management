import { configureStore } from "@reduxjs/toolkit";
import partsReducer from "./slices/partsSlice";
import assetsReducer from "./slices/assetsSlice";
import teamMembersReducer from "./slices/teamMembersSlice";
import utilizationReducer from "./slices/utilizationSlice";

export const store = configureStore({
  reducer: {
    parts: partsReducer,
    assets: assetsReducer,
    teamMembers: teamMembersReducer,
    utilization: utilizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
