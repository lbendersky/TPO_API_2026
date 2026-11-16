import { useState } from 'react';
import { useSelector } from "react-redux";

// Muestra las fotos de una cancha con flechas para pasar de una a otra
const CarruselCancha = ({ idCancha, nombre }) => {
    const imagenes = useSelector((state) => state.canchas.imagenesPorCancha[idCancha]);
    const [indice, setIndice] = useState(0);

    const lista = imagenes || [];
    const anterior = () => setIndice(Math.max(indice - 1, 0));
    const siguiente = () => setIndice(Math.min(indice + 1, lista.length - 1));

    if (lista.length === 0) return null;

    return (
        <div className="cancha-propia__carrusel">
            {imagenes.length > 1 && (
                <button type="button" className="cancha-propia__flecha cancha-propia__flecha--izq" onClick={anterior} disabled={indice === 0}>‹</button>
            )}
            <img className="cancha-propia__img" src={`data:image/jpeg;base64,${imagenes[indice]}`} alt={nombre} />
            {imagenes.length > 1 && (
                <button type="button" className="cancha-propia__flecha cancha-propia__flecha--der" onClick={siguiente} disabled={indice === imagenes.length - 1}>›</button>
            )}
        </div>
    );
};

export default CarruselCancha;