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
      // Vérifiez si le statut HTTP est 2xx
      if (!response.ok) {
        const errorData = await response.json(); // Essayez de récupérer l'erreur JSON
        throw new Error(
          errorData?.message || `HTTP Error: ${response.status} ${response.statusText}`
        );
      }
  
      // Retournez la réponse JSON
      return response.json();
    }
  
    async get(endpoint: string, token?: string) {
      const response = await fetch(`${this.url}${endpoint}`, {
        method: "GET",
        headers: getHeader(token),
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
  }
  