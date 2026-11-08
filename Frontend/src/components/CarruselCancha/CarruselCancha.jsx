import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchImagenesCancha} from "../../redux/canchasSlice";

// Muestra las fotos de una cancha con flechas para pasar de una a otra
const CarruselCancha = ({ idCancha, nombre }) => {
    const dispatch = useDispatch();
    const imagenes = useSelector((state) => state.canchas.imagenesPorCancha[idCancha]);
    const [indice, setIndice] = useState(0);

    useEffect(() => {
        if (imagenes === undefined) dispatch(fetchImagenesCancha(idCancha));
    }, [dispatch, idCancha, imagenes]);

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