import './MisInscripciones.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';

const ESTADO_LABEL = {
    PENDIENTE: 'Pendiente',
    PAGADO: 'Pagado',
    CANCELADO: 'Cancelado',
    REEMBOLSADO: 'Reembolsado',
};

const formatearMonto = (n) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n ?? 0);

const MisInscripciones = () => {
    const { estaLogueado, usuario, token } = useAuth();
    const navigate = useNavigate();
    const [inscripciones, setInscripciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!estaLogueado) {
            navigate('/login');
        }
    }, [estaLogueado, navigate]);

    useEffect(() => {
        if (!usuario) return;
        fetch(`${API_URL}/inscripciones/usuario/${usuario.idUsuario}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron cargar tus inscripciones.');
                return response.json();
            })
            .then((data) => setInscripciones(data))
            .catch((err) => {
                console.error('Error al cargar las inscripciones', err);
                setError('No se pudieron cargar tus inscripciones.');
            })
            .finally(() => setCargando(false));
    }, [usuario, token]);

    return (
        <main className="mis-inscripciones">
            <div className="mis-inscripciones__header">
                <h1 className="mis-inscripciones__titulo">Mis inscripciones</h1>
            </div>

            {cargando && <p className="mis-inscripciones__aviso">Cargando tus inscripciones...</p>}
            {error && <p className="mis-inscripciones__aviso mis-inscripciones__aviso--error">{error}</p>}
            {!cargando && !error && inscripciones.length === 0 && (
                <p className="mis-inscripciones__aviso">Todavía no tenés ninguna inscripción.</p>
            )}

            <section className="mis-inscripciones__lista">
                {inscripciones.map((i) => (
                    <article key={i.idInscripcion} className="tarjeta-inscripcion">
                        <div className="tarjeta-inscripcion__principal">
                            <h3 className="tarjeta-inscripcion__cancha">{i.nombreCancha ?? `Turno #${i.idTurno}`}</h3>
                            {i.localidad && <span className="tarjeta-inscripcion__localidad">{i.localidad}</span>}
                            <span className="tarjeta-inscripcion__fecha">{formatearFechaHora(i.fechaHoraTurno)}</span>
                            {i.tipoFutbol && <span className="tarjeta-inscripcion__tipo">{i.tipoFutbol}</span>}
                        </div>

                        <div className="tarjeta-inscripcion__secundaria">
                            <span className={`tarjeta-inscripcion__estado tarjeta-inscripcion__estado--${i.estadoPago?.toLowerCase()}`}>
                                {ESTADO_LABEL[i.estadoPago] ?? i.estadoPago}
                            </span>
                            <span className="tarjeta-inscripcion__monto">{formatearMonto(i.montoPagado)}</span>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
};

export default MisInscripciones;
