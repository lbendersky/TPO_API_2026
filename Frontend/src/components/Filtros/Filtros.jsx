import './Filtros.css';

import { useState } from 'react';

import { MapPin, Trophy, DollarSign } from 'lucide-react';

// Recibe por props una lista de localidades disponibles
const Filtros = ({ localidades = [], onFiltrar }) => {
    // Setea seun fitro del usuario
    const [localidad, setLocalidad] = useState('');
    const [tipoFutbol, setTipoFutbol] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

    const handleBuscar = () => {
        // Convierte strings vacíos a null para que el padre sepa que no hay filtro aplicado
        onFiltrar({
            localidad: localidad || null,
            tipoFutbol: tipoFutbol || null,
            // parseFloat convierte el string del input a número
            precioMin: precioMin ? parseFloat(precioMin) : null,
            precioMax: precioMax ? parseFloat(precioMax) : null,
        });
    };

    return (
        <section className="filtros-bar">
            <div className="filtros-bar__campo">
                {}
                <MapPin className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">BARRIO O ZONA</label>
                    <select
                        className="filtros-bar__input"
                        value={localidad}
                        // Cada vez que cambia la selección, actualiza el estado local
                        onChange={(e) => setLocalidad(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {}
                        {localidades.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </div>

            {}
            <div className="filtros-bar__separador"></div>

            {}
            <div className="filtros-bar__campo">
                {}
                <Trophy className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">FORMATO</label>
                    {}
                    <select
                        className="filtros-bar__input"
                        value={tipoFutbol}
                        onChange={(e) => setTipoFutbol(e.target.value)}
                    >
                        {}
                        <option value="">Todos</option>
                        {}
                        <option value="F5">Fútbol 5</option>
                        <option value="F7">Fútbol 7</option>
                        <option value="F11">Fútbol 11</option>
                    </select>
                </div>
            </div>

            {}
            <div className="filtros-bar__separador"></div>

            {}
            <div className="filtros-bar__campo">
                {}
                <DollarSign className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">RANGO DE PRECIO</label>
                    {}
                    <div className="filtros-bar__rango">
                        {}
                        <input
                            type="number"
                            className="filtros-bar__input filtros-bar__input--rango"
                            placeholder="Mín"
                            value={precioMin}
                            onChange={(e) => setPrecioMin(e.target.value)}
                        />
                        {}
                        <span className="filtros-bar__guion">-</span>
                        {}
                        <input
                            type="number"
                            className="filtros-bar__input filtros-bar__input--rango"
                            placeholder="Máx"
                            value={precioMax}
                            onChange={(e) => setPrecioMax(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {}
            <button className="filtros-bar__boton" onClick={handleBuscar}>
                Buscar
            </button>
        </section>
    );
};


export default Filtros;
