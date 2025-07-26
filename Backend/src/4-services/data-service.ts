import { VacationModel, IVacation } from "../3-models/vacation-model";
import { ClientError } from "../3-models/client-error";
import { StatusCode } from "../3-models/enums";
import fs from "fs";
import path from "path";
import { LikeModel } from "../3-models/like-model";

class DataService {

    public async getAllVacations(): Promise<IVacation[]> {
        return await VacationModel.find().sort({ startDate: 1 }).exec();
    }

    // ----------------------------------------------------
    
    public async getOneVacation(_id: string): Promise<IVacation> {
        const vacation = await VacationModel.findById(_id).exec();
        return vacation; 
    }

    // ----------------------------------------------------
public async addVacation(vacation: Partial<IVacation>): Promise<IVacation> {
    const now = new Date();
    if (new Date(vacation.startDate) < now)
        throw new ClientError(StatusCode.BadRequest, "Start date cannot be in the past.");

    if (new Date(vacation.endDate) < new Date(vacation.startDate))
        throw new ClientError(StatusCode.BadRequest, "End date must be after start date.");

    try {
        const addedVacation = new VacationModel(vacation);
        await addedVacation.save();
        return addedVacation;
    } catch (err: any) {
        if (err.name === "ValidationError") {
            throw new ClientError(StatusCode.BadRequest, err.message);
        }
        throw new ClientError(StatusCode.ServerError, "Something went wrong while saving vacation.");
    }
}

    // ___________________________________________________________________________

public async deleteVacation(_id: string): Promise<void> {

    const vacation = await VacationModel.findById(_id);
    if (!vacation)
        throw new ClientError(StatusCode.NotFound, "Vacation not found");

    const imageName = vacation.imageName;

    if (imageName && imageName.toLowerCase() !== "default.png") {
        const imagePath = path.join(__dirname, "..", "1-assets", "images", imageName);
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (err: any) {
                console.warn("⚠️ Failed to delete image:", err.message);
            }
        }
    }

    await VacationModel.findByIdAndDelete(_id);
}


    // ___________________________________________________________________________

public async updateVacation(vacation: IVacation): Promise<IVacation> {
    const existingVacation = await VacationModel.findById(vacation._id);
    if (!existingVacation)
        throw new ClientError(StatusCode.NotFound, "Vacation not found");

    if (
        vacation.imageName &&
        vacation.imageName !== existingVacation.imageName &&
        existingVacation.imageName?.toLowerCase() !== "default.png"
    ) {
        const imagePath = path.join(__dirname, "..", "1-assets", "images", existingVacation.imageName);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const updated = await VacationModel.findByIdAndUpdate(
        vacation._id,
        vacation,
        { new: true, runValidators: true }
    );

    if (!updated)
        throw new ClientError(StatusCode.NotFound, "Vacation not found");

    return updated;
}



    // ___________________________________________________________________________

    public async getVacationsSortedByLikes(): Promise<any[]> {
        return LikeModel.aggregate([
            { $group: { _id: "$vacationId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            {
                $lookup: {
                    from: "vacations",
                    localField: "_id",
                    foreignField: "_id",
                    as: "vacation"
                }
            },
            { $unwind: "$vacation" },
            {
                $project: {
                    _id: "$vacation._id",
                    destination: "$vacation.destination",
                    description: "$vacation.description",
                    startDate: "$vacation.startDate",
                    endDate: "$vacation.endDate",
                    price: "$vacation.price",
                    imageName: "$vacation.imageName",
                    likes: "$count"
                }
            }
        ]);



    }
}

export const dataService = new DataService();
