import express, { Request, Response, NextFunction } from "express";
import { likeService } from "../4-services/like-service";
import { verifyLoggedIn } from "../6-middleware/security-middleware";

class LikeController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/likes", verifyLoggedIn, this.addLike);
        this.router.delete("/likes/:vacationId", verifyLoggedIn, this.removeLike);
        this.router.get("/likes/per-vacation", this.getLikesCountPerVacation);
        this.router.get("/likes/is-liked/:vacationId", verifyLoggedIn, this.isLiked);
        this.router.get("/likes/user", verifyLoggedIn, this.getUserLikes);
    }

    private async addLike(request: Request, response: Response, next: NextFunction) {
        try {
            const user = (request as any).user;
            const userId = user._id;

            const { vacationId } = request.body;

            const like = await likeService.addLike(userId, vacationId);
            response.status(201).json(like);
        }
        catch (err: any) { next(err); }
    }

    // _____________________________________________________________________

    private async removeLike(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as any).user._id;
            const vacationId = request.params.vacationId;

            await likeService.removeLike(userId, vacationId);
            response.sendStatus(204);
        }
        catch (err: any) { next(err); }
    }

    // _____________________________________________________________________

    private async getLikesCountPerVacation(request: Request, response: Response, next: NextFunction) {
        try {
            const data = await likeService.getLikesCountPerVacation();
            response.json(data);
        }
        catch (err: any) { next(err); }
    }

    // _____________________________________________________________________

    private async isLiked(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as any).user._id;
            const vacationId = request.params.vacationId;
            const isLiked = await likeService.isUserLikedVacation(userId, vacationId);
            response.json({ isLiked });
        }
        catch (err: any) { next(err); }
    }

    // _____________________________________________________________________

    private async getUserLikes(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = (request as any).user._id;
            const likedVacationIds = await likeService.getLikedVacationsByUser(userId);
            response.json(likedVacationIds);
        }
        catch (err: any) { next(err); }
    }

}

export const likeController = new LikeController();
