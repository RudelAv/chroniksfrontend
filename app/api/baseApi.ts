const headerWithoutToken = {
    "Content-Type": "application/json",
  };
  
  function getHeader(token: string | undefined) {
    if (!token) {
      return headerWithoutToken;
    } else {
      return {
        ...headerWithoutToken,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  
  export default class BackendApi {
    url: string;
  
    constructor(url: string) {
      this.url = url;
    }
  
    async handleResponse(response: Response) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `HTTP Error: ${response.status} ${response.statusText}`
        );
      }
  
      return response.json();
    }
  
    async get(endpoint: string, token?: string) {
      const response = await fetch(`${this.url}${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return this.handleResponse(response);
    }
  
    async post(endpoint: string, data: any, token?: string) {
      const response = await fetch(`${this.url}${endpoint}`, {
        method: "POST",
        headers: getHeader(token),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async put(endpoint: string, data: any, token?: string) {
      console.log("token", token);
      const response = await fetch(`${this.url}${endpoint}`, {
        method: "PUT",
        headers: getHeader(token),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    }
  
    async delete(endpoint: string, token?: string) {
      const response = await fetch(`${this.url}${endpoint}`, {
        method: "DELETE",
        headers: getHeader(token),
      });
      return this.handleResponse(response);
    }

    async postSecure(data: any, endpoint = '', headers = {}) {
        return await fetch(`${this.url}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
    }

    async putFormData(endpoint: string, formData: FormData, token?: string) {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`${this.url}${endpoint}`, {
            method: "PUT",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: formData
        });
        return this.handleResponse(response);
    }

    async postFormData(endpoint: string, formData: FormData, token?: string) {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(`${this.url}${endpoint}`, {
          method: "POST",
          headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: formData
      });
      return this.handleResponse(response);
  }
  }
  