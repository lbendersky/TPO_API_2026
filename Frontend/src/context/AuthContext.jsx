import { createContext, useContext, useState } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const guardarToken = (nuevoToken) => {
        localStorage.setItem('token', nuevoToken);
        setToken(nuevoToken);
    };

    const login = async (email, contrasena) => {
        const response = await fetch(`${API_URL}/api/v1/auth/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contrasena }),
        });
        if (!response.ok) throw new Error('Credenciales inválidas');
        const data = await response.json();
        guardarToken(data.access_token);
    };

    const register = async (datos) => {
        const response = await fetch(`${API_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        });
        if (!response.ok) throw new Error('No se pudo registrar el usuario');
        const data = await response.json();
        guardarToken(data.access_token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, estaLogueado: !!token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
