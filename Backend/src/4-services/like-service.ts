import { LikeModel, ILike } from "../3-models/like-model";
import { ClientError } from "../3-models/client-error";
import { StatusCode } from "../3-models/enums";

class LikeService {

    public async addLike(userId: string, vacationId: string): Promise<ILike> {

        const existing = await LikeModel.findOne({ userId, vacationId }).exec();
        if (existing) throw new ClientError(StatusCode.Conflict, "Like already exists");

        const newLike = new LikeModel({ userId, vacationId });

        return await newLike.save();
    }

    // _______________________________________________________________________________

    public async removeLike(userId: string, vacationId: string): Promise<void> {
        const result = await LikeModel.findOneAndDelete({ userId, vacationId }).exec();
        if (!result) {
            throw new ClientError(StatusCode.NotFound, "Like not found");
        }
    }

    // _______________________________________________________________________________

    public async getLikesCountPerVacation(): Promise<{ vacationId: string, count: number }[]> {
        return LikeModel.aggregate([
            { $group: { _id: "$vacationId", count: { $sum: 1 } } },
            { $project: { vacationId: "$_id", count: 1, _id: 0 } }
        ]);
    }

    // _______________________________________________________________________________

    public async isUserLikedVacation(userId: string, vacationId: string): Promise<boolean> {
        const like = await LikeModel.findOne({ userId, vacationId }).exec();
        return !!like;
    }

    // _______________________________________________________________________________

    public async getLikedVacationsByUser(userId: string): Promise<string[]> {
    const likes = await LikeModel.find({ userId }, { vacationId: 1, _id: 0 }).exec();
    return likes.map(l => l.vacationId.toString());
}

}

export const likeService = new LikeService();
