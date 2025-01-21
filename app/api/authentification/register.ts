import BackendApi from "../baseApi";

export default class ApiAuthSignUp {
    static baseUrl = process.env.NEXT_PUBLIC_API_URL + "/signup";

    static async signupWithEmail(data: {
        name: string,
        email: string,
        password: string,
        confirmPassword: string,
    }) {
        const userData = {...data, provider: "email", user_type: 'User'}
        const api = new BackendApi(`${this.baseUrl}/email`)
        return await api.post("", userData) 
    }

    static async signupWithExternalAPI(data: {
        provider: string;
        accesstoken: string | undefined;
        email: string | null | undefined;
        username: string | null | undefined
    }) {
        const api = new BackendApi(`${this.baseUrl}/oauth`);
        return await api.post("", data)
    }
}