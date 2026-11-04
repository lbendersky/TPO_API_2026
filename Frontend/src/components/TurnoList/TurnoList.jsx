import './TurnoList.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TurnoCard from '../TurnoCard/TurnoCard';
import Filtros from '../Filtros/Filtros';
import { fetchLocalidades } from '../../redux/localidadesSlice';
import { fetchTurnosFiltrados, setFiltros } from '../../redux/turnosSlice';

const TurnoList = () => {
    const dispatch = useDispatch();
    const { items: turnos, filtros, loading, error } = useSelector((state) => state.turnos);
    const localidades = useSelector((state) => state.localidades.data);

    useEffect(() => {
        if (localidades.length === 0) dispatch(fetchLocalidades());
    }, [dispatch, localidades.length]);

    useEffect(() => {
        dispatch(fetchTurnosFiltrados(filtros));
    }, [dispatch, filtros]);

    return (
        <>
            <Filtros
                localidades={localidades.map((l) => l.nombre)}
                onFiltrar={(f) => dispatch(setFiltros(f))}
            />

            <section className="turno-list">
                {loading && <p className="turno-list__vacio">Cargando turnos...</p>}
                {error && <p className="turno-list__vacio">No se pudieron cargar los turnos: {error}</p>}
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
                {!loading && !error && turnos.length === 0 && (
                    <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                )}
            </section>
        </>
    );
};

export default TurnoList;
