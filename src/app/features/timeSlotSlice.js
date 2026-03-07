import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch owner slots (all slots for the owner's restaurant)
export const fetchOwnerSlots = createAsyncThunk(
    'timeSlots/fetchOwnerSlots',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('owner/slots');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch slots');
        }
    }
);

// Fetch available slots for a restaurant+date+partySize (public)
export const fetchPublicSlots = createAsyncThunk(
    'timeSlots/fetchPublicSlots',
    async ({ restaurantId, date, partySize }, { rejectWithValue }) => {
        try {
            const response = await api.get(`restaurants/${restaurantId}/slots?date=${date}&partySize=${partySize}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch available slots');
        }
    }
);

export const createSlot = createAsyncThunk(
    'timeSlots/createSlot',
    async (slotData, { rejectWithValue }) => {
        try {
            const response = await api.post('owner/slots', slotData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create slot');
        }
    }
);

export const deleteSlot = createAsyncThunk(
    'timeSlots/deleteSlot',
    async (slotId, { rejectWithValue }) => {
        try {
            await api.delete(`owner/slots/${slotId}`);
            return slotId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete slot');
        }
    }
);

const initialState = {
    ownerSlots: [],
    publicSlots: [],
    loading: false,
    error: null,
};

const timeSlotSlice = createSlice({
    name: 'timeSlots',
    initialState,
    reducers: {
        clearPublicSlots: (state) => {
            state.publicSlots = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOwnerSlots.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOwnerSlots.fulfilled, (state, action) => { state.loading = false; state.ownerSlots = action.payload || []; })
            .addCase(fetchOwnerSlots.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchPublicSlots.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPublicSlots.fulfilled, (state, action) => { state.loading = false; state.publicSlots = action.payload || []; })
            .addCase(fetchPublicSlots.rejected, (state, action) => { state.loading = false; state.publicSlots = []; state.error = action.payload; })

            .addCase(createSlot.fulfilled, (state, action) => { if (action.payload) state.ownerSlots.push(action.payload); })
            .addCase(deleteSlot.fulfilled, (state, action) => { state.ownerSlots = state.ownerSlots.filter(s => s._id !== action.payload); });
    }
});

export const { clearPublicSlots } = timeSlotSlice.actions;
export default timeSlotSlice.reducer;
