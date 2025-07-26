import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { CredentialsModel } from "../Models/CredentialsModel";
import { appConfig } from "../Utils/AppConfig";

class AuthService {

    // Register a new user
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post(appConfig.registerUrl, user);
        const token = response.data.token;
        sessionStorage.setItem("token", token);
    }


    // Login and store JWT token
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post(appConfig.loginUrl, credentials);
        const token = response.data.token;
        sessionStorage.setItem("token", token);
    }


    // Logout and remove token
    public logout(): void {
        sessionStorage.removeItem("token");
    }


    // Get JWT token from sessionStorage
    public getToken(): string | null {
        return sessionStorage.getItem("token");
    }


    // Check if user is logged in
    public isLoggedIn(): boolean {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return false;

            const payload = this.decodeToken(token);
            return Math.floor(Date.now() / 1000) < payload?.exp;
        } catch {
            return false;
        }
    }


    // Check if the user has Admin role
    public isAdmin(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = this.decodeToken(token);
            return payload?.role === "Admin";
        } catch {
            return false;
        }
    }


    // Get user ID from token
    public getUserId(): string | null {
        try {
            const payload = this.decodeToken(this.getToken());
            return payload?._id || null;
        } catch {
            return null;
        }
    }


    // Get user's first name (from email before @)
    public getDisplayName(): string {
        try {
            const token = this.getToken();
            if (!token) return "";

            const payload = this.decodeToken(token);

            if (payload?.role === "Admin") return "Admin";

            const first = payload?.firstName || "";
            const last = payload?.lastName || "";

            const firstName = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
            const lastName = last.charAt(0).toUpperCase() + last.slice(1).toLowerCase();

            return `${firstName} ${lastName}`.trim();
        } catch {
            return "";
        }
    }

    // Decode JWT payload safely
    private decodeToken(token: string | null): any {
        if (!token) return null;
        const base64 = token.split(".")[1];
        const json = atob(base64);
        return JSON.parse(json);
    }
}


export const authService = new AuthService();