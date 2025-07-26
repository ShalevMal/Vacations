import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";

// Init vacations
export function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const vacationsToInit = action.payload;
    const newState = vacationsToInit;
    return newState;
}

// Add vacation
export function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const vacationToAdd = action.payload;
    const newState = [...currentState];
    newState.push(vacationToAdd);
    return newState;
}

// Update vacation
export function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const vacationToUpdate = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(v => v._id === vacationToUpdate._id);
    newState[index] = vacationToUpdate;
    return newState;
}

// Delete vacation
export function deleteVacation(currentState: VacationModel[], action: PayloadAction<string>): VacationModel[] {
    const idToDelete = action.payload;
    const newState = [...currentState];
    const index = newState.findIndex(v => v._id === idToDelete);
    if (index >= 0) newState.splice(index, 1);
    return newState;
}

// Create slice
export const vacationSlice = createSlice({
    name: "vacations",
    initialState: [],
    reducers: { initVacations, addVacation, updateVacation, deleteVacation }
});


export const vacationActions = vacationSlice.actions;
