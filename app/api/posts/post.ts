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

    static async deletePost(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.delete(`/${postId}`, accessToken);
    }

    static async getPostComments(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.get(`/${postId}/comments`, accessToken);
    }

    static async getPostLikes(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.get(`/${postId}/likes`, accessToken);
    }

    static async commentPost(accessToken: any, postId: string, content: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.post(`/${postId}/comment`, { content }, accessToken);
    }

    static async likePost(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.post(`/${postId}/like`, {}, accessToken);
    }

    static async unLikePost(accessToken: any, postId: string) {
        const api = new BackendApi(`${this.url}/post`);
        return await api.delete(`/${postId}/dislike`, accessToken);
    }

    static async searchPost(accessToken: any, query: string, tags?: string[]) {
        const api = new BackendApi(`${this.url}/post`);
        const searchParams = new URLSearchParams({ q: query });
        if (tags?.length) {
            searchParams.append('tags', tags.join(','));
        }
        return await api.get(`/search?${searchParams.toString()}`, accessToken);
    }
}
