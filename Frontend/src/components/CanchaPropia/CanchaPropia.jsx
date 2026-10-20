import './CanchaPropia.css';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import CarruselCancha from '../CarruselCancha/CarruselCancha';
import FormularioCancha from '../FormularioCancha/FormularioCancha';
import TurnosDeCancha from '../TurnosDeCancha/TurnosDeCancha';

const CanchaPropia = ({ cancha, onCambio }) => {
    const { token } = useAuth();
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState('');

    const guardar = (form) => {
        setError('');
        fetch(`${API_URL}/canchas/${cancha.idCancha}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...form, idLocalidad: Number(form.idLocalidad), precioUnitario: Number(form.precioUnitario) }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron guardar los cambios.');
                return response.json();
            })
            .then((data) => {
                onCambio(data);
                setEditando(false);
            })
            .catch((err) => setError(err.message));
    };

    const darDeBaja = () => {
        setError('');
        fetch(`${API_URL}/canchas/${cancha.idCancha}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error('No se pudo dar de baja la cancha.');
                onCambio({ ...cancha, activa: false });
            })
            .catch((err) => setError(err.message));
    };

    return (
        <article className="cancha-propia">
            <CarruselCancha idCancha={cancha.idCancha} nombre={cancha.nombre} />
            <div className="cancha-propia__info">
                <h2 className="cancha-propia__nombre">
                    {cancha.nombre} {!cancha.activa && <span className="cancha-propia__baja">Dada de baja</span>}
                </h2>
                <p>{cancha.localidad} - {cancha.tipoFutbol} - {cancha.tipoSuperficie}</p>
                <p>{cancha.direccion} - ${cancha.precioUnitario} el turno</p>
            </div>
            {cancha.activa && (
                <div className="cancha-propia__acciones">
                    <button className="cancha-propia__boton" onClick={() => setEditando(!editando)}>{editando ? 'Cancelar edición' : 'Editar cancha'}</button>
                    <button className="cancha-propia__boton cancha-propia__boton--peligro" onClick={darDeBaja}>Dar de baja</button>
                </div>
            )}
            {error && <p className="cancha-propia__error">{error}</p>}
            {editando && <FormularioCancha inicial={cancha} textoBoton="Guardar cambios" onPublicar={guardar} />}
            <TurnosDeCancha cancha={cancha} />
        </article>
    );
};

export default CanchaPropia;