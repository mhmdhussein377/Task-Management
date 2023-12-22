import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        localStorage.setItem("authToken", token)
    } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("authToken")
    }
}

const getAuthToken = () => {
    return localStorage.getItem("authToken")
}

const makeRequest = async(method, url, data = null, errorHandler = null) => {
    try {
            const token = getAuthToken()
            const config = {}
            if (token) {
                config.headers = {
                    'Authorization': `Bearer ${token}`
                }
            }

        const response = await axios({
            method,
            url: `${baseURL}${url}`,
            data,
            ...config
        })

        return response.data
    } catch (error) {
        if (errorHandler && error instanceof Error) {
            errorHandler(error)
        }
        return null
    }
}

const getRequest = async(url, errorHandler = null) => {
    return makeRequest("GET", url, null, errorHandler)
}

const postRequest = async(url, data = null, errorHandler = null) => {
    return makeRequest("POST", url, data, errorHandler)
}

const updateRequest = async(url, data = null, errorHandler = null) => {
    return makeRequest("PUT", url, data, errorHandler)
}

const deleteRequest = async(url, errorHandler = null) => {
    return makeRequest("DELETE", url, null, errorHandler)
}

export {getRequest, postRequest, updateRequest, deleteRequest, setAuthToken}