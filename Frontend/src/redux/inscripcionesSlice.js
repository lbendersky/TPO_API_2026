import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const obtenerToken = (getState) => {
  return getState().usuarios?.token || localStorage.getItem('token');
};

const obtenerUsuario = (getState) => {
  return getState().usuarios?.usuario || getState().auth?.usuario;
};

export const fetchInscripcionesUsuario = createAsyncThunk(
  'inscripciones/fetchInscripcionesUsuario',
  async (idUsuarioParam, { getState }) => {
    const state = getState();
    const token = obtenerToken(() => state);
    const usuario = obtenerUsuario(() => state);
    const idUsuario = idUsuarioParam ?? usuario?.idUsuario;

    const { data } = await axios.get(
      `${API_URL}/inscripciones/usuario/${idUsuario}`,
      conToken(token)
    );
    return data;
  }
);

export const fetchTodasInscripciones = createAsyncThunk(
  'inscripciones/fetchTodasInscripciones',
  async (token) => {
    const { data } = await axios.get(`${API_URL}/inscripciones`, conToken(token));
    return data;
  }
);

export const eliminarInscripcion = createAsyncThunk(
  'inscripciones/eliminarInscripcion',
  async ({ idInscripcion, token }) => {
    await axios.delete(`${API_URL}/inscripciones/${idInscripcion}`, conToken(token));
    return idInscripcion;
  }
);

export const checkout = createAsyncThunk(
  'inscripciones/checkout',
  async (metodoPago, { getState }) => {
    const token = obtenerToken(getState);
    const { data } = await axios.post(
      `${API_URL}/carrito/checkout`,
      {},
      { ...conToken(token), params: { metodoPago } }
    );
    return data;
  }
);

const inscripcionesSlice = createSlice({
  name: 'inscripciones',
  initialState: {
    items: [],
    todas: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInscripcionesUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInscripcionesUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInscripcionesUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTodasInscripciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodasInscripciones.fulfilled, (state, action) => {
        state.loading = false;
        state.todas = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTodasInscripciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(eliminarInscripcion.fulfilled, (state, action) => {
        state.todas = state.todas.filter((i) => i.idInscripcion !== action.payload);
        state.items = state.items.filter((i) => i.idInscripcion !== action.payload);
      })
      .addCase(eliminarInscripcion.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(checkout.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload];
      });
  },
});

export default inscripcionesSlice.reducer;
