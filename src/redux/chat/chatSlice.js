import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from './chatService';

const initialState = {
    conversations: [],
    activeConversation: null,
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create or Get Conversation
export const createConversation = createAsyncThunk(
    'chat/createConversation',
    async (receiverId, thunkAPI) => {
        try {
            console.log('[ChatSlice] Creating conversation...');
            const token = thunkAPI.getState().auth.user?.token;
            return await chatService.createConversation(receiverId, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get Messages
export const getMessages = createAsyncThunk(
    'chat/getMessages',
    async (conversationId, thunkAPI) => {
        try {
            console.log('[ChatSlice] Fetching messages history...');
            const token = thunkAPI.getState().auth.user?.token;
            return await chatService.getMessages(conversationId, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        resetChatState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
            state.messages = [];
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.activeConversation = action.payload;
            })
            .addCase(createConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { resetChatState, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
