import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchCarrito = createAsyncThunk('carrito/fetchCarrito', async () => {
  const response = await axios.get(`${API_URL}/carrito`);
  return response.data;
});

export const quitarItemCarrito = createAsyncThunk(
  'carrito/quitarItemCarrito',
  async (idItem, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/carrito/items/${idItem}`)
      return data 
    } catch (error) {
      return rejectWithValue('No se pudo quitar el turno del carrito.')
    }
  }
)

export const actualizarCantidad = createAsyncThunk(
  'carrito/actualizarCantidad',
  async ({ idItem, cantidad }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/carrito/items/${idItem}`, { cantidad })
      return data
    } catch (error) {
      return rejectWithValue('No se pudo actualizar la cantidad.')
    }
  }
)

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items= action.payload;
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default carritoSlice.reducer;