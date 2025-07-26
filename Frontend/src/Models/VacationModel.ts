import { appConfig } from "../Utils/AppConfig";

export class VacationModel {
    public _id: string;
    public destination: string;
    public description: string;
    public price: number;
    public image: File; 
    public imageName: string; 
    public startDate: string;
    public endDate: string;
    public isLiked: boolean;
    public likesCount: number;

    public get imageUrl(): string {
        return appConfig.vacationImagesUrl + this.imageName;
    }
}