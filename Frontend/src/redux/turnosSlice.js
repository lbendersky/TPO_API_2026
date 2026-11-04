import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

export const fetchTurnosFiltrados = createAsyncThunk(
  'turnos/fetchTurnosFiltrados',
  async (filtros) => {
    const { data } = await axios.get(`${API_URL}/turnos/filtrar`, { params: filtros });
    return data;
  }
);

const turnosSlice = createSlice({
  name: 'turnos',
  initialState: {
    items: [],                                                       // la lista del catálogo
    filtros: { texto: null, localidad: null, tipoFutbol: null,
               precioMin: null, precioMax: null }, // por defecto, no hay filtros aplicados
    loading: false,
    error: null,
  },
  reducers: {
    // solo guarda los filtros elegidos en el estado global
    setFiltros: (state, action) => {
      state.filtros = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurnosFiltrados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTurnosFiltrados.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTurnosFiltrados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFiltros } = turnosSlice.actions;
export default turnosSlice.reducer;