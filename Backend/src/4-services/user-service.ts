import { UserModel, IUser, UserRole } from "../3-models/user-models";
import { ClientError } from "../3-models/client-error";
import { StatusCode } from "../3-models/enums";
import { cyber } from "../2-utils/cyber";

class UserService {

    // ______________________________________

    public async register(user: IUser): Promise<string> {
        if (!user.firstName || !user.lastName || !user.email || !user.password) {
            throw new ClientError(StatusCode.BadRequest, "Missing registration details");
        }

        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
            throw new ClientError(StatusCode.Conflict, "Email already exists");
        }

        user.password = cyber.hash(user.password);
        const newUser = new UserModel(user);
        await newUser.save();
        const token = cyber.getNewToken(newUser);
        return token;
    }

    // ______________________________________

    public async login(email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new ClientError(StatusCode.BadRequest, "Missing login credentials");
        }

        const user = await UserModel.findOne({ email });
        if (!user || !cyber.compare(password, user.password)) {
            throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password");
        }

        const token = cyber.getNewToken(user);
        return token;
    }
}

export const userService = new UserService();
