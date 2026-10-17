import './TurnoList.css';

import { useState, useEffect } from 'react';
import TurnoCard from '../TurnoCard/TurnoCard';
import Filtros from '../Filtros/Filtros';
import { useBusqueda } from '../../context/BusquedaContext';
import { API_URL } from '../../config';

const TurnoList = () => {
    const [turnos, setTurnos] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    // Filtro en null por defecto
    const [filtros, setFiltros] = useState({
        localidad: null,
        tipoFutbol: null,
        precioMin: null,
        precioMax: null,
    });

    const { textoBusqueda } = useBusqueda();

    useEffect(() => {
        fetch(`${API_URL}/localidades`)
            .then((response) => response.json())
            .then((data) => setLocalidades(data.map((l) => l.nombre)))
            .catch((error) => console.error('Error al cargar localidades', error));
    }, []);

    useEffect(() => {
        let url = `${API_URL}/turnos/filtrar?`;
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

    return (
        <>
            {}
            <Filtros localidades={localidades} onFiltrar={setFiltros} />

            {}
            <section className="turno-list">
                {/* Recorre el array filtrado y renderiza una TurnoCard por cada turno */}
                {turnos.map((value) => (
                    <TurnoCard
                        key={value.idTurno}
                        idTurno={value.idTurno}
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
                {}
                {turnos.length === 0 && (
                    <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                )}
            </section>
        </>
    );
};

export default TurnoList;
