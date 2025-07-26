import dotenv from "dotenv";
dotenv.config();

class AppConfig {

    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly isStage = process.env.ENVIRONMENT === "stage";
    public readonly isDocker = process.env.ENVIRONMENT === "docker";

    public readonly port = +process.env.PORT;

    public readonly mongodbConnectionString = this.getMongoConnectionString();

    public readonly jwtSecret = process.env.JWT_SECRET;
    public readonly hashSalt = process.env.HASH_SALT;

    private getMongoConnectionString(): string {
        if (process.env.MONGO_CONNECTION_STRING) return process.env.MONGO_CONNECTION_STRING;

        if (this.isDocker) return "mongodb://database-service:27017/vacations";
        return "mongodb://127.0.0.1:27017/vacations";
    }
}

export const appConfig = new AppConfig();
