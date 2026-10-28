import './Filtros.css';

import { useState } from 'react';

import { MapPin, Trophy, DollarSign, Search } from 'lucide-react';
import { FORMATOS } from '../../utils/opcionesCancha';

// Recibe por props una lista de localidades disponibles
const Filtros = ({ localidades = [], onFiltrar }) => {
    // Setea seun fitro del usuario
    const [texto, setTexto] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [tipoFutbol, setTipoFutbol] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

    const handleBuscar = () => {
        // Convierte strings vacíos a null para que el padre sepa que no hay filtro aplicado
        onFiltrar({
            texto: texto.trim() || null,
            localidad: localidad || null,
            tipoFutbol: tipoFutbol || null,
            // parseFloat convierte el string del input a número
            precioMin: precioMin ? parseFloat(precioMin) : null,
            precioMax: precioMax ? parseFloat(precioMax) : null,
        });
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') handleBuscar();
    };

    // No deja cargar precios negativos
    const handlePrecioMinChange = (e) => {
        const val = e.target.value;
        if (val === '' || Number(val) >= 0) setPrecioMin(val);
    };

    // El maximo no puede ser menor o igual al minimo cargado
    const handlePrecioMaxChange = (e) => {
        const val = e.target.value;
        const minActual = precioMin ? Number(precioMin) : 0;
        if (val === '' || (Number(val) >= 0 && Number(val) > minActual)) setPrecioMax(val);
    };

    return (
        <section className="filtros-bar">
            <div className="filtros-bar__campo filtros-bar__campo--nombre">
                {}
                <Search className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">CANCHA</label>
                    <input
                        type="text"
                        className="filtros-bar__input"
                        placeholder="Buscar por nombre..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={handleEnter}
                    />
                </div>
            </div>

            {}
            <div className="filtros-bar__separador"></div>

            <div className="filtros-bar__campo filtros-bar__campo--zona">
                {}
                <MapPin className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">BARRIO</label>
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
            <div className="filtros-bar__campo filtros-bar__campo--formato">
                {}
                <Trophy className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">TIPO</label>
                    {}
                    <select
                        className="filtros-bar__input"
                        value={tipoFutbol}
                        onChange={(e) => setTipoFutbol(e.target.value)}
                    >
                        {}
                        <option value="">Todos</option>
                        {FORMATOS.map((f) => (
                            <option key={f.valor} value={f.valor}>{f.texto}</option>
                        ))}
                    </select>
                </div>
            </div>

            {}
            <div className="filtros-bar__separador"></div>

            {}
            <div className="filtros-bar__campo filtros-bar__campo--precio">
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
                            min="0"
                            step="1000"
                            value={precioMin}
                            onChange={handlePrecioMinChange}
                        />
                        {}
                        <span className="filtros-bar__guion">-</span>
                        {}
                        <input
                            type="number"
                            className="filtros-bar__input filtros-bar__input--rango"
                            placeholder="Máx"
                            min={precioMin ? Number(precioMin) + 1000 : 0}
                            step="1000"
                            value={precioMax}
                            onChange={handlePrecioMaxChange}
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
