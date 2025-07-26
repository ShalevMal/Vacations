import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ClientError } from "../3-models/client-error";
import { StatusCode } from "../3-models/enums";
import { appConfig } from "../2-utils/app-config";

export function verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {
    try {
        const header = request.header("authorization");
        if (!header) throw new ClientError(StatusCode.Unauthorized, "Missing token");

        const token = header.substring(7); // Remove "Bearer "
        if (!token) throw new ClientError(StatusCode.Unauthorized, "Invalid token");

        const payload: any = jwt.verify(token, appConfig.jwtSecret);
        (request as any).user = payload;

        next();
    }
    catch (err: any) {
        next(new ClientError(StatusCode.Unauthorized, "You are not logged in"));
    }
}

export function verifyAdmin(request: Request, response: Response, next: NextFunction): void {
    try {
        const header = request.header("authorization");
        const token = header?.substring(7);
        const payload: any = jwt.decode(token);

        if (!payload || payload.role !== "Admin") {
            throw new ClientError(StatusCode.Forbidden, "You are not admin");
        }

        next();
    }
    catch (err: any) {
        next(new ClientError(StatusCode.Forbidden, "You are not admin"));
    }
}
