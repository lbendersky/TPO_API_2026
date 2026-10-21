import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './Login.css';

const Login = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [modo, setModo] = useState('login');
    const [error, setError] = useState('');

    const [loginData, setLoginData] = useState({ email: '', contrasena: '' });
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
            navigate('/');
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
        </main>
    );
};

export default Login;
