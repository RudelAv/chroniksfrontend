import BackendApi from "../baseApi";

export default class ApiCommunity {
    static url = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    static async createCommunity(accessToken: any, formData: FormData) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.postFormData("/", formData, accessToken);
    }

    static async getCommunities(accessToken: any) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.get("/", accessToken);
    }

    static async getCommunity(accessToken: any, communityId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.get(`/${communityId}`, accessToken);
    }

    static async updateCommunity(accessToken: any, communityId: string, formData: FormData) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.putFormData(`/${communityId}`, formData, accessToken);
    }

    static async deleteCommunity(accessToken: any, communityId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.delete(`/${communityId}`, accessToken);
    }

    static async joinCommunity(accessToken: any, communityId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.post(`/${communityId}/join`, {}, accessToken);
    }

    static async leaveCommunity(accessToken: any, communityId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.delete(`/${communityId}/leave`, accessToken);
    }   
}