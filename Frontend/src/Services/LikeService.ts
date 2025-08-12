import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { VacationModel } from "../Models/VacationModel";
import { vacationService } from "../Services/VacationService";

class LikeService {

    // Get auth token header
    private getAuthHeader() {
        return {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token")
            }
        };
    }

    // Like a vacation
    public async like(vacationId: string): Promise<void> {
        await axios.post(appConfig.likesUrl, { vacationId }, this.getAuthHeader());
    }


    // Unlike a vacation
    public async unlike(vacationId: string): Promise<void> {
        await axios.delete(`${appConfig.likesUrl}/${vacationId}`, this.getAuthHeader());
    }


    // Get vacation IDs liked by the user
    public async getUserLikes(): Promise<string[]> {
        const response = await axios.get<string[]>(appConfig.likesUrl + "user", this.getAuthHeader());
        return response.data;
    }


    // Get number of likes per vacation
    public async getLikesCountPerVacation(): Promise<{ vacationId: string, count: number }[]> {
        const response = await axios.get(appConfig.likesUrl + "per-vacation", this.getAuthHeader());
        return response.data;
    }

    
    // Load all vacations with their like counts
    public async loadVacationsWithLikes(): Promise<VacationModel[]> {
        const vacations = await vacationService.getAllVacations();
        const likesCount = await this.getLikesCountPerVacation();

        return vacations.map(v => {
            const match = likesCount.find(l => l.vacationId === v._id);
            return Object.assign(new VacationModel(), {
                ...v,
                likesCount: match?.count || 0
            });
        });
    }
}

export const likesService = new LikeService();
