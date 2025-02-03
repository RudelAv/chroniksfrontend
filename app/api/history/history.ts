import BackendApi from "../baseApi";

export default class HistoryApi {
    static url = process.env.NEXT_PUBLIC_BACKEND_URL;

    static async getHistory(accessToken: string) {
        const api = new BackendApi(`${this.url}`);
        return await api.get("/history/viewed-post", accessToken);
    }
}   