import mongoose from "mongoose";

export interface IVacation extends mongoose.Document {
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    imageName: string;
}

const VacationSchema = new mongoose.Schema<IVacation>({
    destination: {
        type: String,
        required: [true, "Missing destination"],
        minlength: [3, "Destination must be at least 3 characters"],
        maxlength: [50, "Destination must be at most 50 characters"]
    },

    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Description must be at least 5 characters"],
        maxlength: [100, "Description must be at most 100 characters"]
    },

    startDate: {
        type: Date,
        required: [true, "Missing start date"],
    },
    endDate: {
        type: Date,
        required: [true, "Missing end date"],
    },
    price: {
        type: Number,
        required: [true, "Missing price"],
        min: [1, "Price can't be negative"],
        max: [99999, "Price can't be above 99,999"],
    },
    imageName: {
        type: String,
        required: [true, "Missing image name"],
    },
}, {
    versionKey: false,
    timestamps: true,
});

export const VacationModel = mongoose.model<IVacation>("Vacation", VacationSchema);
