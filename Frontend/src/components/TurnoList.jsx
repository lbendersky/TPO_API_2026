// Importa los estilos del componente para que se apliquen al renderizar
import './TurnoList.css';

// Importa los hooks useState (estado) y useEffect (efectos secundarios) de React
import { useState, useEffect } from 'react';
// Importa el componente de tarjeta individual que muestra cada turno
import TurnoCard from './TurnoCard';
// Importa el componente de la barra de filtros horizontal
import Filtros from './Filtros';
// Hook del contexto de búsqueda: nos permite leer el texto que escribe el usuario en el NavBar
import { useBusqueda } from '../context/BusquedaContext';

// Componente funcional TurnoList: lista los turnos y permite filtrarlos

const URL = 'http://localhost:8080';

const TurnoList = () => {
    const [turnos, setTurnos] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    // Estado con los filtros aplicados actualmente (null = sin filtro)
    const [filtros, setFiltros] = useState({
        localidad: null,
        tipoFutbol: null,
        precioMin: null,
        precioMax: null,
    });

    const { textoBusqueda } = useBusqueda();

    useEffect(() => {
        fetch(`${URL}/localidades`)
            .then((response) => response.json())
            .then((data) => setLocalidades(data.map((l) => l.nombre)))
            .catch((error) => console.error('Error al cargar localidades', error));
    }, []);

    useEffect(() => {
        let url = `${URL}/turnos/filtrar?`;
        if (filtros.localidad) url = url + `localidad=${filtros.localidad}&`;
        if (filtros.tipoFutbol) url = url + `tipoFutbol=${filtros.tipoFutbol}&`;
        if (filtros.precioMin != null) url = url + `precioMin=${filtros.precioMin}&`;
        if (filtros.precioMax != null) url = url + `precioMax=${filtros.precioMax}&`;
        if (textoBusqueda) url = url + `texto=${textoBusqueda}&`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => setTurnos(data))
            .catch((error) => console.error('Error al cargar turnos', error));
    }, [filtros, textoBusqueda]);

    // JSX que renderiza la barra de filtros arriba y la grilla de tarjetas abajo
    return (
        <>
            {/* Barra de filtros: le pasamos las localidades disponibles y el callback */}
            <Filtros localidades={localidades} onFiltrar={setFiltros} />

            {/* Grilla con las tarjetas de los turnos ya filtrados */}
            <section className="turno-list">
                {/* Recorre el array filtrado y renderiza una TurnoCard por cada turno */}
                {turnos.map((value) => (
                    <TurnoCard
                        key={value.idTurno}
                        fechaHora={value.fechaHora}
                        tipoFutbol={value.tipoFutbol}
                        lugaresDisponibles={value.lugaresDisponibles}
                        precioPorJugador={value.precioPorJugador}
                        descripcion={value.descripcion}
                        imagenPath={value.imagenPath}
                        nombreCancha={value.nombreCancha}
                        localidad={value.localidad}
                        nombreOrganizador={value.nombreOrganizador}
                        precioConDescuento={value.precioConDescuento}
                        tieneOfertaActiva={value.tieneOfertaActiva}
                    />
                ))}
                {/* Mensaje opcional cuando no hay resultados que coincidan con los filtros */}
                {turnos.length === 0 && (
                    <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                )}
            </section>
        </>
    );
};

// Exporta el componente para poder importarlo desde Inicio.jsx
export default TurnoList;
