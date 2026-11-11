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
  'carrito/fetchInscripcionesUsuario',
  async (idUsuarioParam, { getState, }) => {
    const state = getState();
    const token = obtenerToken(() => state);

    const usuario = obtenerUsuario(() => state);
    const idUsuario = idUsuarioParam ?? usuario?.idUsuario ?? usuario?.id_usuario;

    const response = await axios.get(
      `${API_URL}/inscripciones/usuario/${idUsuario}`,
      conToken(token)
    );

    return response.data;
  }
);

export const fetchCarrito = createAsyncThunk(
  'carrito/fetchCarrito',
  async (_, { getState }) => {
    const token = obtenerToken(getState);
    const response = await axios.get(`${API_URL}/carrito`, conToken(token));
    return response.data;
  }
);

export const quitarItemCarrito = createAsyncThunk(
  'carrito/quitarItemCarrito',
  async (idItem, { getState }) => {
    const token = obtenerToken(getState);
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
    const token = obtenerToken(getState);
    const { data } = await axios.put(
      `${API_URL}/carrito/items/${idItem}`,
      { cantidad },
      conToken(token)
    );
    return data;
  }
);

export const agregarAlCarrito = createAsyncThunk(
  'carrito/items',
  async ({ idItem, cantidad }, { getState }) => {
    const { data } = await axios.post(
      `${API_URL}/carrito/items/${idItem}`,
      { cantidad },
      conToken(token)
    );
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

      .addCase(quitarItemCarrito.fulfilled, (state, action) => {
        const idEliminado = action.meta.arg;
        state.items = state.items.filter(
          (i) => (i.idItem ?? i.id_item ?? i.id) !== idEliminado
        );
      })

      .addCase(actualizarCantidad.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      // --- Inscripciones ---
      .addCase(fetchInscripcionesUsuario.pending, (state) => {
        state.loadingInscripciones = true;
        state.errorInscripciones = null;
      })
      .addCase(fetchInscripcionesUsuario.fulfilled, (state, action) => {
        state.loadingInscripciones = false;
        state.inscripciones = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInscripcionesUsuario.rejected, (state, action) => {
        state.loadingInscripciones = false;
        state.errorInscripciones = action.payload || action.error.message;
      });
  },
});

export default carritoSlice.reducer;