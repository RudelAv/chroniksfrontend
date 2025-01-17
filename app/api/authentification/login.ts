import BackendApi from "../baseApi";

export default class ApiLogin {
    static url = "http://localhost:4000/api/v1";

    static async loginEmail(email: string, password: string) {
        console.log("login", email, password);
        const api = new BackendApi(ApiLogin.url);
        const response = await api.post("/signin/email", {
            email,
            password,
            provider: "email",
        });
        return response;
    }

    static async refresh(refresh: string) {
        const api = new BackendApi(`${this.url}/token`);
        return await api.postSecure({}, "/refresh", {
            Authorization: "Bearer " + refresh,
            "Content-Type": "application/json",
        });
    }

    static async signOut({ access, refresh }) {
        const api = new BackendApi(`${this.url}/logout`);
        return await api.postSecure({ accessToken: access, token: access, refreshToken: refresh }, "", {
            'Authorization': 'Bearer ' + access,
            'Content-Type': 'application/json'
        });
    }
}
