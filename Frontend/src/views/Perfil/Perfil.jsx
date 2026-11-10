import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmarEliminar } from '../../utils/alerta';
import { actualizarPerfil, eliminarCuenta as eliminarCuentaThunk, logout } from '../../redux/usuariosSlice';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import './Perfil.css';
import { Boton } from '../../components/Boton/Boton';

const Perfil = () => {
    const dispatch = useDispatch();
    const { usuario, token, estaLogueado } = useSelector((state) => state.usuarios);
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
    contrasenaActual: '',
}));

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    const handleCambio = (campo) => (e) => {
        setDatos({ ...datos, [campo]: e.target.value });
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');
        if (datos.contrasena && !datos.contrasenaActual) {
            setError('Ingresá tu contraseña actual para poder cambiarla.');
            return;
        }
    const payload = { ...datos };
        if (!payload.contrasena) {
            delete payload.contrasena;
            delete payload.contrasenaActual;
        }
        if (!payload.dni) delete payload.dni;

        dispatch(actualizarPerfil({ idUsuario: usuario.idUsuario, datos: payload, token }))
            .unwrap()
            .then(() => {
                setMensaje('Datos actualizados');
                setDatos({ ...datos, contrasena: '', contrasenaActual: '' });
            })
            .catch((mensaje) => setError(typeof mensaje === 'string' ? mensaje : 'No se pudo actualizar el usuario'));
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleEliminar = async () => {
        const resultado = await confirmarEliminar('cuenta');
        if (!resultado.isConfirmed) return;
        dispatch(eliminarCuentaThunk({ idUsuario: usuario.idUsuario, token }))
            .unwrap()
            .then(() => navigate('/'))
            .catch((mensaje) => setError(typeof mensaje === 'string' ? mensaje : 'No se pudo eliminar la cuenta'));
    };

    if (!usuario) return null;

    return (
        <main className="perfil">
            <VolverAtras/>
            {usuario.rol === 'ADMIN' && (
                <button
                    type="button"
                    className="perfil__moderar"
                    onClick={() => navigate('/moderar')}
                >
                    Moderar
                </button>
            )}
            <div className="perfil__encabezado">
                <h1 className="perfil__titulo">Mi perfil</h1>
                <div className="perfil__encabezado-botones">
                    <Boton type="button" variante="secundario" onClick={() => navigate('/mis-canchas')}> Mis canchas
                    </Boton>
                    <Boton type="button" variante="secundario" onClick={() => navigate('/mis-inscripciones')}> Mis inscripciones
                    </Boton>
                </div>
            </div>

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
                <label className="perfil__campo">
                    Contraseña actual (solo si vas a cambiarla)
                    <input type="password" value={datos.contrasenaActual} onChange={handleCambio('contrasenaActual')} />
                </label>

                <Boton type="submit" variante="primario" tamaño="grande">Guardar cambios</Boton>
            </form>

            {mensaje && <p className="perfil__mensaje">{mensaje}</p>}
            {error && <p className="perfil__error">{error}</p>}

            <div className="perfil__acciones">
                <Boton type="button" variante="secundario" onClick={handleLogout}>
                    Cerrar sesión
                </Boton>
                <Boton type="button" variante="peligro" onClick={handleEliminar}>
                    Eliminar cuenta
                </Boton>
            </div>
        </main>
    );
};

export default Perfil;
