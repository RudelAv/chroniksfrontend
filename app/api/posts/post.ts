import BackendApi from "../baseApi";

export default class ApiPost {
    static url = process.env.NEXT_PUBLIC_API_URL || "";

    static async createPost(accessToken: any, formData: FormData) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.postFormData("/", formData, accessToken);
    }

    static async updatePost(accessToken: any, formData: FormData) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.putFormData("/", formData, accessToken);
    }

    static async getPosts(accessToken: any) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.get("/", accessToken);
    }

    static async getPost(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.get(`/${postId}`, accessToken);
    }

    static async getPostAuthor(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.get(`/${postId}/author`, accessToken);
    }
}