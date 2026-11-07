import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchTurnosFiltrados = createAsyncThunk(
  'turnos/fetchTurnosFiltrados',
  async (filtros) => {
    const { data } = await axios.get(`${API_URL}/turnos/filtrar`, { params: filtros });
    return data;
  }
);

export const fetchLocalidades = createAsyncThunk('turnos/fetchLocalidades', async () => {
    const { data } = await axios.get(`${API_URL}/localidades`);
    return data;
});

export const fetchMisTurnos = createAsyncThunk('turnos/fetchMisTurnos', async (idUsuario) => {
    const { data } = await axios.get(`${API_URL}/turnos/usuario/${idUsuario}`);
    return data;
});

export const fetchTurnoPorId = createAsyncThunk('turnos/fetchTurnoPorId', async (idTurno) => {
    const { data } = await axios.get(`${API_URL}/turnos/${idTurno}`);
    return data;
});

export const fetchParticipantes = createAsyncThunk('turnos/fetchParticipantes', async (idTurno) => {
    const { data } = await axios.get(`${API_URL}/turnos/${idTurno}/participantes`);
    return data;
});

export const crearTurno = createAsyncThunk('turnos/crearTurno', async ({ datos, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${API_URL}/turnos`, datos, conToken(token));
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.status);
    }
});

export const editarTurno = createAsyncThunk('turnos/editarTurno', async ({ idTurno, datos, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${API_URL}/turnos/${idTurno}`, datos, conToken(token));
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.status);
    }
});

export const borrarTurno = createAsyncThunk('turnos/borrarTurno', async ({ idTurno, token }, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/turnos/${idTurno}`, conToken(token));
        return idTurno;
    } catch (err) {
        return rejectWithValue(err.response?.status);
    }
});

const turnosSlice = createSlice({
  name: 'turnos',
  initialState: {
    items: [], // la lista del catálogo
    filtros: { texto: null, localidades: null, tiposFutbol: null, precioMin: null, precioMax: null }, // por defecto, no hay filtros aplicados
    localidades: [], // lista de localidades
    seleccionado: null,
    participantesPorId: {},
    deMisCanchas: [],
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
      })
      //LOCALIDADES
      .addCase(fetchLocalidades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocalidades.fulfilled, (state, action) => {
        state.loading = false;
        state.localidades = action.payload;
      })
      .addCase(fetchLocalidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //GET DE TURNOS
      .addCase(fetchMisTurnos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMisTurnos.fulfilled, (state, action) => {
        state.loading = false;
        state.deMisCanchas = action.payload;
      })
      .addCase(fetchMisTurnos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //CREAR TURNO
      .addCase(crearTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearTurno.fulfilled, (state, action) => {
        state.loading = false;
        state.deMisCanchas = [...state.deMisCanchas, action.payload];
      })
      .addCase(crearTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //EDITAR TURNO
      .addCase(editarTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editarTurno.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deMisCanchas.findIndex((t) => t.idTurno === action.payload.idTurno);
        if (index !== -1) {state.deMisCanchas[index] = action.payload;}
      })
      .addCase(editarTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //BORRAR TURNO
      .addCase(borrarTurno.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(borrarTurno.fulfilled, (state, action) => {
        state.loading = false;
        state.deMisCanchas = state.deMisCanchas.filter((t) => t.idTurno !== action.payload);
      })
      .addCase(borrarTurno.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Detalle tunro
      .addCase(fetchTurnoPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.seleccionado = null;
      })
      .addCase(fetchTurnoPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.seleccionado = action.payload;
      })
      .addCase(fetchTurnoPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Anotados
      .addCase(fetchParticipantes.pending, (state, action) => {
        state.participantesPorId[action.meta.arg] = [];
      })
      .addCase(fetchParticipantes.fulfilled, (state, action) => {
        state.participantesPorId[action.meta.arg] = action.payload;
      })
      .addCase(fetchParticipantes.rejected, (state, action) => {
        state.participantesPorId[action.meta.arg] = [];
        state.error = action.error.message;
      });
  },
});

export const { setFiltros } = turnosSlice.actions;
export default turnosSlice.reducer;