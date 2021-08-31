import { request } from "./api";
const HOST_SERVER = process.env.baseUrl
//Users
export function getUserAll() {
    const url = `${HOST_SERVER}/api/users`
    return request('get', url, {}, true)
}
export function addUsers(data) {
    const url = `${HOST_SERVER}/api/users`
    return request('post', url, data, true)
}
export function deleteUsers(id) {
    const url = `${HOST_SERVER}/api/users/${id}`
    return request('delete', url, {}, true)
}
export function editUsers(id,data) {
    const url = `${HOST_SERVER}/api/users/${id}`
    return request('put', url, data, true)
}
//Document
export function getPaymentTerms() {
    const url = `${HOST_SERVER}/api/paymentterm`
    return request('get', url, {}, true)
  }
//User Role
export function getUserRoles() {
    const url = `${HOST_SERVER}/api/userroles`
    return request('get', url, {}, true)
}
//Payments
export function getPaymentAll() {
    const url = `${HOST_SERVER}/api/payments`
    return request('get', url, {}, true)
}
export function addPayments(data) {
    const url = `${HOST_SERVER}/api/payments`
    return request('post', url, data, true)
}
export function getSupplier() {
    const url = `${HOST_SERVER}/api/supplier`
    return request('get', url, {}, true)
}
export function getFreigh() {
    const url = `${HOST_SERVER}/api/freightforworder`
    return request('get', url, {}, true)
}
export function getPoNo(payto) {
    const url = `${HOST_SERVER}/api/documents/get/getpono?payname=${payto}`
    return request('get', url, {}, true)
}
export function findDataByPoNo(pono) {
    const url = `${HOST_SERVER}/api/documents/pono/${pono}`
    return request('get', url, {}, true)
}
export function getPaymentById(id) {
    const url = `${HOST_SERVER}/api/payments/${id}`
    return request('get', url, {}, true)
}
