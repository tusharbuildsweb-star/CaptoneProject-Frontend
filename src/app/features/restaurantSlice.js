import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchRestaurants = createAsyncThunk(
    'restaurants/fetchAll',
    async (queryParams = '', thunkAPI) => {
        try {
            const response = await api.get(`restaurants${queryParams}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurants');
        }
    }
);

export const fetchRestaurantById = createAsyncThunk(
    'restaurants/fetchById',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`restaurants/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch restaurant details');
        }
    }
);

export const searchRestaurants = createAsyncThunk(
    'restaurants/search',
    async (searchQuery, thunkAPI) => {
        try {
            // Converts object of search filters into query string
            const params = new URLSearchParams(searchQuery).toString();
            const response = await api.get(`restaurants?${params}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

export const fetchOwnerRestaurant = createAsyncThunk(
    'restaurants/fetchOwner',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('restaurants/owner/me');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch your restaurant');
        }
    }
);

export const fetchFilters = createAsyncThunk(
    'restaurants/fetchFilters',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('restaurants/filters');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch filters');
        }
    }
);

export const updateRestaurant = createAsyncThunk(
    'restaurants/update',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await api.put(`restaurants/${id}`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update restaurant');
        }
    }
);

const initialState = {
    list: [],
    filters: { cuisines: [], locations: [], features: [] },
    currentRestaurant: null,
    loading: false,
    error: null,
};

const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        clearCurrentRestaurant: (state) => {
            state.currentRestaurant = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload?.data || action.payload || [];
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Filters
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filters = action.payload;
            })

            // Fetch Single
            .addCase(fetchRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentRestaurant = null;
            })
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                const p = action.payload?.data || action.payload;
                state.currentRestaurant = p?.restaurant ? p.restaurant : (p || null);
            })
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search Restaurants
            .addCase(searchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload?.data || action.payload || [];
            })
            .addCase(searchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Owner Restaurant
            .addCase(fetchOwnerRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentRestaurant = null;
            })
            .addCase(fetchOwnerRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRestaurant = action.payload; // direct object returned by backend findOne
            })
            .addCase(fetchOwnerRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Restaurant
            .addCase(updateRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentRestaurant && state.currentRestaurant._id === action.payload._id) {
                    state.currentRestaurant = action.payload;
                }
            })
            .addCase(updateRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
