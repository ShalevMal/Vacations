import { configureStore } from "@reduxjs/toolkit";
import { vacationSlice } from "./VacationSlice";
import { userReducer } from "./UserState";
import { likeReducer } from "./LikeSlice";

export const store = configureStore({
    reducer: {
        likes: likeReducer,
        vacations: vacationSlice.reducer,
        user: userReducer
    }
});

export type AppState = ReturnType<typeof store.getState>;
