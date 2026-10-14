// Importa los estilos del componente para que se apliquen al renderizar
import './TurnoList.css';

// Importa los hooks useState (estado) y useMemo (valores derivados cacheados) de React
import { useState, useMemo } from 'react';
// Importa el componente de tarjeta individual que muestra cada turno
import TurnoCard from './TurnoCard';
// Importa el componente de la barra de filtros horizontal
import Filtros from './Filtros';

// Componente funcional TurnoList: lista los turnos y permite filtrarlos
const TurnoList = () => {
    // Estado con el array de turnos (por ahora datos mock, en el futuro vendrán del backend)
    const [turnos, setTurnos] = useState([
        {
            idTurno: 1,
            fechaHora: 'Viernes 20:00',
            tipoFutbol: 'F5',
            lugaresDisponibles: 3,
            precioPorJugador: 3500,
            descripcion: 'Partido amistoso, nivel intermedio.',
            imagenPath: 'https://via.placeholder.com/300x160?text=Cancha',
            nombreCancha: 'La Bombonerita',
            localidad: 'Caballito',
            nombreOrganizador: 'Juan Perez',
            precioConDescuento: 3500,
            tieneOfertaActiva: false,
            estado: 'INCOMPLETO',
        },
        {
            idTurno: 2,
            fechaHora: 'Sabado 18:00',
            tipoFutbol: 'F7',
            lugaresDisponibles: 1,
            precioPorJugador: 4200,
            imagenPath: 'https://via.placeholder.com/300x160?text=Cancha',
            nombreCancha: 'El Potrero',
            localidad: 'Flores',
            nombreOrganizador: 'Martin Gomez',
            precioConDescuento: 3570,
            tieneOfertaActiva: true,
            estado: 'INCOMPLETO',
        },
        {
            idTurno: 3,
            fechaHora: 'Domingo 10:00',
            tipoFutbol: 'F11',
            lugaresDisponibles: 5,
            precioPorJugador: 5000,
            descripcion: 'Torneo interno, cancha de 11.',
            imagenPath: 'https://via.placeholder.com/300x160?text=Cancha',
            nombreCancha: 'Complejo Norte',
            localidad: 'Nuñez',
            nombreOrganizador: 'Lucas Fernandez',
            precioConDescuento: 5000,
            tieneOfertaActiva: false,
            estado: 'INCOMPLETO',
        },
    ]);

    // Estado con los filtros aplicados actualmente (null = sin filtro)
    const [filtros, setFiltros] = useState({
        localidad: null,
        tipoFutbol: null,
        precioMin: null,
        precioMax: null,
    });

    // --- CÓDIGO LISTO PARA CONECTAR AL BACKEND EN EL FUTURO ---
    // Cuando conectemos al backend, reemplazar el useState hardcodeado por un useEffect así:
    //
    // const API_URL = 'http://localhost:8080'; // Idealmente desde una variable de entorno
    //
    // useEffect(() => {
    //     // Al montar el componente, trae los turnos disponibles del backend
    //     fetch(`${API_URL}/turnos/disponibles`)
    //         .then((res) => res.json())
    //         .then((data) => setTurnos(data));
    // }, []);
    //
    // Y la función aplicarFiltros debería hacer un fetch a /turnos/filtrar:
    //
    // const aplicarFiltros = (nuevosFiltros) => {
    //     const params = new URLSearchParams();
    //     if (nuevosFiltros.tipoFutbol) params.append('tipoFutbol', nuevosFiltros.tipoFutbol);
    //     if (nuevosFiltros.precioMin != null) params.append('precioMin', nuevosFiltros.precioMin);
    //     if (nuevosFiltros.precioMax != null) params.append('precioMax', nuevosFiltros.precioMax);
    //     if (nuevosFiltros.localidad) params.append('localidad', nuevosFiltros.localidad);
    //     fetch(`${API_URL}/turnos/filtrar?${params.toString()}`)
    //         .then((res) => res.json())
    //         .then((data) => setTurnos(data));
    // };
    // -----------------------------------------------------------

    // Función que se pasa a Filtros como prop onFiltrar: guarda los filtros en estado
    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    // useMemo: calcula la lista de localidades únicas a partir de los turnos
    // Se recalcula sólo cuando cambia "turnos" (optimización para no recalcular en cada render)
    const localidades = useMemo(() => {
        // Set elimina duplicados; map extrae la localidad de cada turno
        return [...new Set(turnos.map((t) => t.localidad))];
    }, [turnos]);

    // useMemo: aplica los filtros en memoria sobre el array mock
    // Se recalcula cuando cambia la lista de turnos o los filtros aplicados
    const turnosFiltrados = useMemo(() => {
        return turnos.filter((t) => {
            // Sólo mostrar turnos con estado INCOMPLETO (en el futuro lo hará /turnos/disponibles)
            if (t.estado !== 'INCOMPLETO') return false;
            // Filtra por localidad si está seleccionada
            if (filtros.localidad && t.localidad !== filtros.localidad) return false;
            // Filtra por tipo de fútbol si está seleccionado
            if (filtros.tipoFutbol && t.tipoFutbol !== filtros.tipoFutbol) return false;
            // Filtra por precio mínimo si está definido
            if (filtros.precioMin != null && t.precioPorJugador < filtros.precioMin) return false;
            // Filtra por precio máximo si está definido
            if (filtros.precioMax != null && t.precioPorJugador > filtros.precioMax) return false;
            // Si pasó todos los filtros, se incluye en la lista final
            return true;
        });
    }, [turnos, filtros]);

    // JSX que renderiza la barra de filtros arriba y la grilla de tarjetas abajo
    return (
        <>
            {/* Barra de filtros: le pasamos las localidades disponibles y el callback */}
            <Filtros localidades={localidades} onFiltrar={aplicarFiltros} />

            {/* Grilla con las tarjetas de los turnos ya filtrados */}
            <section className="turno-list">
                {/* Recorre el array filtrado y renderiza una TurnoCard por cada turno */}
                {turnosFiltrados.map((value) => (
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
                {turnosFiltrados.length === 0 && (
                    <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                )}
            </section>
        </>
    );
};

// Exporta el componente para poder importarlo desde Inicio.jsx
export default TurnoList;
