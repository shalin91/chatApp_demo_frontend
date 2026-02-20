import axios from 'axios';
import { BASE_URL } from '../../constants';

const API_URL = `${BASE_URL}/auth`;

// Register user
const register = async (userData) => {
    console.log('[AuthService] Registering user at:', `${API_URL}/register`);
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log('[AuthService] Registration Response:', response.status);
    return response.data;
};


// Login user
const login = async (userData) => {
    console.log('[AuthService] Logging in user at:', `${API_URL}/login`);
    const response = await axios.post(`${API_URL}/login`, userData);
    console.log('[AuthService] Login Response:', response.status);
    return response.data;
};


// Get user profile
const getProfile = async (token) => {
    console.log('[AuthService] Fetching profile...');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/profile`, config);
    console.log('[AuthService] Profile Response:', response.status);
    return response.data;
};


// Get all users
const getAllUsers = async (token) => {
    console.log('[AuthService] Fetching all users...');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/users`, config);
    console.log('[AuthService] Users Found:', response.data.length);
    return response.data;
};


// Logout user
const logout = async (token) => {
    console.log('[AuthService] Triggering server logout...');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(`${API_URL}/logout`, {}, config);
    console.log('[AuthService] Logout Response:', response.status);
    return response.data;
};


const authService = {
    register,
    login,
    getProfile,
    getAllUsers,
    logout,
};


export default authService;
