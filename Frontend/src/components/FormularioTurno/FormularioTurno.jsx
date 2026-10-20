import './FormularioTurno.css';

import { useState } from 'react';

const FormularioTurno = ({ precioSugerido, onCrear, onCancelar }) => {
    const [form, setForm] = useState({
        fechaHora: '',
        precioPorJugador: precioSugerido,
        descripcion: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCrear(form);
    };

    return (
        <form className="form-turno" onSubmit={handleSubmit}>
            <label>Día y hora
                <input type="datetime-local" name="fechaHora" value={form.fechaHora} onChange={handleChange} required />
            </label>
            <label>Precio por jugador ($)
                <input type="number" min="1" name="precioPorJugador" value={form.precioPorJugador} onChange={handleChange} required />
            </label>
            <label className="form-turno__completo">Descripción
                <input name="descripcion" placeholder="Ej: nivel intermedio, traer pechera"
                    value={form.descripcion} onChange={handleChange} />
            </label>
            <div className="form-turno__botones">
                <button type="button" className="form-turno__cancelar" onClick={onCancelar}>Cancelar</button>
                <button type="submit" className="form-turno__publicar">Publicar turno</button>
            </div>
        </form>
    );
};

export default FormularioTurno;