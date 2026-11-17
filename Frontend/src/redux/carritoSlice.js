import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';
import { checkout } from './inscripcionesSlice';

const conToken = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const fetchCarrito = createAsyncThunk(
  'carrito/fetchCarrito',
  async (_, { getState }) => {
    const token = getState().usuarios.token;
    const { data } = await axios.get(`${API_URL}/carrito`, conToken(token));
    return data;
  }
);

export const agregarItemCarrito = createAsyncThunk(
  'carrito/agregarItemCarrito',
  async ({ idTurno, cantidad }, { getState }) => {
    const token = obtenerToken(getState);
    const { data } = await axios.post(
      `${API_URL}/carrito/items`,
      { idTurno, cantidad },
      conToken(token)
    );
    return data;
  }
);

export const quitarItemCarrito = createAsyncThunk(
  'carrito/quitarItemCarrito',
  async (idItem, { getState }) => {
    const token = getState().usuarios.token;
    const { data } = await axios.delete(
      `${API_URL}/carrito/items/${idItem}`,
      conToken(token)
    );
    return data;
  }
);

export const actualizarCantidad = createAsyncThunk(
  'carrito/actualizarCantidad',
  async ({ idItem, cantidad }, { getState }) => {
    const token = getState().usuarios.token;
    const { data } = await axios.put(
      `${API_URL}/carrito/items/${idItem}`,
      { cantidad },
      conToken(token)
    );
    return data;
  }
);

export const agregarAlCarrito = createAsyncThunk(
  'carrito/agregarAlCarrito',
  async ({ idItem, cantidad }, { getState }) => {
    const token = getState().usuarios.token;
    const { data } = await axios.post(
      `${API_URL}/carrito/items/${idItem}`,
      { cantidad },
      conToken(token)
    );
    return data;
  }
);

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    items: [],
    loading: false,
    error: null
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
        state.items = action.payload;
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(quitarItemCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(quitarItemCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(quitarItemCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(actualizarCantidad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarCantidad.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(actualizarCantidad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(agregarAlCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(agregarAlCarrito.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(agregarAlCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default carritoSlice.reducer;