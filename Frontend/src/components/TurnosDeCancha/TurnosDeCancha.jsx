import './TurnosDeCancha.css';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../config';
import FormularioTurno from '../FormularioTurno/FormularioTurno';
import TurnoPropio from '../TurnoPropio/TurnoPropio';

const TurnosDeCancha = ({ cancha }) => {
    const { token } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/turnos/cancha/${cancha.idCancha}`)
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron cargar los turnos');
                return response.json();
            })
            .then((data) => setTurnos(data))
            .catch((err) => console.error('Error al cargar los turnos', err));
    }, [cancha.idCancha]);

    const crearTurno = (form) => {
        setError('');
        fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...form, idCancha: cancha.idCancha, precioPorJugador: Number(form.precioPorJugador) }),
        })
            .then((response) => {
                if (response.status === 409) throw new Error('Ya hay un turno en esta cancha en ese horario.');
                if (!response.ok) throw new Error('No se pudo crear el turno. Revisá que la fecha sea futura.');
                return response.json();
            })
            .then((nuevo) => {
                setTurnos([...turnos, nuevo]);
                setAbierto(false);
            })
            .catch((err) => setError(err.message));
    };

    const reemplazar = (cambiado) => setTurnos(turnos.map((t) => (t.idTurno === cambiado.idTurno ? cambiado : t)));
    const sacar = (idTurno) => setTurnos(turnos.filter((t) => t.idTurno !== idTurno));

    return (
        <section className="turnos-cancha">
            <h3 className="turnos-cancha__titulo">Turnos ({turnos.length})</h3>
            {turnos.length === 0 && <p className="turnos-cancha__vacio">Esta cancha todavía no tiene turnos.</p>}
            {turnos.map((turno) => (
                <TurnoPropio key={turno.idTurno} turno={turno} idCancha={cancha.idCancha} onCambio={reemplazar} onBorrado={sacar} />
            ))}
            {cancha.activa && !abierto && (
                <button className="cancha-propia__boton" onClick={() => setAbierto(true)}>+ Agregar turno</button>
            )}
            {error && <p className="cancha-propia__error">{error}</p>}
            {abierto && (
                <FormularioTurno precioSugerido={cancha.cantidadJugadores ? Math.round(cancha.precioUnitario / cancha.cantidadJugadores) : ''}
                    onCrear={crearTurno} onCancelar={() => setAbierto(false)} />
            )}
        </section>
    );
};

export default TurnosDeCancha;