import express, { Request, Response, NextFunction } from "express";
import { userService } from "../4-services/user-service";
import { StatusCode } from "../3-models/enums";

class UserController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);

    }

    // ____________________________________________________________

    private async register(request: Request, response: Response, next: NextFunction) {
        try {
            const user = request.body;
            const token = await userService.register(user);
            response.status(StatusCode.Created).json({ token });
        }
        catch (err: any) { next(err); }
    }

    // ____________________________________________________________

    private async login(request: Request, response: Response, next: NextFunction) {
        try {
            const { email, password } = request.body;
            const token = await userService.login(email, password);
            response.status(StatusCode.Ok).json({ token });
        }
        catch (err: any) { next(err); }
    }
}

export const userController = new UserController();
