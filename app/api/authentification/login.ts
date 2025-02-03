import BackendApi from "../baseApi";

export default class ApiLogin {
    static url = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    static async loginEmail(email: string, password: string) {
        console.log("login", email, password);
        const api = new BackendApi(ApiLogin.url);
        return await api.post("/signin/email", {
            email,
            password,
            provider: "email",
        });
    }

    static async refresh(refresh: string) {
        const api = new BackendApi(`${this.url}/token`);
        return await api.postSecure({}, "/refresh", {
            Authorization: "Bearer " + refresh,
            "Content-Type": "application/json",
        });
    }

    static async signOut(access: string, refresh: string) {
        const api = new BackendApi(`${this.url}/logout`);
        return await api.postSecure({ accessToken: access, refreshToken: refresh }, "", {
            'Authorization': 'Bearer ' + access,
            'Content-Type': 'application/json'
        });
    }
}
