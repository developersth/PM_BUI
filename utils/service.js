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
export function editPayment(id,data) {
    const url = `${HOST_SERVER}/api/payments/${id}`
    return request('put', url, data, true)
}
export function deletePayment(id) {
    const url = `${HOST_SERVER}/api/payments/${id}`
    return request('delete', url, {}, true)
}
export function deletePaymentItems(data) {
    const url = `${HOST_SERVER}/api/payments/delete/item`
    return request('delete', url, data, true)
}

//Documents
export function getAllDocuments() {
    const url = `${HOST_SERVER}/api/documents`
    return request('get', url, {}, true)
}
export function getBuyers() {
    const url = `${HOST_SERVER}/api/buyers`
    return request('get', url, {}, true)
}
export function addSupplier(data) {
    const url = `${HOST_SERVER}/api/supplier`
    return request('post', url, data, true)
}
export function getPaymentTerm() {
    const url = `${HOST_SERVER}/api/paymentterm`
    return request('get', url, {}, true)
}
export function addPaymentTerm(data) {
    const url = `${HOST_SERVER}/api/paymentterm`
    return request('post', url, data, true)
}
export function getDocumentsById(id) {
    const url = `${HOST_SERVER}/api/documents/${id}`
    return request('get', url, {}, true)
}
export function addDocuments(data) {
    const url = `${HOST_SERVER}/api/documents`
    return request('post', url, data, true)
}
export function editDocuments(id,data) {
    const url = `${HOST_SERVER}/api/documents/${id}`
    return request('put', url, data, true)
}
export function deleteDocuments(id) {
    const url = `${HOST_SERVER}/api/documents/${id}`
    return request('delete', url, {}, true)
}
export function deleteDocumentsItems(data) {
    const url = `${HOST_SERVER}/api/documents/delete/item`
    return request('delete', url, data, true)
}
//Buyer
export function getBuyerAll() {
    const url = `${HOST_SERVER}/api/buyers`
    return request('get', url, {}, true)
}
export function addBuyer(data) {
    const url = `${HOST_SERVER}/api/buyers`
    return request('post', url, data, true)
}
export function deleteBuyer(id) {
    const url = `${HOST_SERVER}/api/buyers/${id}`
    return request('delete', url, {}, true)
}
export function editBuyer(id,data) {
    const url = `${HOST_SERVER}/api/buyers/${id}`
    return request('put', url, data, true)
}
//Delivery Term
export function getDeliveryTermAll() {
    const url = `${HOST_SERVER}/api/deliveryterms`
    return request('get', url, {}, true)
}
export function addDeliveryTerm(data) {
    const url = `${HOST_SERVER}/api/deliveryterms`
    return request('post', url, data, true)
}
export function deleteDeliveryTerm() {
    const url = `${HOST_SERVER}/api/deliveryterms/${id}`
    return request('delete', url, {}, true)
}
export function editDeliveryTerm(id,data) {
    const url = `${HOST_SERVER}/api/deliveryterms/${id}`
    return request('put', url, data, true)
}
//freightforworders	
export function getFreightForwordersAll() {
    const url = `${HOST_SERVER}/api/freightforworders`
    return request('get', url, {}, true)
}
export function addFreightForwarders(data) {
    const url = `${HOST_SERVER}/api/freightforworders`
    return request('post', url, data, true)
}
export function deleteFreightForworders() {
    const url = `${HOST_SERVER}/api/freightforworders/${id}`
    return request('delete', url, {}, true)
}
export function editFreightForworders(id,data) {
    const url = `${HOST_SERVER}/api/freightforworders/${id}`
    return request('put', url, data, true)
}