// Estilos propios de la vista de detalle del turno
import './Turno.css';

// useParams: hook de react-router que lee los parámetros dinámicos de la URL.
// En nuestra ruta "/turno/:id", nos devuelve { id: "<lo que haya en la URL>" }.
import { useParams } from 'react-router-dom';
// useState: para guardar el turno traído del back.
// useEffect: para disparar el fetch cuando se monta el componente o cambia el id.
import { useState, useEffect } from 'react';
// Íconos de lucide-react para hacer el panel más vistoso
import { MapPin, Calendar, Users, User, Tag } from 'lucide-react';
// URL base del backend (definida en src/config.js a partir de VITE_API_URL)
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';

// Mapeo del enum del back (F5, F7, F8, F11) al texto legible que mostramos al usuario
const TIPO_FUTBOL_LABEL = {
    F5: 'Fútbol 5',
    F7: 'Fútbol 7',
    F8: 'Fútbol 8',
    F11: 'Fútbol 11',
};

const Turno = () => {
    // Extraemos el id de la URL. OJO: viene como string.
    const { id } = useParams();

    // Estado donde guardamos el turno. null = todavía no cargó.
    const [turno, setTurno] = useState(null);

    // Efecto que se ejecuta cada vez que cambia el id de la URL.
    // Hace GET /turnos/{id} al back y guarda la respuesta en el estado.
    useEffect(() => {
        fetch(`${API_URL}/turnos/${id}`)
            .then((response) => response.json())
            .then((data) => setTurno(data))
            .catch((error) => console.error('Error al cargar turno', error));
    }, [id]);

    // Mientras no haya respuesta mostramos un mensaje simple de carga
    if (!turno) return <p className="turno__cargando">Cargando...</p>;

    return (
        <main className="turno">
            {/* Imagen principal de la cancha. imagenPath viene como ruta relativa, por eso le anteponemos API_URL */}
            <img
                className="turno__img"
                src={`${API_URL}/${turno.imagenPath}`}
                alt={turno.nombreCancha}
            />

            {/* Panel con toda la info del turno */}
            <section className="turno__info">
                {/* Header del panel: badge con el tipo de fútbol + título */}
                <div className="turno__header">
                    <span className="turno__badge">
                        {TIPO_FUTBOL_LABEL[turno.tipoFutbol] ?? turno.tipoFutbol}
                    </span>
                    {/* Si hay oferta activa mostramos un badge adicional llamando la atención */}
                    {turno.tieneOfertaActiva && (
                        <span className="turno__badge turno__badge--oferta">
                            <Tag size={14} /> ¡Oferta!
                        </span>
                    )}
                </div>

                <h1 className="turno__titulo">{turno.nombreCancha}</h1>

                {/* Lista de datos clave con íconos: localidad, fecha y cupos */}
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

                {/* Descripción libre del turno (solo si viene). Separada en su propio bloque. */}
                {turno.descripcion && (
                    <p className="turno__descripcion">{turno.descripcion}</p>
                )}

                {/* Bloque final: precio prominente + CTA.
                    Usamos un contenedor para que precio y botón queden alineados al pie. */}
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

                    <button className="turno__cta" type="button">
                        Sumarme
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Turno;
