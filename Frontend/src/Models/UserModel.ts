export class UserModel {
    public userId?: number;
    public firstName?: string;
    public lastName?: string;
    public email!: string;
    public password!: string;
    public role?: "User" | "Admin";
    public token?: string;

}
