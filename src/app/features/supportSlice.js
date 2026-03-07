import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supportService } from '../../services/support.service';

export const fetchUserTickets = createAsyncThunk(
    'support/fetchUserTickets',
    async (_, thunkAPI) => {
        try {
            const response = await supportService.getUserTickets();
            return response; // Depends if it's [{ticket}] or {data: [{ticket}]}
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
        }
    }
);

export const createTicket = createAsyncThunk(
    'support/createTicket',
    async (ticketData, thunkAPI) => {
        try {
            const response = await supportService.createTicket(ticketData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
        }
    }
);

const supportSlice = createSlice({
    name: 'support',
    initialState: {
        tickets: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSupportError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload || [];
            })
            .addCase(fetchUserTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.tickets.unshift(action.payload);
                }
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSupportError } = supportSlice.actions;
export default supportSlice.reducer;
