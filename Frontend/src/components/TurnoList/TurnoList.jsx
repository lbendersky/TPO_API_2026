import './TurnoList.css';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import TurnoCard from '../TurnoCard/TurnoCard';
import Filtros from '../Filtros/Filtros';
import { API_URL } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalidades } from '../../redux/localidadesSlice';
import { useBusqueda } from '../../context/useBusqueda';

const TurnoList = () => {
    const [turnos, setTurnos] = useState([]);
    // Filtro en null por defecto (Barrio, Tipo y Precio vienen del panel lateral)
    const [filtros, setFiltros] = useState({
        localidades: null,
        tiposFutbol: null,
        precioMin: null,
        precioMax: null,
    });

    const { texto, setTexto } = useBusqueda();

    const dispatch = useDispatch();
    const localidades = useSelector((state) => state.localidades.data);

    useEffect(() => {
        if (localidades.length === 0) dispatch(fetchLocalidades());
    }, [dispatch, localidades.length]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (texto && texto.trim()) params.append('texto', texto.trim());
        if (filtros.localidades) filtros.localidades.forEach((l) => params.append('localidad', l));
        if (filtros.tiposFutbol) filtros.tiposFutbol.forEach((t) => params.append('tipoFutbol', t));
        if (filtros.precioMin != null) params.append('precioMin', filtros.precioMin);
        if (filtros.precioMax != null) params.append('precioMax', filtros.precioMax);

        fetch(`${API_URL}/turnos/filtrar?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => setTurnos(data))
            .catch((error) => console.error('Error al cargar turnos', error));
    }, [texto, filtros]);

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
                <Filtros localidades={localidades.map((l) => l.nombre)} onFiltrar={setFiltros} />

                <section className="turno-list-contenido">
                    <div className="turno-list">
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
                    </div>
                    {turnos.length === 0 && (
                        <p className="turno-list__vacio">No hay turnos que coincidan con los filtros.</p>
                    )}
                </section>
            </div>
        </>
    );
};

export default TurnoList;