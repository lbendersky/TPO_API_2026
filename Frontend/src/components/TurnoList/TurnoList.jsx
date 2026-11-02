import './TurnoList.css';

import { useState, useEffect } from 'react';
import TurnoCard from '../TurnoCard/TurnoCard';
import Filtros from '../Filtros/Filtros';
import { API_URL } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalidades } from '../../redux/localidadesSlice';

const TurnoList = () => {
    const [turnos, setTurnos] = useState([]);
    // Filtro en null por defecto
    const [filtros, setFiltros] = useState({
        texto: null,
        localidad: null,
        tipoFutbol: null,
        precioMin: null,
        precioMax: null,
    });

    const dispatch = useDispatch();
    const localidades = useSelector((state) => state.localidades.data);

    useEffect(() => {
    if (localidades.length === 0) dispatch(fetchLocalidades());
    }, [dispatch, localidades.length]);
    

    useEffect(() => {
        let url = `${API_URL}/turnos/filtrar?`;
        if (filtros.localidad) url = url + `localidad=${filtros.localidad}&`;
        if (filtros.tipoFutbol) url = url + `tipoFutbol=${filtros.tipoFutbol}&`;
        if (filtros.precioMin != null) url = url + `precioMin=${filtros.precioMin}&`;
        if (filtros.precioMax != null) url = url + `precioMax=${filtros.precioMax}&`;
        if (filtros.texto) url = url + `texto=${encodeURIComponent(filtros.texto)}&`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => setTurnos(data))
            .catch((error) => console.error('Error al cargar turnos', error));
    }, [filtros]);

    return (
        <>
            {}
            <Filtros localidades={localidades.map((l) => l.nombre)} onFiltrar={setFiltros} />

            {}
            <section className="turno-list">
                {/* Recorre el array filtrado y renderiza una TurnoCard por cada turno */}
                {turnos.map((value) => (
                    <TurnoCard
                        key={value.idTurno}
                        idTurno={value.idTurno}
                        idCancha={value.idCancha}
                        fechaHora={value.fechaHora}
                        tipoFutbol={value.tipoFutbol}
                        lugaresDisponibles={value.lugaresDisponibles}
                        precioPorJugador={value.precioPorJugador}
                        descripcion={value.descripcion}
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
