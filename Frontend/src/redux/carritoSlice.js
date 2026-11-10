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

// --- Thunk refactorizado para Inscripciones ---
export const fetchInscripcionesUsuario = createAsyncThunk(
  'carrito/fetchInscripcionesUsuario',
  async (idUsuarioParam, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = obtenerToken(() => state);
      
      // Usa el id pasado por parámetro o lo toma del usuario en el store
      const usuario = obtenerUsuario(() => state);
      const idUsuario = idUsuarioParam ?? usuario?.idUsuario ?? usuario?.id_usuario;

      if (!idUsuario) {
        return rejectWithValue('No se encontró el ID del usuario.');
      }

      const response = await axios.get(
        `${API_URL}/inscripciones/usuario/${idUsuario}`,
        conToken(token)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'No se pudieron cargar tus inscripciones.'
      );
    }
  }
);

export const fetchCarrito = createAsyncThunk(
  'carrito/fetchCarrito',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = obtenerToken(getState);
      const response = await axios.get(`${API_URL}/carrito`, conToken(token));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el carrito.');
    }
  }
);

export const quitarItemCarrito = createAsyncThunk(
  'carrito/quitarItemCarrito',
  async (idItem, { getState, rejectWithValue }) => {
    try {
      const token = obtenerToken(getState);
      const { data } = await axios.delete(
        `${API_URL}/carrito/items/${idItem}`,
        conToken(token)
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'No se pudo quitar el turno del carrito.');
    }
  }
);

export const actualizarCantidad = createAsyncThunk(
  'carrito/actualizarCantidad',
  async ({ idItem, cantidad }, { getState, rejectWithValue }) => {
    try {
      const token = obtenerToken(getState);
      const { data } = await axios.put(
        `${API_URL}/carrito/items/${idItem}`,
        { cantidad },
        conToken(token)
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'No se pudo actualizar la cantidad.');
    }
  }
);

const carritoSlice = createSlice({
  name: 'carrito',
  initialState: {
    items: [],
    loading: false,
    error: null,
    // Estado para inscripciones
    inscripciones: [],
    loadingInscripciones: false,
    errorInscripciones: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Carrito
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
        } else if (action.payload && Array.isArray(action.payload.itemsCarrito)) {
          state.items = action.payload.itemsCarrito;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Quitar Item
      .addCase(quitarItemCarrito.fulfilled, (state, action) => {
        const idEliminado = action.meta.arg;
        state.items = state.items.filter(
          (i) => (i.idItem ?? i.id_item ?? i.id) !== idEliminado
        );
      })

      // Actualizar Cantidad
      .addCase(actualizarCantidad.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload?.items && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
        } else {
          const { idItem, cantidad } = action.meta.arg;
          const item = state.items.find(
            (i) => (i.idItem ?? i.id_item ?? i.id) === idItem
          );
          if (item) {
            item.cantidad = cantidad;
            const precio = Number(
              item.precioUnitario ??
              item.precio_unitario ??
              item.turno?.precioPorJugador ??
              item.turno?.precio_por_jugador ??
              item.precio ??
              0
            );
            item.subtotal = precio * cantidad;
            item.subTotal = precio * cantidad;
          }
        }
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