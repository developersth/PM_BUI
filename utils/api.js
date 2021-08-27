import axios from 'axios'
const getToken = function () {
    if (process.server) {
        return
    }
    if (window.$nuxt) {
        return window.$nuxt.$auth.strategy.token.get()
    }
}
export async function request(method, url, data, auth = false) {
    const headers = {}
    console.log(getToken())
    if (auth)
        headers['Authorization'] = getToken()
    try {
        const response = await axios({ method, url, data, headers })
        return response
    } catch (error) {
        return e
    }
}