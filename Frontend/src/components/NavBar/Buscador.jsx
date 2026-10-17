import { useBusqueda } from '../../context/BusquedaContext';
import { useState } from 'react';

function Buscador() { // Componente que permite buscar por nombre de cancha en tiempo real
    const { textoBusqueda, setTextoBusqueda } = useBusqueda();
    const [texto, setTexto] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setTextoBusqueda(texto.trim());
    };

    return (
        <div className="buscador">
            {}
            <input
                type="text"
                placeholder="Podés escribir el nombre de la cancha acá..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                className="buscador__input"
            />
        </div>
    )
}

export default Buscador
