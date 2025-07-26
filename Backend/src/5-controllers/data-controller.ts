import express, { NextFunction, Request, Response } from "express";
import { dataService } from "../4-services/data-service";
import { UploadedFile } from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import path from "path";
import { verifyAdmin, verifyLoggedIn } from "../6-middleware/security-middleware";
import { VacationModel } from "../3-models/vacation-model";

class DataController {

    public readonly router = express.Router();

    public constructor() {
        this.router.get("/vacations", this.getAllVacations);
        this.router.post("/vacations", verifyLoggedIn, verifyAdmin, this.addVacation);
        this.router.delete("/vacations/:_id", verifyLoggedIn, verifyAdmin, this.deleteVacation);
        this.router.put("/vacations/:_id", verifyLoggedIn, verifyAdmin, this.updateVacation);
        this.router.get("/vacations/search", this.searchVacations);
        this.router.get("/vacations/search-by-like", this.getVacationsByLikes);
        this.router.get("/vacations/:_id", this.getOneVacation);

    }

    // ______________________________________________________________________________

    private async getAllVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const data = await dataService.getAllVacations();
            response.json(data);
        }
        catch (err: any) { next(err); }
    }

    // ______________________________________________________________________________

    private async addVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const vacation = request.body;

            if (request.files?.image) {
                const image = request.files.image as UploadedFile;
                const absolutePath = path.join(__dirname, "..", "1-assets", "images");
                vacation.imageName = await fileSaver.add(image, absolutePath);
            }

            if (!vacation.imageName) {
                vacation.imageName = "default.png";
            }

            const savedVacation = await dataService.addVacation(vacation);
            response.status(201).json(savedVacation);
        }
        catch (err: any) { next(err); }
    }

    // ______________________________________________________________________________


    private async deleteVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params._id;
            await dataService.deleteVacation(_id);
            response.sendStatus(204); // No Content
        }
        catch (err: any) { next(err); }
    }

    // ______________________________________________________________________________


    private async updateVacation(request: Request, response: Response, next: NextFunction) {
        try {
            request.body._id = request.params._id;

            
            if (request.files?.image) {
                const image = request.files.image as UploadedFile;
                const absolutePath = path.join(__dirname, "..", "1-assets", "images");
                
                request.body.imageName = await fileSaver.add(image, absolutePath);
            }

            if (!request.body.imageName) {
                const existingVacation = await dataService.getOneVacation(request.body._id);
                request.body.imageName = existingVacation?.imageName || "default.jpg";
            }

            

            const vacation = await dataService.updateVacation(request.body);

            response.json(vacation);
        }
        catch (err: any) { next(err); }
    }

    // ______________________________________________________________________________


    private async searchVacations(request: Request, response: Response, next: NextFunction) {
        try {
            const minPrice = +request.query.minPrice || 0;
            const maxPrice = +request.query.maxPrice || 10000;
            const startDate = request.query.startDate ? new Date(request.query.startDate as string) : null;
            const endDate = request.query.endDate ? new Date(request.query.endDate as string) : null;
            const sortOrder = request.query.sort === "desc" ? -1 : 1;

            const filter: any = {
                price: { $gte: minPrice, $lte: maxPrice }
            };

            if (startDate) filter.startDate = { $gte: startDate };
            if (endDate) filter.endDate = { ...filter.endDate, $lte: endDate };

            const vacations = await VacationModel.find(filter).sort({ price: sortOrder }).exec();
            response.json(vacations);
        }
        catch (err: any) { next(err); }
    }

    // ______________________________________________________________________________

    private async getVacationsByLikes(request: Request, response: Response, next: NextFunction) {
        try {
            const vacations = await dataService.getVacationsSortedByLikes();
            response.json(vacations);
        } catch (err: any) {
            next(err);
        }
    }

    // ______________________________________________________________________________

    private async getOneVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const _id = request.params._id;
            const vacation = await dataService.getOneVacation(_id);
            if (!vacation) return response.sendStatus(404);
            response.json(vacation);
        }
        catch (err: any) {
            next(err);
        }
    }

}

export const dataController = new DataController();
