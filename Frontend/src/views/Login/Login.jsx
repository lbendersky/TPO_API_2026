import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../config';
import { Alerta } from '../../utils/alerta';
import './Login.css';

const Login = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [modo, setModo] = useState('login');
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');

    const [loginData, setLoginData] = useState({ email: '', contrasena: '' });

    const handleOlvideContrasena = async () => {
        setError('');
        setAviso('');
        if (!loginData.email) {
            setError('Ingresá tu email para recuperar la contraseña.');
            return;
        }
        const { value: nuevaContrasena } = await Alerta.fire({
            title: 'Cambiar contraseña',
            input: 'password',
            inputLabel: 'Ingresá tu nueva contraseña',
            inputPlaceholder: 'Nueva contraseña',
            inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
            showCancelButton: true,
            confirmButtonText: 'Cambiar',
            cancelButtonText: 'Cancelar',
        });
        if (!nuevaContrasena) return;
        try {
            const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginData.email, contrasena: nuevaContrasena }),
            });
            if (!response.ok) throw new Error('No se pudo cambiar la contraseña.');
            setAviso('Contraseña actualizada correctamente.');
        } catch (err) {
            setError(err.message);
        }
    };
    const [registerData, setRegisterData] = useState({
        email: '',
        nombre: '',
        apellido: '',
        nombreUsuario: '',
        dni: '',
        telefono: '',
        contrasena: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(loginData.email, loginData.contrasena);
            navigate(-1);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(registerData);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="login">
            <div className="login__tabs">
                <button
                    className={modo === 'login' ? 'login__tab login__tab--activa' : 'login__tab'}
                    onClick={() => { setModo('login'); setError(''); }}
                >
                    Iniciar sesión
                </button>
                <button
                    className={modo === 'register' ? 'login__tab login__tab--activa' : 'login__tab'}
                    onClick={() => { setModo('register'); setError(''); }}
                >
                    Registrarme
                </button>
            </div>

            {modo === 'login' ? (
                <form className="login__form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={loginData.contrasena}
                        onChange={(e) => setLoginData({ ...loginData, contrasena: e.target.value })}
                        required
                    />
                    <button type="submit" className="login__submit">Entrar</button>
                    <span className="login__olvide" onClick={handleOlvideContrasena}>¿Olvidaste tu contraseña?</span>
                </form>
            ) : (
                <form className="login__form" onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={registerData.nombre}
                        onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        value={registerData.apellido}
                        onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={registerData.nombreUsuario}
                        onChange={(e) => setRegisterData({ ...registerData, nombreUsuario: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="DNI"
                        value={registerData.dni}
                        onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Teléfono"
                        value={registerData.telefono}
                        onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={registerData.contrasena}
                        onChange={(e) => setRegisterData({ ...registerData, contrasena: e.target.value })}
                        required
                    />
                    <button type="submit" className="login__submit">Crear cuenta</button>
                </form>
            )}

            {error && <p className="login__error">{error}</p>}
            {aviso && <p className="login__aviso">{aviso}</p>}
        </main>
    );
};

export default Login;
