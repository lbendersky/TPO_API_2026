import './CanchaPropia.css';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import FormularioTurno from '../FormularioTurno/FormularioTurno';

const CanchaPropia = ({ cancha }) => {
    const { token } = useAuth();
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [indice, setIndice] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/imagenes/cancha/${cancha.idCancha}`)
            .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
            .then((data) => {
                setImagenes(data.map((img) => img.file));
                setIndice(0);
            })
            .catch((e) => console.error('Error al cargar la imagen', e));
    }, [cancha.idCancha]);

    const anterior = () => setIndice((i) => Math.max(i - 1, 0));
    const siguiente = () => setIndice((i) => Math.min(i + 1, imagenes.length - 1));

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
            {imagenes.length > 0 && (
                <div className="cancha-propia__carrusel">
                    {imagenes.length > 1 && (
                        <button type="button" className="cancha-propia__flecha cancha-propia__flecha--izq" onClick={anterior} disabled={indice === 0}>‹</button>
                    )}
                    <img className="cancha-propia__img" src={`data:image/jpeg;base64,${imagenes[indice]}`} alt={cancha.nombre} />
                    {imagenes.length > 1 && (
                        <button type="button" className="cancha-propia__flecha cancha-propia__flecha--der" onClick={siguiente} disabled={indice === imagenes.length - 1}>›</button>
                    )}
                </div>
            )}
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