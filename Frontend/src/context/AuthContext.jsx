import { createContext, useContext, useState } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [usuario, setUsuario] = useState(() => {
        const raw = localStorage.getItem('usuario');
        return raw ? JSON.parse(raw) : null;
    });

    const guardarSesion = (nuevoToken, nuevoUsuario) => {
        localStorage.setItem('token', nuevoToken);
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
        setToken(nuevoToken);
        setUsuario(nuevoUsuario);
    };

    const fetchUsuarioPorEmail = async (email, bearer) => {
        const response = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${bearer}` },
        });
        if (!response.ok) throw new Error('No se pudo obtener el usuario');
        return response.json();
    };

    const login = async (email, contrasena) => {
        const response = await fetch(`${API_URL}/api/v1/auth/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena }),
        });
        if (!response.ok) throw new Error('Credenciales inválidas');
        const data = await response.json();
        const user = await fetchUsuarioPorEmail(email, data.access_token);
        guardarSesion(data.access_token, user);
    };

    const register = async (datos) => {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        });
        if (!response.ok) throw new Error('No se pudo registrar el usuario');
        const data = await response.json();
        const user = await fetchUsuarioPorEmail(datos.email, data.access_token);
        guardarSesion(data.access_token, user);
    };

    const actualizar = async (datos) => {
        const response = await fetch(`${API_URL}/usuarios/${usuario.idUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(datos),
        });
        if (!response.ok) throw new Error('No se pudo actualizar el usuario');
        const actualizado = await response.json();
        localStorage.setItem('usuario', JSON.stringify(actualizado));
        setUsuario(actualizado);
    };

    const eliminarCuenta = async () => {
        const response = await fetch(`${API_URL}/usuarios/${usuario.idUsuario}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('No se pudo eliminar la cuenta');
        logout();
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            usuario,
            estaLogueado: !!token,
            login,
            register,
            logout,
            actualizar,
            eliminarCuenta,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
