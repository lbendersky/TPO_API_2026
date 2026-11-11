import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { buscarUsuarioPorEmail, eliminarUsuarioAdmin } from '../../redux/usuariosSlice';
import { crearOferta as crearOfertaThunk } from '../../redux/ofertasSlice';
import { fetchTodasCanchas, darDeBajaCancha } from '../../redux/canchasSlice';
import { fetchTodosTurnos, borrarTurno } from '../../redux/turnosSlice';
import { fetchTodasInscripciones, eliminarInscripcion } from '../../redux/inscripcionesSlice';
import BuscadorModeracion from '../../components/BuscadorModeracion/BuscadorModeracion';
import SelectorModeracion from '../../components/SelectorModeracion/SelectorModeracion';
import FormularioOferta from '../../components/FormularioOferta/FormularioOferta';
import { formatearFechaHora } from '../../utils/fecha';
import VolverAtras from '../../components/VolverAtras/VolverAtras';

import './Moderar.css';

const Moderar = () => {
    const { usuario, estaLogueado, token } = useSelector((state) => state.usuarios);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
            return;
        }
        if (usuario && usuario.rol !== 'ADMIN') {
            navigate('/');
        }
    }, [estaLogueado, usuario, navigate]);

    if (!usuario || usuario.rol !== 'ADMIN') return null;

    const conError = (promesa, mensajeFallback) =>
        promesa.catch((mensaje) => { throw new Error(typeof mensaje === 'string' ? mensaje : mensajeFallback); });

    const buscarUsuario = (email) =>
        conError(dispatch(buscarUsuarioPorEmail({ email, token })).unwrap(), 'No se pudo obtener el usuario');
    const eliminarUsuario = (u) =>
        conError(dispatch(eliminarUsuarioAdmin({ idUsuario: u.idUsuario, token })).unwrap(), 'No se pudo eliminar el usuario');

    const listarCanchas = () =>
        conError(dispatch(fetchTodasCanchas(token)).unwrap(), 'No se pudieron listar las canchas');
    const eliminarCancha = (c) =>
        conError(dispatch(darDeBajaCancha({ idCancha: c.idCancha, token })).unwrap(), 'No se pudo eliminar la cancha');

    const listarTurnos = () =>
        conError(dispatch(fetchTodosTurnos(token)).unwrap(), 'No se pudieron listar los turnos');
    const eliminarTurno = (t) =>
        conError(dispatch(borrarTurno({ idTurno: t.idTurno, token })).unwrap(), 'No se pudo eliminar el turno');

    const listarInscripciones = () =>
        conError(dispatch(fetchTodasInscripciones(token)).unwrap(), 'No se pudieron listar las inscripciones');
    const eliminarInscripcionItem = (i) =>
        conError(dispatch(eliminarInscripcion({ idInscripcion: i.idInscripcion, token })).unwrap(), 'No se pudo eliminar la inscripción');

    const crearOferta = (datos) =>
        conError(dispatch(crearOfertaThunk({ datos, token })).unwrap(), 'No se pudo crear la oferta');

    return (
        <main className="moderar">
            <VolverAtras/>
            <h1 className="moderar__titulo">Panel de moderación</h1>
            <BuscadorModeracion
                titulo="Usuarios"
                placeholder="Email del usuario"
                onBuscar={buscarUsuario}
                onEliminar={eliminarUsuario}
                puedeEliminar={(u) => u.idUsuario !== usuario.idUsuario}
                renderResultado={(u) => (
                    <dl>
                        <dt>ID</dt><dd>{u.idUsuario}</dd>
                        <dt>Nombre</dt><dd>{u.nombre} {u.apellido}</dd>
                        <dt>Email</dt><dd>{u.email}</dd>
                        <dt>Rol</dt><dd>{u.rol}</dd>
                    </dl>
                )}
            />

            <SelectorModeracion
                titulo="Canchas"
                placeholder="Seleccionar cancha"
                onListar={listarCanchas}
                onEliminar={eliminarCancha}
                getKey={(c) => c.idCancha}
                renderOpcion={(c) => `#${c.idCancha} · ${c.nombre} — ${c.localidad ?? 's/localidad'}${c.direccion ? ` (${c.direccion})` : ''}`}
                renderResultado={(c) => (
                    <dl>
                        <dt>Nombre</dt><dd>{c.nombre}</dd>
                        <dt>Dirección</dt><dd>{c.direccion ?? '-'}</dd>
                        <dt>Localidad</dt><dd>{c.localidad ?? '-'}</dd>
                        <dt>Superficie</dt><dd>{c.tipoSuperficie}</dd>
                        <dt>Activa</dt><dd>{c.activa ? 'Sí' : 'No'}</dd>
                    </dl>
                )}
            />

            <SelectorModeracion
                titulo="Turnos"
                placeholder="Seleccionar turno"
                onListar={listarTurnos}
                onEliminar={eliminarTurno}
                getKey={(t) => t.idTurno}
                renderOpcion={(t) => `#${t.idTurno} · ${t.nombreCancha ?? 'Cancha ?'} — ${formatearFechaHora(t.fechaHora)}${t.nombreOrganizador ? ` · ${t.nombreOrganizador}` : ''}`}
                renderExtra={(t) => <FormularioOferta turno={t} onCrear={crearOferta} />}
                renderResultado={(t) => (
                    <dl>
                        <dt>Cancha</dt><dd>{t.nombreCancha ?? t.idCancha}</dd>
                        <dt>Fecha y hora</dt><dd>{formatearFechaHora(t.fechaHora)}</dd>
                        <dt>Organizador</dt><dd>{t.nombreOrganizador ?? '-'}</dd>
                        <dt>Estado</dt><dd>{t.estado}</dd>
                        <dt>Precio</dt><dd>{t.precioPorJugador}</dd>
                    </dl>
                )}
            />

            <SelectorModeracion
                titulo="Inscripciones"
                tituloSingular="esta inscripción"
                placeholder="Seleccionar inscripción"
                onListar={listarInscripciones}
                onEliminar={eliminarInscripcionItem}
                getKey={(i) => i.idInscripcion}
                renderOpcion={(i) => `#${i.idInscripcion} · ${i.nombreComprador ?? 's/comprador'} → ${i.nombreCancha ?? `Turno ${i.idTurno}`} — ${formatearFechaHora(i.fechaHoraTurno)}`}
                renderResultado={(i) => (
                    <dl>
                        <dt>Comprador</dt><dd>{i.nombreComprador ?? '-'}</dd>
                        <dt>Cancha</dt><dd>{i.nombreCancha ?? i.idTurno}</dd>
                        <dt>Fecha del turno</dt><dd>{formatearFechaHora(i.fechaHoraTurno)}</dd>
                        <dt>Fecha de compra</dt><dd>{formatearFechaHora(i.fechaCompra)}</dd>
                        <dt>Monto pagado</dt><dd>{i.montoPagado}</dd>
                        <dt>Estado de pago</dt><dd>{i.estadoPago}</dd>
                    </dl>
                )}
            />
        </main>
    );
};

export default Moderar;
