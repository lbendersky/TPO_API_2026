import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchMisCanchas = createAsyncThunk('canchas/fetchMisCanchas', async (idUsuario) => {
    const { data } = await axios.get(`${API_URL}/canchas/usuario/${idUsuario}`);
    return data;
});

export const fetchTodasCanchas = createAsyncThunk('canchas/fetchTodasCanchas', async (token) => {
    const { data } = await axios.get(`${API_URL}/admin/canchas`, conToken(token));
    return data;
});

export const publicarCancha = createAsyncThunk('canchas/publicarCancha', async ({ datos, fotos, token }) => {
    const { data } = await axios.post(`${API_URL}/canchas`, datos, conToken(token));

    for (const idImagenPrecargada of fotos) {
        await axios.post(`${API_URL}/imagenes/precargada`, { idCancha: data.idCancha, idImagenPrecargada }, conToken(token));
    }
    return data;
});

export const editarCancha = createAsyncThunk('canchas/editarCancha', async ({ idCancha, datos, token }) => {
    const { data } = await axios.put(`${API_URL}/canchas/${idCancha}`, datos, conToken(token));
    return data;
});

export const darDeBajaCancha = createAsyncThunk('canchas/darDeBajaCancha', async ({ idCancha, token }) => {
    await axios.delete(`${API_URL}/canchas/${idCancha}`, conToken(token));
    return idCancha;
});

export const fetchFotosPrecargadas = createAsyncThunk('canchas/fetchFotosPrecargadas', async () => {
    const { data } = await axios.get(`${API_URL}/imagenes/precargadas`);
    return data;
});

export const fetchTodasLasImagenes = createAsyncThunk('canchas/fetchTodasLasImagenes', async () => {
    const { data } = await axios.get(`${API_URL}/imagenes/canchas`);
    const imagenesPorCancha = {};
    for (const idCancha of Object.keys(data)) {
        imagenesPorCancha[idCancha] = data[idCancha].map((img) => img.file);
    }
    return imagenesPorCancha;
});

const canchasSlice = createSlice({
    name: 'canchas',
    initialState: {
        misCanchas: [],
        todas: [],
        ultimaPublicada: null,
        precargadas: [],
        imagenesPorCancha: {},
        loading: false,
        error: null,
    },
    reducers: {
        limpiarPublicada: (state) => {
            state.ultimaPublicada = null;
        },
    },
    extraReducers: (builder) => {
    builder
        .addCase(fetchMisCanchas.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchMisCanchas.fulfilled, (state, action) => {
            state.loading = false;
            state.misCanchas = action.payload;
        })
        .addCase(fetchMisCanchas.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchTodasCanchas.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTodasCanchas.fulfilled, (state, action) => {
            state.loading = false;
            state.todas = action.payload;
        })
        .addCase(fetchTodasCanchas.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(publicarCancha.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(publicarCancha.fulfilled, (state, action) => {
            state.loading = false;
            state.ultimaPublicada = action.payload;
            state.misCanchas = [...state.misCanchas, action.payload];

            const idCancha = action.payload.idCancha;
            const idsElegidos = action.meta.arg.fotos;
            state.imagenesPorCancha[idCancha] = idsElegidos
                .map((id) => state.precargadas.find((p) => p.id === id)?.file)
                .filter(Boolean);
        })
        .addCase(publicarCancha.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(editarCancha.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editarCancha.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.misCanchas.findIndex((c) => c.idCancha === action.payload.idCancha);
            if (index !== -1) {
                state.misCanchas[index] = action.payload;
            }
        })
        .addCase(editarCancha.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(darDeBajaCancha.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(darDeBajaCancha.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.misCanchas.findIndex((c) => c.idCancha === action.payload);
            if (index !== -1) {
                state.misCanchas[index].activa = false;
            }
            const indexTodas = state.todas.findIndex((c) => c.idCancha === action.payload);
            if (indexTodas !== -1) {
                state.todas[indexTodas].activa = false;
            }
        })
        .addCase(darDeBajaCancha.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchFotosPrecargadas.pending, (state) => {
            state.error = null;
        })
        .addCase(fetchFotosPrecargadas.fulfilled, (state, action) => {
            state.precargadas = action.payload;
        })
        .addCase(fetchFotosPrecargadas.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addCase(fetchTodasLasImagenes.fulfilled, (state, action) => {
            state.imagenesPorCancha = action.payload;
        })
        .addCase(fetchTodasLasImagenes.rejected, (state, action) => {
            state.error = action.error.message;
        });
    },
});
export const { limpiarPublicada } = canchasSlice.actions;
export default canchasSlice.reducer;