import { request } from "./api";
const HOST_SERVER = 'http://localhost:5000'
export function getUserAll() {
    const url = `${HOST_SERVER}/api/users`
    return request('get', url, {}, true)

}
export function deleteUsers(id) {
    const url = `${HOST_SERVER}/api/users/${id}`
    return request('delete', url, {}, true)
  }