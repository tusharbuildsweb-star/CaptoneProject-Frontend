import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPackagesByRestaurant = createAsyncThunk(
    'packages/fetchAll',
    async (restaurantId, thunkAPI) => {
        try {
            const response = await api.get(`packages/${restaurantId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch packages');
        }
    }
);

export const createPackage = createAsyncThunk(
    'packages/create',
    async (packageData, thunkAPI) => {
        try {
            const response = await api.post('packages', packageData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create package');
        }
    }
);

export const updatePackage = createAsyncThunk(
    'packages/update',
    async ({ id, packageData }, thunkAPI) => {
        try {
            const response = await api.put(`packages/${id}`, packageData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update package');
        }
    }
);

export const deletePackage = createAsyncThunk(
    'packages/delete',
    async (id, thunkAPI) => {
        try {
            await api.delete(`packages/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete package');
        }
    }
);

const packageSlice = createSlice({
    name: 'packages',
    initialState: {
        list: [],
        loading: false,
        error: null,
        successMessage: null
    },
    reducers: {
        clearPackageMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPackagesByRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackagesByRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload?.data || action.payload || [];
            })
            .addCase(fetchPackagesByRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload?.data || action.payload);
                state.successMessage = 'Package created successfully!';
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updatePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePackage.fulfilled, (state, action) => {
                state.loading = false;
                const p = action.payload?.data || action.payload;
                const index = state.list.findIndex(item => item._id === p._id);
                if (index !== -1) {
                    state.list[index] = p;
                }
                state.successMessage = 'Package updated successfully!';
            })
            .addCase(updatePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deletePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(p => p._id !== action.payload);
                state.successMessage = 'Package deleted successfully!';
            })
            .addCase(deletePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearPackageMessages } = packageSlice.actions;
export default packageSlice.reducer;
