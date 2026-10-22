import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../config';
import BuscadorModeracion from '../../components/BuscadorModeracion/BuscadorModeracion';
import SelectorModeracion from '../../components/SelectorModeracion/SelectorModeracion';
import FormularioOferta from '../../components/FormularioOferta/FormularioOferta';
import { formatearFechaHora } from '../../utils/fecha';
import './Moderar.css';

const Moderar = () => {
    const { usuario, estaLogueado, token } = useAuth();
    const navigate = useNavigate();

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

    const headersAuth = { 'Authorization': `Bearer ${token}` };

    const pedir = async (url, options = {}) => {
        const response = await fetch(url, { ...options, headers: { ...headersAuth, ...(options.headers || {}) } });
        if (response.status === 404) throw new Error('No se encontró el registro.');
        if (!response.ok) throw new Error('Error en la operación.');
        return response.status === 204 ? null : response.json().catch(() => null);
    };

    const buscarUsuario = (email) => pedir(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`);
    const eliminarUsuario = (u) => pedir(`${API_URL}/usuarios/${u.idUsuario}`, { method: 'DELETE' });

    const listarCanchas = () => pedir(`${API_URL}/canchas`);
    const eliminarCancha = (c) => pedir(`${API_URL}/canchas/${c.idCancha}`, { method: 'DELETE' });

    const listarTurnos = () => pedir(`${API_URL}/turnos`);
    const eliminarTurno = (t) => pedir(`${API_URL}/turnos/${t.idTurno}`, { method: 'DELETE' });

    const listarInscripciones = () => pedir(`${API_URL}/inscripciones`);
    const eliminarInscripcion = (i) => pedir(`${API_URL}/inscripciones/${i.idInscripcion}`, { method: 'DELETE' });
    const crearOferta = (body) => pedir(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return (
        <main className="moderar">
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
                onEliminar={eliminarInscripcion}
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
