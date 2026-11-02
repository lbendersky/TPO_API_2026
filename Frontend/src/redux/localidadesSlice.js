import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

export const fetchLocalidades = createAsyncThunk('localidades/fetchLocalidades', async () => {
  const response = await axios.get(`${API_URL}/localidades`);
  return response.data;
});

const localidadesSlice = createSlice({
  name: 'localidades',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocalidades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocalidades.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLocalidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default localidadesSlice.reducer;