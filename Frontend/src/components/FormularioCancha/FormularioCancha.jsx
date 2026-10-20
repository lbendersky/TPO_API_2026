import './FormularioCancha.css';

import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { SUPERFICIES, FORMATOS } from '../../utils/opcionesCancha';
import SelectorFotos from '../SelectorFotos/SelectorFotos';

const FORM_VACIO = { nombre: '', direccion: '', idLocalidad: '', tipoSuperficie: '', tipoFutbol: '', precioUnitario: '', descripcion: '',};

const FormularioCancha = ({ onPublicar, inicial}) => {
    const [form, setForm] = useState(inicial ? { ...FORM_VACIO, ...inicial } : FORM_VACIO);
    const [localidades, setLocalidades] = useState([]);
    const [fotosElegidas, setFotosElegidas] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/localidades`)
            .then((response) => {
                if (!response.ok) throw new Error('No se pudieron cargar las localidades');
                return response.json();
            })
            .then((data) => setLocalidades(data))
            .catch((error) => console.error('Error al cargar localidades', error));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onPublicar(form, fotosElegidas);
    };

    return (
        <form className="form-cancha" onSubmit={handleSubmit}>
            <label>Nombre de la cancha
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
            </label>
            <label>Dirección
                <input name="direccion" value={form.direccion} onChange={handleChange} required />
            </label>
            <label>Barrio
                <select name="idLocalidad" value={form.idLocalidad} onChange={handleChange} required>
                    <option value="">Elegí un barrio</option>
                    {localidades.map((l) => <option key={l.idLocalidad} value={l.idLocalidad}>{l.nombre}</option>)}
                </select>
            </label>
            <label>Formato
                <select name="tipoFutbol" value={form.tipoFutbol} onChange={handleChange} required>
                    <option value="">Elegí un formato</option>
                    {FORMATOS.map((f) => <option key={f.valor} value={f.valor}>{f.texto}</option>)}
                </select>
            </label>
            <label>Superficie
                <select name="tipoSuperficie" value={form.tipoSuperficie} onChange={handleChange} required>
                    <option value="">Elegí una superficie</option>
                    {SUPERFICIES.map((s) => <option key={s.valor} value={s.valor}>{s.texto}</option>)}
                </select>
            </label>
            <label>Precio del turno ($)
                <input type="number" min="1000" step="1000" name="precioUnitario" value={form.precioUnitario} onChange={handleChange} required />
            </label>
            <label className="form-cancha__completo">Descripción
                <textarea name="descripcion" rows="3" value={form.descripcion} onChange={handleChange} />
            </label>
            {!inicial && <SelectorFotos elegidas={fotosElegidas} onCambiar={setFotosElegidas} />}
            <button type="submit" className="form-cancha__boton">{inicial ? 'Guardar cambios' : 'Publicar cancha'}</button>        
        </form>
    );
};

export default FormularioCancha;