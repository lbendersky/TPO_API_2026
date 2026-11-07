import './TurnoCard.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';
import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

// Varios turnos pueden compartir la misma cancha, y cada TurnoCard pedía
// sus fotos por separado -> la misma cancha se bajaba 1 vez por cada
// turno que aparecía en el catálogo. Esta caché (fuera del componente,
// compartida entre todas las instancias) hace que las fotos de una
// cancha se pidan una sola vez, sin importar cuántas tarjetas la usen.
const cacheImagenesPorCancha = new Map();

function pedirImagenesDeCancha(idCancha) {
    if (!cacheImagenesPorCancha.has(idCancha)) {
        const promesa = fetch(`${API_URL}/imagenes/cancha/${idCancha}`)
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => data.map((img) => img.file))
            .catch((e) => {
                cacheImagenesPorCancha.delete(idCancha); // si falla, que se pueda reintentar despues
                throw e;
            });
        cacheImagenesPorCancha.set(idCancha, promesa);
    }
    return cacheImagenesPorCancha.get(idCancha);
}

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
    
    //Pide imagen/es a back (compartido entre tarjetas de la misma cancha)
    useEffect(() => {
        if (!idCancha) return;
        let cancelado = false;
        pedirImagenesDeCancha(idCancha)
            .then((archivos) => {
                if (cancelado) return;
                setImagenes(archivos);
                setIndice(0);
            })
            .catch((e) => console.error('Error al cargar la imagen', e));
        return () => { cancelado = true; };
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
