import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

// Muestra las fotos de una cancha con flechas para pasar de una a otra
const CarruselCancha = ({ idCancha, nombre }) => {
    const [imagenes, setImagenes] = useState([]);
    const [indice, setIndice] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/imagenes/cancha/${idCancha}`)
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron cargar las fotos');
                return response.json();
            })
            .then((data) => {
                setImagenes(data.map((img) => img.file));
                setIndice(0);
            })
            .catch((error) => console.error('Error al cargar la imagen', error));
    }, [idCancha]);

    const anterior = () => setIndice(Math.max(indice - 1, 0));
    const siguiente = () => setIndice(Math.min(indice + 1, imagenes.length - 1));

    if (imagenes.length === 0) return null;

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