import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchOfertas = createAsyncThunk('ofertas/fetchOfertas', async () => {
    const { data } = await axios.get(`${API_URL}/ofertas`);
    return data;
});

export const fetchOfertaPorTurno = createAsyncThunk('ofertas/fetchOfertaPorTurno', async (idTurno) => {
    const { data } = await axios.get(`${API_URL}/ofertas/turno/${idTurno}`);
    return data;
});

export const crearOferta = createAsyncThunk('ofertas/crearOferta', async ({ datos, token }) => {
    const { data } = await axios.post(`${API_URL}/ofertas`, datos, conToken(token));
    return data;
});

export const editarOferta = createAsyncThunk('ofertas/editarOferta', async ({ idOferta, datos, token }) => {
    const { data } = await axios.put(`${API_URL}/ofertas/${idOferta}`, datos, conToken(token));
    return data;
});

export const eliminarOferta = createAsyncThunk('ofertas/eliminarOferta', async ({ idOferta, token }) => {
    await axios.delete(`${API_URL}/ofertas/${idOferta}`, conToken(token));
    return idOferta;
});

const ofertasSlice = createSlice({
    name: 'ofertas',
    initialState: {
        items: [],
        porTurno: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchOfertas.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOfertas.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(fetchOfertas.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchOfertaPorTurno.fulfilled, (state, action) => {
            state.porTurno[action.payload.idTurno] = action.payload;
        })
        .addCase(fetchOfertaPorTurno.rejected, (state, action) => {
            delete state.porTurno[action.meta.arg];
        })
        .addCase(crearOferta.fulfilled, (state, action) => {
            state.items.push(action.payload);
            state.porTurno[action.payload.idTurno] = action.payload;
        })
        .addCase(crearOferta.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addCase(editarOferta.fulfilled, (state, action) => {
            const index = state.items.findIndex((oferta) => oferta.idOferta === action.payload.idOferta);
            if (index !== -1) state.items[index] = action.payload;
            state.porTurno[action.payload.idTurno] = action.payload;
        })
        .addCase(editarOferta.rejected, (state, action) => {
            state.error = action.error.message; 
        })
        .addCase(eliminarOferta.fulfilled, (state, action) => {
            state.items = state.items.filter((oferta) => oferta.idOferta !== action.payload);
            for (const turnoId in state.porTurno) {
                if (state.porTurno[turnoId].idOferta === action.payload) {
                    delete state.porTurno[turnoId];
                }
            }
        })
        .addCase(eliminarOferta.rejected, (state, action) => {
            state.error = action.error.message;
        })
    },
});

export default ofertasSlice.reducer;