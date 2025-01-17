import BackendApi from "../baseApi";

export default class ApiAuthSignUp {
    static baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL + "/signup";

    static async signupWithEmail(data : {
        email: string,
        user_type: string,
        password: string,
        password_confirm:string,
    } & any) {
        const userData = {...data, provider: "Email", user_type : 'User'}
        const api = new BackendApi(`${this.baseUrl}/email`)
        return await api.post(userData)
    }

    static async signupWithExternalAPI(data: {
        provider: string;
        accesstoken: string | undefined;
        email: string | null | undefined;
        username: string | null | undefined
    }) {
        const api = new BackendApi(`${this.baseUrl}/oauth`);
        return await api.post(data)
    }
}