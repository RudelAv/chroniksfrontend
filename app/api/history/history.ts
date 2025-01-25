import BackendApi from "../baseApi";

export default class HistoryApi {
    static url = process.env.NEXT_PUBLIC_API_URL;

    static async getHistory(accessToken: string) {
        const api = new BackendApi(`${this.url}`);
        return await api.get("/history/viewed-post", accessToken);
    }
}   