import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

// Auth
export const loginUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
    })
    return response.data  // returns { access_token, token_type }
}

export const registerUser = async (email, username, password) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
        email,
        username,
        password
    })
    return response.data
}

// Portfolio — all need token in header
export const getPortfolio = async (token) => {
    const response = await axios.get(`${BASE_URL}/portfolio/`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

export const addStock = async (token, ticker, shares, buy_price) => {
    const response = await axios.post(
        `${BASE_URL}/portfolio/add`,
        { ticker, shares, buy_price },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const removeStock = async (token, itemId) => {
    const response = await axios.delete(`${BASE_URL}/portfolio/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

export const analysePortfolio = async (token) => {
    const response = await axios.get(`${BASE_URL}/portfolio/analyse`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}