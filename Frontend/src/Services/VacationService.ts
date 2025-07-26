import axios, { AxiosRequestConfig } from "axios";
import { VacationModel } from "../Models/VacationModel";
import { appConfig } from "../Utils/AppConfig";
import { vacationSlice } from "../Redux/VacationSlice";
import { store } from "../Redux/Store";

class VacationService {

    // Get all vacations from server or from Redux store
    public async getAllVacations(): Promise<VacationModel[]> {
        const vacationsInStore = store.getState().vacations;
        if (vacationsInStore.length > 0) return vacationsInStore;

        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        const vacations = response.data;

        store.dispatch(vacationSlice.actions.initVacations(vacations));
        return vacations;
    }

    // Get a single vacation by ID
    public async getOneVacation(id: string): Promise<VacationModel> {
        const url = appConfig.vacationsUrl + id;
        const response = await axios.get<VacationModel>(url);
        return response.data;
    }

    // Add new vacation to the backend
    public async addVacation(vacation: VacationModel): Promise<void> {
        const fileList = vacation.image as unknown as FileList;
        if (fileList?.length > 0) {
            vacation.image = fileList[0];
        }
        const config = this.getFormDataAuthHeader();
        const response = await axios.post<VacationModel>(
            appConfig.vacationsUrl, vacation, config
        );

        store.dispatch(vacationSlice.actions.addVacation(response.data));
    }

    // Update vacation details including optional image
    public async updateVacation(vacation: VacationModel): Promise<void> {
        if (vacation.image instanceof FileList && vacation.image.length > 0) {
            vacation.image = vacation.image[0];
        }

        const config = this.getFormDataAuthHeader();

        const response = await axios.put<VacationModel>(
            appConfig.vacationsUrl + vacation._id,
            vacation,
            config
        );

        store.dispatch(vacationSlice.actions.updateVacation(response.data));
    }

    // Delete a vacation by ID
    public async deleteVacation(vacationId: string): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}${vacationId}`, this.getAuthHeader());
    }

    // Get auth header with token
    private getAuthHeader() {
        return {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token")
            }
        };
    }

    // Get auth header for FormData requests
    private getFormDataAuthHeader(): AxiosRequestConfig {
        return {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + sessionStorage.getItem("token")
            }
        };
    }
}

export const vacationService = new VacationService();
