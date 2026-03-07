import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '../../services/review.service';

export const fetchUserReviews = createAsyncThunk(
    'reviews/fetchUserReviews',
    async (_, thunkAPI) => {
        try {
            const response = await reviewService.getUserReviews();
            return response; // Assume it returns an array of reviews
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

export const addReview = createAsyncThunk(
    'reviews/addReview',
    async (reviewData, thunkAPI) => {
        try {
            const response = await reviewService.addReview(reviewData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (id, thunkAPI) => {
        try {
            await reviewService.deleteReview(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete review');
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ id, reviewData }, thunkAPI) => {
        try {
            const response = await reviewService.updateReview(id, reviewData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearReviewError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch User Reviews
            .addCase(fetchUserReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload?.data || action.payload || [];
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Review
            .addCase(addReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.list.unshift(action.payload);
                }
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Review
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.list = state.list.filter(r => r._id !== action.payload);
            })
            // Update Review
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.list.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    }
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
