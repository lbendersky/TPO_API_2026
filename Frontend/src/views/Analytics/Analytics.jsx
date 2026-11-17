import './Analytics.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../redux/analyticsSlice';
import { formatearMoneda } from '../../utils/moneda';
import VolverAtras from '../../components/VolverAtras/VolverAtras';

const Analytics = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { usuario, estaLogueado, token } = useSelector((state) => state.usuarios);
    const { datos, loading, error } = useSelector((state) => state.analytics);

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
            return;
        }
        if (usuario && usuario.rol !== 'ADMIN') {
            navigate('/');
        }
    }, [estaLogueado, usuario, navigate]);

    useEffect(() => {
        if (usuario && usuario.rol === 'ADMIN') {
            dispatch(fetchAnalytics(token));
        }
    }, [dispatch, usuario, token]);

    if (!usuario || usuario.rol !== 'ADMIN') return null;

    return (
        <main className="analytics">
            <VolverAtras />
            <h1 className="analytics__titulo">Analítica</h1>

            {loading && <p className="analytics__aviso">Cargando estadísticas...</p>}
            {error && <p className="analytics__aviso analytics__aviso--error">{error}</p>}

            {datos && (
                <div className="analytics__grid">
                    <section className="analytics__tarjeta">
                        <h2>Usuarios</h2>
                        <dl>
                            <dt>Total</dt><dd>{datos.totalUsuarios}</dd>
                        </dl>
                    </section>

                    <section className="analytics__tarjeta">
                        <h2>Canchas</h2>
                        <dl>
                            <dt>Total</dt><dd>{datos.totalCanchas}</dd>
                            <dt>Activas</dt><dd>{datos.totalCanchasActivas}</dd>
                        </dl>
                    </section>

                    <section className="analytics__tarjeta">
                        <h2>Turnos</h2>
                        <dl>
                            <dt>Total</dt><dd>{datos.totalTurnos}</dd>
                            <dt>Incompletos</dt><dd>{datos.turnosIncompletos}</dd>
                            <dt>Llenos</dt><dd>{datos.turnosLlenos}</dd>
                        </dl>
                    </section>

                    <section className="analytics__tarjeta">
                        <h2>Inscripciones</h2>
                        <dl>
                            <dt>Total</dt><dd>{datos.totalInscripciones}</dd>
                            <dt>Pendientes</dt><dd>{datos.inscripcionesPendientes}</dd>
                            <dt>Pagadas</dt><dd>{datos.inscripcionesPagadas}</dd>
                            <dt>Canceladas</dt><dd>{datos.inscripcionesCanceladas}</dd>
                            <dt>Reembolsadas</dt><dd>{datos.inscripcionesReembolsadas}</dd>
                            <dt>Efectivo</dt><dd>{datos.inscripcionesEfectivo}</dd>
                        </dl>
                    </section>

                    <section className="analytics__tarjeta analytics__tarjeta--destacada">
                        <h2>Ingresos totales</h2>
                        <p className="analytics__ingresos">{formatearMoneda(datos.ingresosTotales)}</p>
                    </section>
                </div>
            )}
        </main>
    );
};

export default Analytics;