import './CanchaPropia.css';

import { useState} from 'react';
import CarruselCancha from '../CarruselCancha/CarruselCancha';
import FormularioCancha from '../FormularioCancha/FormularioCancha';
import TurnosDeCancha from '../TurnosDeCancha/TurnosDeCancha';
import { Boton } from '../Boton/Boton';
import {editarCancha, darDeBajaCancha} from "../../redux/canchasSlice";
import {useDispatch, useSelector} from "react-redux";

const CanchaPropia = ({ cancha }) => {
    const { token } = useSelector((state) => state.usuarios);
    const dispatch = useDispatch();
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState('');

    const guardar = (form) => {
        setError('');
        const datos = { ...form, idLocalidad: Number(form.idLocalidad), precioUnitario: Number(form.precioUnitario) };
        dispatch(editarCancha({ idCancha: cancha.idCancha, datos, token }))
            .unwrap()
            .then(() => setEditando(false))
            .catch(() => setError('No se pudieron guardar los cambios.'));
    };

    const darDeBaja = () => {
        setError('');
        dispatch(darDeBajaCancha({ idCancha: cancha.idCancha, token }))
            .unwrap()
            .catch(() => setError('No se pudo dar de baja la cancha.'));
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
                    <Boton variante="primario" onClick={() => setEditando(!editando)}>{editando ? 'Cancelar edición' : 'Editar cancha'}</Boton>
                    <Boton variante="peligro" onClick={darDeBaja}>Dar de baja</Boton>
                </div>
            )}
            {error && <p className="cancha-propia__error">{error}</p>}
            {editando && <FormularioCancha inicial={cancha} textoBoton="Guardar cambios" onPublicar={guardar} />}
            <TurnosDeCancha cancha={cancha} />
        </article>
    );
};

export default CanchaPropia;