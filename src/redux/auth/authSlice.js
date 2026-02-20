import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from './authService';

// Get user from AsyncStorage
const getUserFromStorage = async () => {
    try {
        const user = await AsyncStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

const initialState = {
    user: null,
    users: [], // List of all other users
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        console.log('[AuthSlice] Dispatching login...');
        const data = await authService.login(user);
        if (data) {
            console.log('[AuthSlice] Saving user to AsyncStorage:', data._id);
            await AsyncStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        console.error('[AuthSlice] Login Rejected:', message);
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout user
export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        console.log('[AuthSlice] Starting logout sequence...');
        const token = thunkAPI.getState().auth.user?.token;
        if (token) {
            await authService.logout(token);
        }
    } catch (error) {
        console.log('[AuthSlice] Logout API error (proceeding with local clear):', error);
    }
    console.log('[AuthSlice] Clearing AsyncStorage');
    await AsyncStorage.removeItem('user');
});

// Get user profile
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, thunkAPI) => {
        try {
            console.log('[AuthSlice] Dispatching fetch profile...');
            const token = thunkAPI.getState().auth.user?.token;
            return await authService.getProfile(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            console.error('[AuthSlice] Profile fetch failed:', message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get all users
export const getAllUsers = createAsyncThunk(
    'auth/getAllUsers',
    async (_, thunkAPI) => {
        try {
            console.log('[AuthSlice] Dispatching fetch all users...');
            const token = thunkAPI.getState().auth.user?.token;
            return await authService.getAllUsers(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            console.error('[AuthSlice] Fetch users failed:', message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            console.log('[AuthSlice] Resetting state');
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setUser: (state, action) => {
            console.log('[AuthSlice] Manually setting user:', action.payload?._id);
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state) => {
                console.log('[AuthSlice] Register Fullfilled');
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                console.log('[AuthSlice] Login Fullfilled:', action.payload._id);
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                console.log('[AuthSlice] Logout Complete');
                state.user = null;
                state.users = [];
            })
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                console.log('[AuthSlice] Users loaded:', action.payload.length);
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});


export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;

