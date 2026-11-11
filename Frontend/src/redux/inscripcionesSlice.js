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
    const idUsuario = idUsuarioParam ?? usuario?.idUsuario ?? usuario?.id_usuario;

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
      // todas las inscripciones (admin)
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
      // eliminar inscripcion (admin)
      .addCase(eliminarInscripcion.fulfilled, (state, action) => {
        state.todas = state.todas.filter((i) => i.idInscripcion !== action.payload);
        state.items = state.items.filter((i) => i.idInscripcion !== action.payload);
      })
      .addCase(eliminarInscripcion.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default inscripcionesSlice.reducer;
