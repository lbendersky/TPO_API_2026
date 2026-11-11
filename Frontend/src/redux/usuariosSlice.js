import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config';

const conToken = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const obtenerUsuarioPorEmail = async (email, token) => {
    const { data } = await axios.get(`${API_URL}/usuarios`, { params: { email }, ...conToken(token) });
    return data;
};

export const login = createAsyncThunk('usuarios/login', async ({ email, contrasena }) => {
    const { data } = await axios.post(`${API_URL}/api/v1/auth/authenticate`, { email, contrasena });
    const accessToken = data.access_token;
    const usuario = await obtenerUsuarioPorEmail(email, accessToken);
    return { token: accessToken, usuario };
});

export const register = createAsyncThunk('usuarios/register', async (datos) => {
    const { data } = await axios.post(`${API_URL}/api/v1/auth/register`, datos);
    const accessToken = data.access_token;
    const usuario = await obtenerUsuarioPorEmail(datos.email, accessToken);
    return { token: accessToken, usuario };
});

export const actualizarPerfil = createAsyncThunk('usuarios/actualizarPerfil', async ({ idUsuario, datos, token }) => {
    const { data } = await axios.put(`${API_URL}/usuarios/${idUsuario}`, datos, conToken(token));
    return data;
});

export const eliminarCuenta = createAsyncThunk('usuarios/eliminarCuenta', async ({ idUsuario, token }) => {
    await axios.delete(`${API_URL}/usuarios/${idUsuario}`, conToken(token));
    return null;
});

export const buscarUsuarioPorEmail = createAsyncThunk('usuarios/buscarUsuarioPorEmail', async ({ email, token }) => {
    return await obtenerUsuarioPorEmail(email, token);
});

export const eliminarUsuarioAdmin = createAsyncThunk('usuarios/eliminarUsuarioAdmin', async ({ idUsuario, token }) => {
    await axios.delete(`${API_URL}/usuarios/${idUsuario}`, conToken(token));
    return idUsuario;
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
                state.error = action.error.message;
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
                state.error = action.error.message;
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
                state.error = action.error.message;
            })
            //eliminar cuenta propia
            .addCase(eliminarCuenta.fulfilled, (state) => {
                state.token = null;
                state.usuario = null;
                state.estaLogueado = false;
            })
            .addCase(eliminarCuenta.rejected, (state, action) => {
                state.error = action.error.message;
            })
            //moderación (Moderar.jsx)
            .addCase(buscarUsuarioPorEmail.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(eliminarUsuarioAdmin.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const { logout } = usuariosSlice.actions;
export default usuariosSlice.reducer;
