import './TurnoList.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import TurnoCard from '../TurnoCard/TurnoCard';
import Filtros from '../Filtros/Filtros';
import { fetchTurnosFiltrados, setFiltros, fetchLocalidades } from '../../redux/turnosSlice';

// Si volvés a pedir exactamente lo mismo antes de que pase este tiempo, no se repite el pedido.
const UMBRAL_REFETCH_MS = 10000;

const TurnoList = () => {
    const dispatch = useDispatch();
    const { items: turnos, filtros, loading, error, ultimaConsultaFiltrados } = useSelector((state) => state.turnos);
    const turnosFuturos = turnos.filter((value) => new Date(value.fechaHora) > new Date());
    const localidades = useSelector((state) => state.turnos.localidades);
    const [texto, setTexto] = useState('');

    useEffect(() => {
        if (localidades.length === 0) dispatch(fetchLocalidades());
    }, [dispatch, localidades.length]);

    useEffect(() => {
        const id = setTimeout(() => {
            const params = { ...filtros, texto: texto?.trim() || null };
            const clave = JSON.stringify(params);
            const yaEstaFresco = ultimaConsultaFiltrados?.clave === clave
                && Date.now() - ultimaConsultaFiltrados.momento < UMBRAL_REFETCH_MS;
            if (yaEstaFresco) return;
            dispatch(fetchTurnosFiltrados(params));
        }, 400);
        return () => clearTimeout(id);
    }, [dispatch, filtros, texto]);
    return (
        <>
            <label className="turno-buscador">
                <Search className="turno-buscador__icono" />
                <input
                    type="text"
                    className="turno-buscador__input"
                    placeholder="Buscar canchas..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
            </label>

            <div className="turno-list-layout">
                <Filtros
                    localidades={localidades.map((l) => l.nombre)}
                    onFiltrar={(f) => dispatch(setFiltros(f))}
                />

                <section className="turno-list-contenido">
                    <div className="turno-list">
                        {loading && <p className="turno-list__vacio">Cargando turnos...</p>}
                        {error && <p className="turno-list__vacio">No se pudieron cargar los turnos: {error}</p>}
                        {turnosFuturos.map((value) => (
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
                    </div>
                    {!loading && !error && turnosFuturos.length === 0 && (
                        <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                    )}
                </section>
            </div>
        </>
    );
};

export default TurnoList;
