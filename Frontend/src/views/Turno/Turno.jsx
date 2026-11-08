import './Turno.css';

// Importa el hook useParams de react-router-dom para leer parámetros de la URL
import { useParams, useNavigate } from 'react-router-dom';
// useState: para saber que foto de la galeria se esta viendo.
// useEffect: para despachar los pedidos del turno y de las fotos al montarse.
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTurnoPorId } from '../../redux/turnosSlice';
import {fetchImagenesCancha} from "../../redux/canchasSlice";

import { MapPin, Calendar, Users, User, Tag } from 'lucide-react';
import { Alerta } from '../../utils/alerta';
// URL base del backend
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';
import { useAuth } from '../../context/useAuth';
import ParticipantesTurno from '../../components/ParticipantesTurno/ParticipantesTurno';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import { Boton } from '../../components/Boton/Boton';

const TIPO_FUTBOL_LABEL = {
    F5: 'Fútbol 5',
    F7: 'Fútbol 7',
    F8: 'Fútbol 8',
    F11: 'Fútbol 11',
};

const Turno = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { estaLogueado, token } = useAuth();
    const dispatch = useDispatch();
    const turno = useSelector((state) => state.turnos.seleccionado);
    const error = useSelector((state) => state.turnos.error);
    const idCancha = turno?.idCancha;
    const guardadas = useSelector((state) => state.canchas.imagenesPorCancha[idCancha]);
    const imagenes = guardadas || [];
    const [indice, setIndice] = useState(0);

    const agregarAlCarrito = async () => {
        if (!estaLogueado) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/carrito/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ idTurno: turno.idTurno, cantidad: 1 }),
            });
            if (!response.ok) throw new Error('No se pudo agregar al carrito');
            navigate('/carrito');
        } catch (error) {
            console.error('Error al agregar al carrito', error);
            Alerta.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar al carrito' });
        }
    };

    useEffect(() => {
    dispatch(fetchTurnoPorId(id));
    }, [dispatch, id]);

    // Pide las fotos de la cancha solo si todavía no están en el store
    useEffect(() => {
        if (idCancha && guardadas === undefined) dispatch(fetchImagenesCancha(idCancha));
    }, [dispatch, idCancha, guardadas]);

    const anterior = () => setIndice((i) => Math.max(i - 1, 0));
    const siguiente = () => setIndice((i) => Math.min(i + 1, imagenes.length - 1));

    if (error && !turno) return <p className="turno__cargando">No se pudo cargar el turno.</p>;
    if (!turno || String(turno.idTurno) !== id) return <p className="turno__cargando">Cargando...</p>;
    const sinCupos = turno.lugaresDisponibles <= 0;

    return (
        <main className="turno">
            <VolverAtras/>
            <div className="turno__grid">
            {}
            <div className="turno__galeria">
                {imagenes.length > 0 && (
                    <>
                        {imagenes.length > 1 && (
                            <button type="button" className="turno__flecha turno__flecha--izq" onClick={anterior} disabled={indice === 0}>‹</button>
                        )}
                        <img
                            className="turno__img"
                            src={`data:image/jpeg;base64,${imagenes[indice]}`}
                            alt={`${turno.nombreCancha} - foto ${indice + 1}`}
                        />
                        {imagenes.length > 1 && (
                            <button type="button" className="turno__flecha turno__flecha--der" onClick={siguiente} disabled={indice === imagenes.length - 1}>›</button>
                        )}
                    </>
                )}
            </div>

            {}
            <section className="turno__info">
                {}
                <div className="turno__header">
                    <span className="turno__badge">
                        {TIPO_FUTBOL_LABEL[turno.tipoFutbol] ?? turno.tipoFutbol}
                    </span>
                    {}
                    {turno.tieneOfertaActiva && (
                        <span className="turno__badge turno__badge--oferta">
                            <Tag size={14} /> ¡Oferta!
                        </span>
                    )}
                </div>

                <h1 className="turno__titulo">{turno.nombreCancha}</h1>

                {}
                <ul className="turno__datos">
                    <li className="turno__dato">
                        <MapPin size={18} className="turno__dato-icono" />
                        <span>{turno.localidad}</span>
                    </li>
                    <li className="turno__dato">
                        <Calendar size={18} className="turno__dato-icono" />
                        <span>{formatearFechaHora(turno.fechaHora)}</span>
                    </li>
                    <li className="turno__dato">
                        <Users size={18} className="turno__dato-icono" />
                        <span>Quedan {turno.lugaresDisponibles} lugares</span>
                    </li>
                    <li className="turno__dato">
                        <User size={18} className="turno__dato-icono" />
                        <span>Organiza: {turno.nombreOrganizador}</span>
                    </li>
                </ul>

                {}
                {turno.descripcion && (
                    <p className="turno__descripcion">{turno.descripcion}</p>
                )}

                {}
                <div className="turno__footer">
                    <div className="turno__precio">
                        {turno.tieneOfertaActiva ? (
                            <>
                                <span className="turno__precio--tachado">
                                    ${turno.precioPorJugador}
                                </span>
                                <span className="turno__precio--oferta">
                                    ${turno.precioConDescuento}
                                </span>
                                <span className="turno__precio-sufijo">
                                    c/u
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="turno__precio--oferta">
                                    ${turno.precioPorJugador}
                                </span>
                                <span className="turno__precio-sufijo">
                                    c/u
                                </span>
                            </>
                        )}
                    </div>

                    <Boton
                        variante="primario"
                        tamaño="grande"
                        ancho="completo"
                        type="button"
                        onClick={agregarAlCarrito}
                        disabled={sinCupos}
                    >
                        {sinCupos ? 'Sin cupos disponibles' : 'Sumarme'}
                    </Boton>
                </div>
            </section>

            <ParticipantesTurno idTurno={turno.idTurno} />
            </div>
        </main>
    );
};

export default Turno;
