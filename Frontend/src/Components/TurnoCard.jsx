import './TurnoCard.css';

const TurnoCard = ({
    fechaHora,
    tipoFutbol,
    lugaresDisponibles,
    precioPorJugador,
    descripcion,
    imagenPath,
    estado,
    nombreCancha,
    localidad,
    nombreOrganizador,
    precioConDescuento,
    tieneOfertaActiva,
}) => {
    return (
        <a href="#" className="turno-card-link">
        <article className="turno-card">
            <img className="turno-card__img" src={imagenPath} alt={nombreCancha} />
            <div className="turno-card__body">
                <h3 className="turno-card__titulo">{nombreCancha}</h3>
                <p className="turno-card__localidadTipo">{localidad} - {tipoFutbol}</p>
                <p className="turno-card__fechaCupos">{fechaHora} - Quedan {lugaresDisponibles} lugares</p>
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
                <p className="turno-card__descripcion">{descripcion}</p>
            </div>
        </article>
        </a>
    );
};

export default TurnoCard;
