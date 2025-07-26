import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "../3-models/user-models";
import { appConfig } from "./app-config";

class Cyber {

    private readonly saltRounds = 10;

    public hash(plainText: string): string {
        return bcrypt.hashSync(plainText, this.saltRounds);
    }

    public compare(plainText: string, hash: string): boolean {
        return bcrypt.compareSync(plainText, hash);
    }

    public getNewToken(user: IUser): string {
        const payload = {
            _id: user._id,
            role: user.role,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName

        };

        const options: SignOptions = { expiresIn: "3h" };

        return jwt.sign(payload, appConfig.jwtSecret, options);
    }

    public validateToken(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        } catch {
            return false;
        }
    }

    public validateAdmin(token: string): boolean {
        try {
            const payload = jwt.decode(token) as { role: string };
            return payload?.role === "Admin";
        } catch {
            return false;
        }
    }
}

export const cyber = new Cyber();
