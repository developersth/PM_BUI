import axios from "./axios";
class apiService extends axios {
  async getAllUsers() {
    const  {data}  = await this.get('/api/users')
    return data;
  }
  async addUsers(body) {
    const  {data}  = await this.create('/api/users',body)
    return data;
  }
  async deleteUsers(id) {
    const  {data}  = await this.delete(`/api/users/${id}`)
    return data;
  }
  async updateUsers(id,body) {
    const  {data}  = await this.update(`/api/users/${id}`,body)
    return data;
  }
}

export default apiService;