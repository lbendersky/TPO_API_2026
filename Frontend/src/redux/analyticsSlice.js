import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchAnalytics = createAsyncThunk('analytics/fetchAnalytics', async (token) => {
    const { data } = await axios.get(`${API_URL}/admin/analytics`, conToken(token));
    return data;
});

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        datos: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.datos = action.payload;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default analyticsSlice.reducer;