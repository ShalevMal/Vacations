class AppConfig {

private readonly apiUrl: string = 
    import.meta.env.MODE === "development"
        ? "http://localhost:4000"
        : "http://host.docker.internal:4001";
    
    constructor() {
    console.log("📡 API URL:", this.apiUrl);
}

    public readonly addUrl = this.apiUrl + "/api/images/";
    public readonly vacationImagesUrl = this.apiUrl + "/api/images/";
    public readonly vacationsUrl = this.apiUrl + "/api/vacations/";
    public readonly authUrl = this.apiUrl + "/api/auth/";
    public readonly registerUrl = this.apiUrl + "/api/users/register";
    public readonly loginUrl = this.apiUrl + "/api/users/login";
    public readonly likesUrl = this.apiUrl + "/api/likes";
}

export const appConfig = new AppConfig();
