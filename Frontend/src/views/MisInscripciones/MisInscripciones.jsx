import './MisInscripciones.css';

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatearFechaHora } from '../../utils/fecha';
import { formatearMoneda } from '../../utils/moneda';
import VolverAtras from '../../components/VolverAtras/VolverAtras';
import { fetchInscripcionesUsuario } from '../../redux/inscripcionesSlice';

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

    const estaLogueado = useSelector((state) => state.usuarios?.estaLogueado);
    const usuario = useSelector((state) => state.usuarios?.usuario);
    const rawInscripciones = useSelector((state) => state.inscripciones?.items);
    const cargando = useSelector((state) => state.inscripciones?.loading);
    const error = useSelector((state) => state.inscripciones?.error);

    const inscripciones = useMemo(() => {
        const lista = rawInscripciones || [];
        return [...lista].sort((a, b) => {
            const fa = new Date(a.fechaCompra ?? 0).getTime();
            const fb = new Date(b.fechaCompra ?? 0).getTime();
            return fb - fa;
        });
    }, [rawInscripciones]);

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    useEffect(() => {
        const idUsuario = usuario?.idUsuario;
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
                {inscripciones.map((i) => {
                    const idInscripcion = i.idInscripcion;
                    const estadoEfectivo = i.estadoPago;

                    return (
                        <article key={idInscripcion} className="tarjeta-inscripcion">
                            <div className="tarjeta-inscripcion__principal">
                                <h3 className="tarjeta-inscripcion__cancha">
                                    {i.nombreCancha ?? `Turno #${i.idTurno}`}
                                </h3>
                                {i.localidad && <span className="tarjeta-inscripcion__localidad">{i.localidad}</span>}
                                <span className="tarjeta-inscripcion__fecha">
                                    {formatearFechaHora(i.fechaHoraTurno)}
                                </span>
                                {i.tipoFutbol && <span className="tarjeta-inscripcion__tipo">{i.tipoFutbol}</span>}
                            </div>

                            <div className="tarjeta-inscripcion__secundaria">
                                <span className={`tarjeta-inscripcion__estado tarjeta-inscripcion__estado--${estadoEfectivo?.toLowerCase()}`}>
                                    {ESTADO_LABEL[estadoEfectivo] ?? estadoEfectivo}
                                </span>
                                <span className="tarjeta-inscripcion__monto">
                                    {formatearMoneda(i.montoPagado)}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </section>
        </main>
    );
};

export default MisInscripciones;