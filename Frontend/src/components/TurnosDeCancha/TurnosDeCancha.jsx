import './TurnosDeCancha.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/useAuth';
import { crearTurno } from '../../redux/turnosSlice';
import FormularioTurno from '../FormularioTurno/FormularioTurno';
import TurnoPropio from '../TurnoPropio/TurnoPropio';

const TurnosDeCancha = ({ cancha }) => {
    const { token } = useAuth();
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.turnos.deMisCanchas);
    const turnos = todos.filter((t) => t.idCancha === cancha.idCancha);
    const [abierto, setAbierto] = useState(false);
    const [error, setError] = useState('');

    const agregarTurno = (form) => {
        setError('');
        const datos = { ...form, idCancha: cancha.idCancha, precioPorJugador: Number(form.precioPorJugador) };
        dispatch(crearTurno({ datos, token }))
            .unwrap()
            .then(() => setAbierto(false))
            .catch((status) => setError(status === 409
                ? 'Ya hay un turno en esta cancha en ese horario.'
                : 'No se pudo crear el turno. Revisá que la fecha sea futura.'));
    };

    return (
        <section className="turnos-cancha">
            <h3 className="turnos-cancha__titulo">Turnos ({turnos.length})</h3>
            {turnos.length === 0 && <p className="turnos-cancha__vacio">Esta cancha todavía no tiene turnos.</p>}
            {turnos.map((turno) => (
                <TurnoPropio key={turno.idTurno} turno={turno} />
            ))}
            {cancha.activa && !abierto && (
                <button className="cancha-propia__boton" onClick={() => setAbierto(true)}>+ Agregar turno</button>
            )}
            {error && <p className="cancha-propia__error">{error}</p>}
            {abierto && (
                <FormularioTurno precioSugerido={cancha.cantidadJugadores ? Math.round(cancha.precioUnitario / cancha.cantidadJugadores) : ''}
                    onCrear={agregarTurno} onCancelar={() => setAbierto(false)} />
            )}
        </section>
    );
};

export default TurnosDeCancha;