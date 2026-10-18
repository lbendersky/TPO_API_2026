import './CanchaPropia.css';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import FormularioTurno from '../FormularioTurno/FormularioTurno';

const CanchaPropia = ({ cancha }) => {
    const { token } = useAuth();
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const crearTurno = (datos) => {
        setMensaje('');
        setError('');
        fetch(`${API_URL}/turnos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ...datos, idCancha: cancha.idCancha, precioPorJugador: Number(datos.precioPorJugador) }),
        })
            .then((response) => {
                if (response.status === 409) throw new Error('Ya hay un turno en esta cancha en ese horario.');
                if (!response.ok) throw new Error('No se pudo crear el turno. Revisá que la fecha sea futura.');
                return response.json();
            })
            .then(() => {
                setMensaje('¡Turno publicado! Ya aparece en el inicio.');
                setAbierto(false);
            })
            .catch((err) => setError(err.message));
    };

    return (
        <article className="cancha-propia">
            <div className="cancha-propia__info">
                <h2 className="cancha-propia__nombre">
                    {cancha.nombre} {!cancha.activa && <span className="cancha-propia__baja">Dada de baja</span>}
                </h2>
                <p>{cancha.localidad} - {cancha.tipoFutbol} - {cancha.tipoSuperficie}</p>
                <p>{cancha.direccion} - ${cancha.precioUnitario} el turno</p>
            </div>

            {cancha.activa && !abierto && (
                <button className="cancha-propia__boton" onClick={() => setAbierto(true)}>+ Agregar turno</button>
            )}
            {mensaje && <p className="cancha-propia__mensaje">{mensaje}</p>}
            {error && <p className="cancha-propia__error">{error}</p>}
            {abierto && (
                <FormularioTurno
                    precioSugerido={Math.round(cancha.precioUnitario / cancha.cantidadJugadores)}
                    onCrear={crearTurno}
                    onCancelar={() => setAbierto(false)}
                />
            )}
        </article>
    );
};

export default CanchaPropia;