import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './Perfil.css';

const Perfil = () => {
    const { usuario, estaLogueado, actualizar, logout, eliminarCuenta } = useAuth();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const [datos, setDatos] = useState(() => ({
    nombreUsuario: usuario?.nombreUsuario ?? '',
    nombre: usuario?.nombre ?? '',
    apellido: usuario?.apellido ?? '',
    email: usuario?.email ?? '',
    telefono: usuario?.telefono ?? '',
    dni: usuario?.dni ?? '',
    contrasena: '',
}));

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    const handleCambio = (campo) => (e) => {
        setDatos({ ...datos, [campo]: e.target.value });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');
        try {
            const payload = { ...datos };
            if (!payload.contrasena) delete payload.contrasena;
            await actualizar(payload);
            setMensaje('Datos actualizados');
            setDatos({ ...datos, contrasena: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleEliminar = async () => {
        const confirmado = window.confirm('¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer.');
        if (!confirmado) return;
        try {
            await eliminarCuenta();
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    if (!usuario) return null;

    return (
        <main className="perfil">
            {usuario.rol === 'ADMIN' && (
                <button
                    type="button"
                    className="perfil__moderar"
                    onClick={() => navigate('/moderar')}
                >
                    Moderar turnos y usuarios
                </button>
            )}
            <h1 className="perfil__titulo">Mi perfil</h1>

            <form className="perfil__form" onSubmit={handleGuardar}>
                <label className="perfil__campo">
                    Nombre de usuario
                    <input type="text" value={datos.nombreUsuario} onChange={handleCambio('nombreUsuario')} />
                </label>
                <label className="perfil__campo">
                    Nombre
                    <input type="text" value={datos.nombre} onChange={handleCambio('nombre')} />
                </label>
                <label className="perfil__campo">
                    Apellido
                    <input type="text" value={datos.apellido} onChange={handleCambio('apellido')} />
                </label>
                <label className="perfil__campo">
                    Email
                    <input type="email" value={datos.email} onChange={handleCambio('email')} />
                </label>
                <label className="perfil__campo">
                    Teléfono
                    <input type="text" value={datos.telefono} onChange={handleCambio('telefono')} />
                </label>
                <label className="perfil__campo">
                    DNI
                    <input type="text" value={datos.dni} onChange={handleCambio('dni')} />
                </label>
                <label className="perfil__campo">
                    Nueva contraseña (dejar vacío para mantener)
                    <input type="password" value={datos.contrasena} onChange={handleCambio('contrasena')} />
                </label>

                <button type="submit" className="perfil__guardar">Guardar cambios</button>
            </form>

            {mensaje && <p className="perfil__mensaje">{mensaje}</p>}
            {error && <p className="perfil__error">{error}</p>}

            <div className="perfil__acciones">
                <button type="button" className="perfil__logout" onClick={() => navigate('/mis-canchas')}>
                    Mis canchas
                </button>
                <button type="button" className="perfil__logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
                <button type="button" className="perfil__eliminar" onClick={handleEliminar}>
                    Eliminar cuenta
                </button>
            </div>
        </main>
    );
};

export default Perfil;
