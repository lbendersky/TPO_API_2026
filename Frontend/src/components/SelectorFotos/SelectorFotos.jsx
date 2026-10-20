import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

const SelectorFotos = ({ elegidas, onCambiar }) => {
    const [precargadas, setPrecargadas] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/imagenes/precargadas`)
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron cargar las fotos');
                return response.json();
            })
            .then((data) => setPrecargadas(data))
            .catch((error) => console.error('Error al cargar las fotos precargadas', error));
    }, []);

    const toggleFoto = (id) => {
        if (elegidas.includes(id)) onCambiar(elegidas.filter((f) => f !== id));
        else onCambiar([...elegidas, id]);
    };

    return (
        <div className="form-cancha__completo">
            <p>Foto de la cancha</p>
            <div className="form-cancha__fotos">
                {precargadas.map((img) => (
                    <img
                        key={img.id}
                        src={`data:image/png;base64,${img.file}`}
                        alt={img.nombre}
                        title={img.nombre}
                        onClick={() => toggleFoto(img.id)}
                        className={`form-cancha__foto ${elegidas.includes(img.id) ? 'form-cancha__foto--elegida' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SelectorFotos;