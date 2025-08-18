import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { VacationModel } from "../Models/VacationModel";

const initialState: VacationModel[] = [];

export function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
  const vacationsToInit = action.payload;
  const newState = vacationsToInit;
  return newState;
}

export function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
  const vacationToAdd = action.payload;
  const newState = [...currentState];
  newState.push(vacationToAdd);
  return newState;
}

export function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
  const vacationToUpdate = action.payload;
  const newState = [...currentState];
  const index = newState.findIndex(v => v._id === vacationToUpdate._id);
  if (index >= 0) newState[index] = vacationToUpdate;
  return newState;
}

export function deleteVacation(currentState: VacationModel[], action: PayloadAction<string>): VacationModel[] {
  const idToDelete = action.payload;
  const newState = [...currentState];
  const index = newState.findIndex(v => v._id === idToDelete);
  if (index >= 0) newState.splice(index, 1);
  return newState;
}

export const vacationSlice = createSlice({
  name: "vacations",
  initialState,
  reducers: {
    initVacations,
    addVacation,
    updateVacation,
    deleteVacation,
  },
});

export const { initVacations: initVacationsAction, addVacation: addVacationAction, updateVacation: updateVacationAction, deleteVacation: deleteVacationAction } =
  vacationSlice.actions;

export default vacationSlice.reducer;

