import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        // Normalize email client-side before sending (belt-and-suspenders)
        const payload = {
            email: credentials.email?.toLowerCase().trim(),
            password: credentials.password?.trim()
        };
        const response = await api.post('auth/login', payload);
        // Persist to sessionStorage so session survives tab reloads but is isolated per tab
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const payload = {
            ...userData,
            email: userData.email?.toLowerCase().trim(),
            password: userData.password?.trim()
        };
        const response = await api.post('auth/register', payload);
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('needsOnboarding', 'true');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, thunkAPI) => {
    try {
        const response = await api.put('users/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Keep sessionStorage in sync with updated profile data
        const currentUser = JSON.parse(sessionStorage.getItem('user')) || {};
        const updatedUser = { ...currentUser, ...response.data };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
});

export const toggleFavorite = createAsyncThunk('auth/toggleFavorite', async (restaurantId, thunkAPI) => {
    try {
        const response = await api.post(`users/favorites/${restaurantId}`);
        // Keep sessionStorage in sync with updated favorites
        const currentUser = JSON.parse(sessionStorage.getItem('user')) || {};
        const updatedUser = { ...currentUser, favorites: response.data.favorites };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        return response.data.favorites;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update favorites');
    }
});

export const sendOTP = createAsyncThunk('auth/sendOTP', async (email, thunkAPI) => {
    try {
        const response = await api.post('auth/send-otp', { email: email.toLowerCase().trim() });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
});

export const loginWithOTP = createAsyncThunk('auth/loginWithOTP', async ({ email, otp }, thunkAPI) => {
    try {
        const response = await api.post('auth/login-otp', {
            email: email.toLowerCase().trim(),
            otp
        });
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
    try {
        const response = await api.get('auth/me');
        // Update sessionStorage with fresh data
        sessionStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        // If /me fails with 401, the interceptor will handle it, but we should clear local state too
        if (error.response?.status === 401) {
            thunkAPI.dispatch(authSlice.actions.logout());
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
});

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || null,
    isAuthenticated: !!sessionStorage.getItem('token'),
    needsOnboarding: sessionStorage.getItem('needsOnboarding') === 'true',
    loading: false,
    error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('needsOnboarding');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.needsOnboarding = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearOnboarding: (state) => {
            state.needsOnboarding = false;
            sessionStorage.removeItem('needsOnboarding');
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Login ──
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ── Register ──
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.needsOnboarding = true;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })

            // ── Update Profile ──
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ── Toggle Favorite ──
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.favorites = action.payload;
                }
            })
            // ── Load User (Sync) ──
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            // ── OTP Login ──
            .addCase(sendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOTP.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(sendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginWithOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginWithOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError, clearOnboarding } = authSlice.actions;
export default authSlice.reducer;
