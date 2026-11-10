import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const obtenerUsuarioPorEmail = async (email, token) => {
    const { data } = await axios.get(`${API_URL}/usuarios`, { params: { email }, ...conToken(token) });
    return data;
};

export const login = createAsyncThunk('usuarios/login', async ({ email, contrasena }, { rejectWithValue }) => {
    let accessToken;
    try {
        const { data } = await axios.post(`${API_URL}/api/v1/auth/authenticate`, { email, contrasena });
        accessToken = data.access_token;
    } catch {
        return rejectWithValue('Credenciales inválidas');
    }

    let usuario;
    try {
        usuario = await obtenerUsuarioPorEmail(email, accessToken);
    } catch {
        return rejectWithValue('No se pudo obtener el usuario');
    }

    return { token: accessToken, usuario };
});

export const register = createAsyncThunk('usuarios/register', async (datos, { rejectWithValue }) => {
    let accessToken;
    try {
        const { data } = await axios.post(`${API_URL}/api/v1/auth/register`, datos);
        accessToken = data.access_token;
    } catch (err) {
        if (err.response?.status === 403) {
            return rejectWithValue('Ese email ya está registrado. Iniciá sesión en vez de crear una cuenta nueva.');
        }
        return rejectWithValue('No se pudo registrar el usuario');
    }

    let usuario;
    try {
        usuario = await obtenerUsuarioPorEmail(datos.email, accessToken);
    } catch {
        return rejectWithValue('No se pudo obtener el usuario');
    }

    return { token: accessToken, usuario };
});

export const actualizarPerfil = createAsyncThunk('usuarios/actualizarPerfil', async ({ idUsuario, datos, token }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${API_URL}/usuarios/${idUsuario}`, datos, conToken(token));
        return data;
    } catch (err) {
        if (err.response?.status === 400) {
            return rejectWithValue('La contraseña actual no es correcta.');
        }
        return rejectWithValue('No se pudo actualizar el usuario');
    }
});

export const eliminarCuenta = createAsyncThunk('usuarios/eliminarCuenta', async ({ idUsuario, token }, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/usuarios/${idUsuario}`, conToken(token));
    } catch {
        return rejectWithValue('No se pudo eliminar la cuenta');
    }
    return null;
});

export const buscarUsuarioPorEmail = createAsyncThunk('usuarios/buscarUsuarioPorEmail', async ({ email, token }, { rejectWithValue }) => {
    try {
        return await obtenerUsuarioPorEmail(email, token);
    } catch {
        return rejectWithValue('No se pudo obtener el usuario');
    }
});

export const eliminarUsuarioAdmin = createAsyncThunk('usuarios/eliminarUsuarioAdmin', async ({ idUsuario, token }, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/usuarios/${idUsuario}`, conToken(token));
        return idUsuario;
    } catch {
        return rejectWithValue('No se pudo eliminar el usuario');
    }
});

const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState: {
        token: null,
        usuario: null,
        estaLogueado: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.usuario = null;
            state.estaLogueado = false;
        },
    },
    extraReducers: (builder) => {
        builder
            //login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.usuario = action.payload.usuario;
                state.estaLogueado = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.usuario = action.payload.usuario;
                state.estaLogueado = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //actualizar perfil propio
            .addCase(actualizarPerfil.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(actualizarPerfil.fulfilled, (state, action) => {
                state.loading = false;
                state.usuario = action.payload;
            })
            .addCase(actualizarPerfil.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //eliminar cuenta propia
            .addCase(eliminarCuenta.fulfilled, (state) => {
                state.token = null;
                state.usuario = null;
                state.estaLogueado = false;
            })
            .addCase(eliminarCuenta.rejected, (state, action) => {
                state.error = action.payload;
            })
            //moderación (Moderar.jsx)
            .addCase(buscarUsuarioPorEmail.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(eliminarUsuarioAdmin.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { logout } = usuariosSlice.actions;
export default usuariosSlice.reducer;