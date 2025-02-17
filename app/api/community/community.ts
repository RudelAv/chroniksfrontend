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

    static async createEvent(accessToken: any, communityId: string, formData: FormData) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.postFormData(`/${communityId}/event`, formData, accessToken);
    }

    static async registerForEvent(accessToken: any, communityId: string, eventId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.post(`/${communityId}/event/${eventId}/register`, {}, accessToken);
    }

    static async unregisterFromEvent(accessToken: any, communityId: string, eventId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.delete(`/${communityId}/event/${eventId}/register`, accessToken);
    }

    static async getCommunityPosts(accessToken: any, communityId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.get(`/${communityId}/posts`, accessToken);
    }

    static async createPost(accessToken: any, communityId: string, formData: FormData) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.postFormData(`/${communityId}/post`, formData, accessToken);
    }

    static async hasAdminAccess(accessToken: any, communityId: string) {
        const api = new BackendApi(`${this.url}/community`);
        return await api.get(`/${communityId}/admin`, accessToken);
    }

    static async getCommunityMembers(accessToken: any, communityId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit; // Calcul du skip en fonction de la page
        const api = new BackendApi(`${this.url}/community`);
        const response = await api.get(`/${communityId}/members?skip=${skip}&limit=${limit}`, accessToken);
        return response.members;
    }
}