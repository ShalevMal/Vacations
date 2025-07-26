import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";

function login(_state: UserModel | null, action: PayloadAction<UserModel>): UserModel {
    return action.payload;
}

// ___________________________

function logout(_state: UserModel | null): null {
    return null;
}

// ___________________________

export const userSlice = createSlice({
    name: "user",
    initialState: null as UserModel | null,
    reducers: {
        login,
        logout
    }
});

// ___________________________

export const authActions = userSlice.actions;

export const userReducer = userSlice.reducer;
