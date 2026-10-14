import './Filtros.css';

import { useState } from 'react';
// Íconos SVG listos como componentes de React (toman color via "color" en CSS, y size via width/height)
import { MapPin, Trophy, DollarSign } from 'lucide-react';

// Recibe por props una lista de localidades disponibles
const Filtros = ({ localidades = [], onFiltrar }) => {
    // Estado local para la localidad seleccionada (string vacío = sin filtro)
    const [localidad, setLocalidad] = useState('');
    // Estado local para el tipo de fútbol seleccionado (F5, F7, F11 o vacío)
    const [tipoFutbol, setTipoFutbol] = useState('');
    // Estado local para el precio mínimo ingresado (string vacío = sin filtro)
    const [precioMin, setPrecioMin] = useState('');
    // Estado local para el precio máximo ingresado (string vacío = sin filtro)
    const [precioMax, setPrecioMax] = useState('');

    const handleBuscar = () => {
        // Convierte strings vacíos a null para que el padre sepa que no hay filtro aplicado
        onFiltrar({
            localidad: localidad || null,
            tipoFutbol: tipoFutbol || null,
            // parseFloat convierte el string del input a número; si está vacío queda null
            precioMin: precioMin ? parseFloat(precioMin) : null,
            precioMax: precioMax ? parseFloat(precioMax) : null,
        });
    };

    return (
        <section className="filtros-bar">
            <div className="filtros-bar__campo">
                {/* Ícono Lucide "MapPin": hereda el color desde .filtros-bar__icono (var(--verdeOscuro)) */}
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

            {/* Separador vertical entre campos */}
            <div className="filtros-bar__separador"></div>

            {/* Segundo campo: Formato (tipo de fútbol F5/F7/F11) */}
            <div className="filtros-bar__campo">
                {}
                <Trophy className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">FORMATO</label>
                    {/* Select controlado para el tipo de fútbol */}
                    <select
                        className="filtros-bar__input"
                        value={tipoFutbol}
                        onChange={(e) => setTipoFutbol(e.target.value)}
                    >
                        {/* Opción por defecto que representa "cualquier tipo" */}
                        <option value="">Todos</option>
                        {/* Opciones hardcodeadas que coinciden con el enum TipoFutbol del backend */}
                        <option value="F5">Fútbol 5</option>
                        <option value="F7">Fútbol 7</option>
                        <option value="F11">Fútbol 11</option>
                    </select>
                </div>
            </div>

            {/* Separador vertical entre campos */}
            <div className="filtros-bar__separador"></div>

            {/* Tercer campo: Rango de precio (dos inputs numéricos min y max) */}
            <div className="filtros-bar__campo">
                {/* Ícono Lucide "DollarSign" */}
                <DollarSign className="filtros-bar__icono" />
                <div className="filtros-bar__contenido">
                    <label className="filtros-bar__label">RANGO DE PRECIO</label>
                    {/* Contenedor para los dos inputs min/max en línea */}
                    <div className="filtros-bar__rango">
                        {/* Input controlado para el precio mínimo */}
                        <input
                            type="number"
                            className="filtros-bar__input filtros-bar__input--rango"
                            placeholder="Mín"
                            value={precioMin}
                            onChange={(e) => setPrecioMin(e.target.value)}
                        />
                        {/* Separador visual entre los dos inputs */}
                        <span className="filtros-bar__guion">-</span>
                        {/* Input controlado para el precio máximo */}
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

            {/* Botón "BUSCAR TURNOS" que dispara el filtrado al hacer click */}
            <button className="filtros-bar__boton" onClick={handleBuscar}>
                Buscar
            </button>
        </section>
    );
};

// Exporta el componente para poder importarlo desde otros archivos (ej: TurnoList.jsx)
export default Filtros;
