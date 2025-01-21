import BackendApi from "../baseApi";

export default class ApiProfile {
    static url = process.env.NEXT_PUBLIC_API_URL || "";

    static async updatePassword(accessToken: any, updateData: { currentPassword: string; newPassword: string; }) {
        const api = new BackendApi(`${this.url}/profile`);
        return await api.put("/password", updateData, accessToken);
    }
    static async uploadProfileImage(accessToken: any, formData: FormData) {
        const api = new BackendApi(`${this.url}/profile`);
        return await api.putFormData("/", formData, accessToken);
    }

    static async getProfile(accessToken: string) {
        console.log("accessToken2", accessToken)
        const api = new BackendApi(`${this.url}/profile`);
        return await api.get("/", accessToken);
    }

    static async updateProfile(accessToken: string, data: any) {
        console.log("accessToken", accessToken);
        const api = new BackendApi(`${this.url}/profile`);
        return await api.put("/", data, accessToken);
    }
}