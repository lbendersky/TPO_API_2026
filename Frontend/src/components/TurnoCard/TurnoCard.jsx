import './TurnoCard.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';
import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

const TurnoCard = ({
    idTurno,
    idCancha,
    fechaHora,
    tipoFutbol,
    lugaresDisponibles,
    precioPorJugador,
    descripcion,
    nombreCancha,
    localidad,
    nombreOrganizador,
    precioConDescuento,
    tieneOfertaActiva,
}) => {

    const [imagenes, setImagenes] = useState([]);
    const [indice, setIndice] = useState(0);
    
    //Pide imagen/es a back
    useEffect(() => {
        if (!idCancha) return;
        fetch(`${API_URL}/imagenes/cancha/${idCancha}`)
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => {
                setImagenes(data.map((img) => img.file));
                setIndice(0);
            })
            .catch((e) => console.error('Error al cargar la imagen', e));
    }, [idCancha]);

    const anterior = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIndice((i) => Math.max(i - 1, 0));
    };
    const siguiente = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIndice((i) => Math.min(i + 1, imagenes.length - 1));
    };
    
    return (
        <Link to={`/turno/${idTurno}`} className="turno-card-link">
        <article className="turno-card">
            <div className="turno-card__carrusel">
                {imagenes.length > 0 ? (
                    <>
                        {imagenes.length > 1 && (
                            <button type="button" className="turno-card__flecha turno-card__flecha--izq" onClick={anterior} disabled={indice === 0}>‹</button>
                        )}
                        <img className="turno-card__img" src={`data:image/jpeg;base64,${imagenes[indice]}`} alt={nombreCancha} />
                        {imagenes.length > 1 && (
                            <button type="button" className="turno-card__flecha turno-card__flecha--der" onClick={siguiente} disabled={indice === imagenes.length - 1}>›</button>
                        )}
                    </>
                ) : (
                    <div className="turno-card__img turno-card__img--placeholder">
                        <ImageOff className="turno-card__img-icono" />
                    </div>
                )}
            </div>
            <div className="turno-card__body">
                <h3 className="turno-card__titulo">{nombreCancha}</h3>
                <p className="turno-card__localidadTipo">{localidad} - {tipoFutbol}</p>
                <p className="turno-card__fechaCupos turno-card__fechaCupos--fecha">{formatearFechaHora(fechaHora)}</p>
                <p className="turno-card__fechaCupos turno-card__fechaCupos--cupos">Quedan {lugaresDisponibles} lugares</p>
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
