import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchMisCanchas = createAsyncThunk('canchas/fetchMisCanchas', async (idUsuario) => {
    const { data } = await axios.get(`${API_URL}/canchas/usuario/${idUsuario}`);
    return data;
});

export const fetchTodasCanchas = createAsyncThunk('canchas/fetchTodasCanchas', async (token) => {
    const { data } = await axios.get(`${API_URL}/canchas`, conToken(token));
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

export const fetchImagenesCancha = createAsyncThunk('canchas/fetchImagenesCancha', async (idCancha) => {
    const { data } = await axios.get(`${API_URL}/imagenes/cancha/${idCancha}`);
    return { idCancha, imagenes: data.map((img) => img.file) };
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
        //para limpiar la cancha publicada despues de mostrar el mensje de que se creo la cancha bien
        limpiarPublicada: (state) => {
            state.ultimaPublicada = null;
        },
    },
    extraReducers: (builder) => {
    builder
        //mis canchas (GET)
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
        //todas las canchas (GET - admin)
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
        //publicar cancha (POST)
        .addCase(publicarCancha.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(publicarCancha.fulfilled, (state, action) => {
            state.loading = false;
            state.ultimaPublicada = action.payload;
            state.misCanchas = [...state.misCanchas, action.payload];
        })
        .addCase(publicarCancha.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        //editar cancha (PUT)
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
        //dar de baja cancha (DELETE)
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
            state.todas = state.todas.filter((c) => c.idCancha !== action.payload);
        })
        .addCase(darDeBajaCancha.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        //fotos precargadas e imagenes de cancha
        .addCase(fetchFotosPrecargadas.pending, (state) => {
            state.error = null;
        })
        .addCase(fetchFotosPrecargadas.fulfilled, (state, action) => {
            state.precargadas = action.payload;
        })
        .addCase(fetchFotosPrecargadas.rejected, (state, action) => {
            state.error = action.error.message;
        })
        .addCase(fetchImagenesCancha.pending, (state, action) => {
            state.imagenesPorCancha[action.meta.arg] = [];
        })
        .addCase(fetchImagenesCancha.fulfilled, (state, action) => {
            state.imagenesPorCancha[action.payload.idCancha] = action.payload.imagenes;
        })
        .addCase(fetchImagenesCancha.rejected, (state, action) => {
            delete state.imagenesPorCancha[action.meta.arg];
        });
    },
});
export const { limpiarPublicada } = canchasSlice.actions;
export default canchasSlice.reducer;
