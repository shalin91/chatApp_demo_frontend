import axios from 'axios';
import { BASE_URL } from '../../constants';

const API_URL = `${BASE_URL}/chat`;

// Create or get conversation
const createConversation = async (receiverId, token) => {
    console.log(`[ChatService] Requesting conversation with: ${receiverId}`);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(`${API_URL}/conversation`, { receiverId }, config);
    return response.data;
};

// Get messages for a conversation
const getMessages = async (conversationId, token) => {
    console.log(`[ChatService] Fetching messages for: ${conversationId}`);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/messages/${conversationId}`, config);
    return response.data;
};

// Get my conversations
const getMyConversations = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/conversations`, config);
    return response.data;
};

const chatService = {
    createConversation,
    getMessages,
    getMyConversations,
};

export default chatService;
