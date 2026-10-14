import './TurnoCard.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';

const TurnoCard = ({
    idTurno,
    fechaHora,
    tipoFutbol,
    lugaresDisponibles,
    precioPorJugador,
    descripcion,
    imagenPath,
    nombreCancha,
    localidad,
    nombreOrganizador,
    precioConDescuento,
    tieneOfertaActiva,
}) => {
    return (
        <Link to={`/turno/${idTurno}`} className="turno-card-link">
        <article className="turno-card">
            <img className="turno-card__img" src={`${API_URL}/${imagenPath}`} alt={nombreCancha} />
            <div className="turno-card__body">
                <h3 className="turno-card__titulo">{nombreCancha}</h3>
                <p className="turno-card__localidadTipo">{localidad} - {tipoFutbol}</p>
                <p className="turno-card__fechaCupos">{formatearFechaHora(fechaHora)}</p>
                <p className="turno-card__fechaCupos">Quedan {lugaresDisponibles} lugares</p>
                <p className="turno-card__precio">
                    {tieneOfertaActiva ? (
                        <>
                            <span className="turno-card__precio--tachado">${precioPorJugador}</span>
                            <span className="turno-card__precio--oferta"> ${precioConDescuento} c/u</span>
                        </>
                    ) : (
                        <>${precioPorJugador} c/u</>
                    )}
                </p>
                <p className="turno-card__organizador">Organiza: {nombreOrganizador}</p> 
                <p className="turno-card__descripcion">{descripcion || "\u00A0"}</p> 
            </div>
        </article>
        </Link>
    );
};

export default TurnoCard;
