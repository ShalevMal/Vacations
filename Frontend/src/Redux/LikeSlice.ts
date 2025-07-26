import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LikeInfo = {
    isLiked: boolean;
    count: number;
};

type LikeState = {
    [vacationId: string]: LikeInfo;
};

const initialState: LikeState = {};

const likeSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {

        initLikes(_state, action: PayloadAction<LikeState>) {
            return action.payload;
        },

        toggleLike(state, action: PayloadAction<{ vacationId: string }>) {
            const { vacationId } = action.payload;
            const current = state[vacationId];
            if (!current) return;

            current.isLiked = !current.isLiked;
            current.count += current.isLiked ? 1 : -1;
        },

        setLike(state, action: PayloadAction<{ vacationId: string; isLiked: boolean; count: number }>) {
            const { vacationId, isLiked, count } = action.payload;
            state[vacationId] = { isLiked, count };
        }
    }
});

export const likeReducer = likeSlice.reducer;
export const likeActions = likeSlice.actions;
