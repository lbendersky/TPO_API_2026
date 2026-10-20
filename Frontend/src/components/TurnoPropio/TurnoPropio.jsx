import './TurnoPropio.css';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { formatearFechaHora } from '../../utils/fecha';
import FormularioTurno from '../FormularioTurno/FormularioTurno';

const TurnoPropio = ({ turno, idCancha, onCambio, onBorrado }) => {
    const { token } = useAuth();
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState('');

    const editar = (form) => {
        setError('');
        fetch(`${API_URL}/turnos/${turno.idTurno}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...form, idCancha, precioPorJugador: Number(form.precioPorJugador) }),
        })
            .then((response) => {
                if (response.status === 409) throw new Error('Ya hay otro turno en ese horario.');
                if (response.status === 400) throw new Error('La fecha tiene que ser futura, y si ya hay inscriptos solo podés cambiar precio y descripción.');
                if (!response.ok) throw new Error('No se pudo editar el turno.');
                return response.json();
            })
            .then((data) => {
                onCambio(data);
                setEditando(false);
            })
            .catch((err) => setError(err.message));
    };

    const borrar = () => {
        setError('');
        fetch(`${API_URL}/turnos/${turno.idTurno}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => {
                if (response.status === 400) throw new Error('No se puede borrar: ya tiene jugadores inscriptos.');
                if (!response.ok) throw new Error('No se pudo borrar el turno.');
                onBorrado(turno.idTurno); // le avisa al padre que lo saque de la lista
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="turno-propio">
            <div className="turno-propio__fila">
                <span className="turno-propio__fecha">{formatearFechaHora(turno.fechaHora)}</span>
                <span>{turno.lugaresDisponibles} lugares - {turno.estado}</span>
                <span>${turno.precioPorJugador} por jugador</span>
                <div className="turno-propio__acciones">
                    <button onClick={() => setEditando(!editando)}>{editando ? 'Cerrar' : 'Editar'}</button>
                    <button className="turno-propio__borrar" onClick={borrar}>Borrar</button>
                </div>
            </div>
            {error && <p className="cancha-propia__error">{error}</p>}
            {editando && (
                <FormularioTurno inicial={turno} textoBoton="Guardar cambios" onCrear={editar} onCancelar={() => setEditando(false)} />
            )}
        </div>
    );
};

export default TurnoPropio;