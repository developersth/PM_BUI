import axios from "./axios";
class apiService extends axios {
  async getAllUsers() {
    const { data } = await this.get('/api/users')
    return data;
  }
  async getNameUsers() {
    const { data } = await this.get('/api/users/getNameUsers')
    return data;
  }
  async addUsers(body) {
    const { data } = await this.create('/api/users', body)
    return data;
  }
  async deleteUsers(id) {
    const { data } = await this.delete(`/api/users/${id}`)
    return data;
  }
  async updateUsers(id, body) {
    const { data } = await this.update(`api/users/${id}`, body)
    return data;
  }
  // Documents
  async getAllDocuments() {
    const { data } = await this.get('api/documents')
    return data;
  }
  async getDocumentsById(id) {
    const { data } = await this.get(`api/documents/${id}`)
    return data;
  }
  async addDocuments(body) {
    const { data } = await this.create('api/documents', body)
    return data;
  }
  async editDocuments(id,body) {
    const { data } = await this.update(`api/documents/${id}`, body)
    return data;
  }
  async deleteDocuments(id) {
    const { data } = await this.delete(`api/documents/${id}`)
    return data;
  }
  async deleteDocumentsItems(items) {
    const { data } = await this.delete(`api/documents/`,items)
    return data;
  }
  //Supplier
  async addSupplier(body) {
    const { data } = await this.create('api/supplier', body)
    return data;
  }
  async getSupplier() {
    const { data } = await this.get('api/supplier', body)
    return data;
  }
}

export default apiService;