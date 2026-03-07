import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notification.service';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, thunkAPI) => {
        try {
            return await notificationService.getUserNotifications();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id, thunkAPI) => {
        try {
            return await notificationService.markAsRead(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (_, thunkAPI) => {
        try {
            return await notificationService.markAllAsRead();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        list: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.list.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        clearNotifications: (state) => {
            state.list = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || [];
                state.unreadCount = state.list.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.list.findIndex(n => n._id === action.payload._id);
                if (index !== -1 && !state.list[index].isRead) {
                    state.list[index].isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.list.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
