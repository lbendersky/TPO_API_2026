import './Turno.css';

// Importa el hook useParams de react-router-dom para leer parámetros de la URL
import { useParams, useNavigate } from 'react-router-dom';
// useState: para guardar el turno traído del back.
// useEffect: para disparar el fetch cuando se monta el componente o cambia el id.
import { useState, useEffect } from 'react';

import { MapPin, Calendar, Users, User, Tag } from 'lucide-react';
import { Alerta } from '../../utils/alerta';
// URL base del backend
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';
import { useAuth } from '../../context/useAuth';
import ParticipantesTurno from '../../components/ParticipantesTurno/ParticipantesTurno';

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
    const [turno, setTurno] = useState(null);
    const [imagenes, setImagenes] = useState([]);
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
        fetch(`${API_URL}/turnos/${id}`)
            .then((response) => response.json())
            .then((data) => setTurno(data))
            .catch((error) => console.error('Error al cargar turno', error));
    }, [id]);

        useEffect(() => {
        if (!turno?.idCancha) return;
        fetch(`${API_URL}/imagenes/cancha/${turno.idCancha}`)
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => {
                setImagenes(data);
                setIndice(0);
            })
            .catch((e) => console.error('Error al cargar las imágenes', e));
    }, [turno]);

    const anterior = () => setIndice((i) => Math.max(i - 1, 0));
    const siguiente = () => setIndice((i) => Math.min(i + 1, imagenes.length - 1));

    if (!turno) return <p className="turno__cargando">Cargando...</p>;

    const sinCupos = turno.lugaresDisponibles <= 0;

    return (
        <main className="turno">
            {}
            <div className="turno__galeria">
                {imagenes.length > 0 && (
                    <>
                        {imagenes.length > 1 && (
                            <button type="button" className="turno__flecha turno__flecha--izq" onClick={anterior} disabled={indice === 0}>‹</button>
                        )}
                        <img
                            className="turno__img"
                            src={`data:image/jpeg;base64,${imagenes[indice].file}`}
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

                    <button
                        className="turno__cta"
                        type="button"
                        onClick={agregarAlCarrito}
                        disabled={sinCupos}
                    >
                        {sinCupos ? 'Sin cupos disponibles' : 'Sumarme'}
                    </button>
                </div>
            </section>

            <ParticipantesTurno idTurno={turno.idTurno} />
        </main>
    );
};

export default Turno;
