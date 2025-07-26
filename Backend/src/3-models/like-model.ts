import mongoose from "mongoose";

export interface ILike extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  vacationId: mongoose.Schema.Types.ObjectId;
}

const LikeSchema = new mongoose.Schema<ILike>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Missing user ID"],
    ref: "User",
  },
  vacationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Missing vacation ID"],
    ref: "Vacation",
  },
}, {
  versionKey: false,
  timestamps: true,
});

LikeSchema.index({ userId: 1, vacationId: 1 }, { unique: true });

export const LikeModel = mongoose.model<ILike>("Like", LikeSchema);
