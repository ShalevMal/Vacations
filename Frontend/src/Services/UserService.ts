import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { UserModel } from "../Models/UserModel";
import { CredentialsModel } from "../Models/CredentialsModel";
import { store } from "../Redux/Store";
import { authActions } from "../Redux/UserState";

class UserService {

    // Register a new user and log them in
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(appConfig.authUrl + "register", user);
        const token = response.data;

        this.saveToken(token);
        this.setAuthorizationHeader(token);

        const userDetails = this.getUserFromToken(token);
        store.dispatch(authActions.login(userDetails));
    }


    // Login user and save token
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.authUrl + "login", credentials);
        const token = response.data;

        this.saveToken(token);
        this.setAuthorizationHeader(token);

        const userDetails = this.getUserFromToken(token);
        store.dispatch(authActions.login(userDetails));
    }


    // Logout user and clear session
    public logout(): void {
        sessionStorage.removeItem("token");
        store.dispatch(authActions.logout());
    }


    // Get token from storage
    public getToken(): string | null {
        return sessionStorage.getItem("token");
    }


    // Save token to sessionStorage
    private saveToken(token: string): void {
        sessionStorage.setItem("token", token);
    }


    // Set default Authorization header for Axios
    private setAuthorizationHeader(token: string): void {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }


    // Decode JWT and extract user details
    private getUserFromToken(token: string): UserModel {
        const payload = token.split(".")[1];
        const json = atob(payload);
        const user = JSON.parse(json);

            console.log("Decoded token:", user); 


        return {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "", // not needed
            role: user.role
        };
    }
}

export const userService = new UserService();
