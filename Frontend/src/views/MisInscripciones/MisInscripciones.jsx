import './MisInscripciones.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatearFechaHora } from '../../utils/fecha';
import { formatearMoneda } from '../../utils/moneda';
import { obtenerEstadosPago } from '../../utils/pagosLocales';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import { fetchInscripcionesUsuario } from '../../redux/carritoSlice';

const ESTADO_LABEL = {
    PENDIENTE: 'Pendiente',
    PAGADO: 'Pagado',
    EFECTIVO: 'Efectivo',
    CANCELADO: 'Cancelado',
    REEMBOLSADO: 'Reembolsado',
};

const MisInscripciones = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { estaLogueado, usuario } = useSelector((state) => state.usuarios);
    const { 
        inscripciones = [], 
        loadingInscripciones: cargando, 
        errorInscripciones: error 
    } = useSelector((state) => state.carrito);

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    useEffect(() => {
        const idUsuario = usuario?.idUsuario ?? usuario?.id_usuario;
        if (estaLogueado && idUsuario) {
            dispatch(fetchInscripcionesUsuario(idUsuario));
        }
    }, [dispatch, estaLogueado, usuario]);

    return (
        <main className="mis-inscripciones">
            <VolverAtras />
            <div className="mis-inscripciones__header">
                <h1 className="mis-inscripciones__titulo">Mis inscripciones</h1>
            </div>

            {cargando && <p className="mis-inscripciones__aviso">Cargando tus inscripciones...</p>}
            {error && <p className="mis-inscripciones__aviso mis-inscripciones__aviso--error">{error}</p>}
            {!cargando && !error && inscripciones.length === 0 && (
                <p className="mis-inscripciones__aviso">Todavía no tenés ninguna inscripción.</p>
            )}

            <section className="mis-inscripciones__lista">
                {(() => {
                    const estadosLocales = obtenerEstadosPago();
                    return inscripciones.map((i) => {
                        const idInscripcion = i.idInscripcion ?? i.id_inscripcion;
                        const estadoEfectivo = i.estadoPago === 'PENDIENTE'
                            ? (estadosLocales[idInscripcion] ?? i.estadoPago)
                            : i.estadoPago;

                        return (
                            <article key={idInscripcion} className="tarjeta-inscripcion">
                                <div className="tarjeta-inscripcion__principal">
                                    <h3 className="tarjeta-inscripcion__cancha">
                                        {i.nombreCancha ?? `Turno #${i.idTurno ?? i.id_turno}`}
                                    </h3>
                                    {i.localidad && <span className="tarjeta-inscripcion__localidad">{i.localidad}</span>}
                                    <span className="tarjeta-inscripcion__fecha">
                                        {formatearFechaHora(i.fechaHoraTurno ?? i.fecha_hora_turno)}
                                    </span>
                                    {i.tipoFutbol && <span className="tarjeta-inscripcion__tipo">{i.tipoFutbol}</span>}
                                </div>

                                <div className="tarjeta-inscripcion__secundaria">
                                    <span className={`tarjeta-inscripcion__estado tarjeta-inscripcion__estado--${estadoEfectivo?.toLowerCase()}`}>
                                        {ESTADO_LABEL[estadoEfectivo] ?? estadoEfectivo}
                                    </span>
                                    <span className="tarjeta-inscripcion__monto">
                                        {formatearMoneda(i.montoPagado ?? i.monto_pagado)}
                                    </span>
                                </div>
                            </article>
                        );
                    });
                })()}
            </section>
        </main>
    );
};

export default MisInscripciones;