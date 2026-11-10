import './TurnoPropio.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editarTurno, borrarTurno } from '../../redux/turnosSlice';
import { formatearFechaHora } from '../../utils/fecha';
import { Boton } from '../Boton/Boton';
import FormularioTurno from '../FormularioTurno/FormularioTurno';

const TurnoPropio = ({ turno }) => {
    const { token } = useSelector((state) => state.usuarios);
    const dispatch = useDispatch();
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState('');

    const editar = (form) => {
        setError('');
        const datos = { ...form, idCancha: turno.idCancha, precioPorJugador: Number(form.precioPorJugador) };
        dispatch(editarTurno({ idTurno: turno.idTurno, datos, token }))
            .unwrap()
            .then(() => setEditando(false))
            .catch((status) => {
                if (status === 409) setError('Ya hay otro turno en ese horario.');
                else if (status === 400) setError('La fecha tiene que ser futura, y si ya hay inscriptos solo podés cambiar precio y descripción.');
                else setError('No se pudo editar el turno.');
            });
    };

    const borrar = () => {
        setError('');
        dispatch(borrarTurno({ idTurno: turno.idTurno, token }))
            .unwrap()
            .catch((status) => setError(status === 400
                ? 'No se puede borrar: ya tiene jugadores inscriptos.'
                : 'No se pudo borrar el turno.'));
    };

    return (
        <div className="turno-propio">
            <div className="turno-propio__fila">
                <span className="turno-propio__fecha">{formatearFechaHora(turno.fechaHora)}</span>
                <span>{turno.lugaresDisponibles} lugares - {turno.estado}</span>
                <span>${turno.precioPorJugador} por jugador</span>
                <div className="turno-propio__acciones">
                    <Boton variante="secundario" tamaño="chico" onClick={() => setEditando(!editando)}>{editando ? 'Cerrar' : 'Editar'}</Boton>
                    <Boton variante="peligro" tamaño="chico" onClick={borrar}>Borrar</Boton>
                </div>
            </div>
            {error && <p className="cancha-propia__error">{error}</p>}
            {editando && (
                <FormularioTurno inicial={turno} onCrear={editar} onCancelar={() => setEditando(false)} />
            )}
        </div>
    );
};

export default TurnoPropio;