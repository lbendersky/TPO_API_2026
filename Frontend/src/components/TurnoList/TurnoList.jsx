import './TurnoList.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import TurnoCard from '../TurnoCard/TurnoCard';
import Filtros from '../Filtros/Filtros';
import { fetchTurnosFiltrados, setFiltros, fetchLocalidades } from '../../redux/turnosSlice';

const UMBRAL_REFETCH_MS = 10000;

const COMPARADORES = {
    'fecha-asc': (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora),
    'fecha-desc': (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora),
    'precio-asc': (a, b) => (a.precioConDescuento ?? a.precioPorJugador) - (b.precioConDescuento ?? b.precioPorJugador),
    'precio-desc': (a, b) => (b.precioConDescuento ?? b.precioPorJugador) - (a.precioConDescuento ?? a.precioPorJugador),
    az: (a, b) => (a.nombreCancha ?? '').localeCompare(b.nombreCancha ?? ''),
    za: (a, b) => (b.nombreCancha ?? '').localeCompare(a.nombreCancha ?? ''),
};

const categoriaDe = (clave) => {
    if (clave.startsWith('fecha')) return 'fecha';
    if (clave.startsWith('precio')) return 'precio';
    return 'nombre';
};

const alternarCriterio = (activos, clave) => {
    if (activos.includes(clave)) {
        return activos.filter((c) => c !== clave);
    }
    const categoria = categoriaDe(clave);
    const indiceAnterior = activos.findIndex((c) => categoriaDe(c) === categoria);
    const sinEsaCategoria = activos.filter((c) => categoriaDe(c) !== categoria);
    if (indiceAnterior === -1) {
        return [...sinEsaCategoria, clave];
    }
    const conNuevoCriterio = [...sinEsaCategoria];
    conNuevoCriterio.splice(indiceAnterior, 0, clave);
    return conNuevoCriterio;
};

const ordenarTurnos = (lista, activos) => {
    const copia = [...lista];
    if (!activos.length) return copia;
    return copia.sort((a, b) => {
        for (const clave of activos) {
            const resultado = COMPARADORES[clave](a, b);
            if (resultado !== 0) return resultado;
        }
        return 0;
    });
};

const TurnoList = () => {
    const dispatch = useDispatch();
    const { items: turnos, filtros, loading, error, ultimaConsultaFiltrados } = useSelector((state) => state.turnos);
    const turnosFuturos = turnos.filter((value) => new Date(value.fechaHora) > new Date());
    const localidades = useSelector((state) => state.turnos.localidades);
    const [texto, setTexto] = useState('');
    const [ordenes, setOrdenes] = useState(['fecha-asc']);
    const turnosOrdenados = ordenarTurnos(turnosFuturos, ordenes);

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
                    ordenes={ordenes}
                    onOrdenar={(clave) => setOrdenes((actuales) => alternarCriterio(actuales, clave))}
                />

                <section className="turno-list-contenido">
                    <div className="turno-list">
                        {loading && <p className="turno-list__vacio">Cargando turnos...</p>}
                        {error && <p className="turno-list__vacio">No se pudieron cargar los turnos: {error}</p>}
                        {turnosOrdenados.map((value) => (
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
                    {!loading && !error && turnosOrdenados.length === 0 && (
                        <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                    )}
                </section>
            </div>
        </>
    );
};

export default TurnoList;
