import './FormularioCancha.css';

import { useState, useEffect } from 'react';
import { SUPERFICIES, FORMATOS } from '../../utils/opcionesCancha';
import SelectorFotos from '../SelectorFotos/SelectorFotos';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalidades } from '../../redux/localidadesSlice';

const FORM_VACIO = { nombre: '', direccion: '', idLocalidad: '', tipoSuperficie: '', tipoFutbol: '', precioUnitario: '', descripcion: '',};

const FormularioCancha = ({ onPublicar, inicial}) => {
    const [form, setForm] = useState(inicial ? { ...FORM_VACIO, ...inicial } : FORM_VACIO);
    const [fotosElegidas, setFotosElegidas] = useState([]);

    const dispatch = useDispatch();
    const localidades = useSelector((state) => state.localidades.data);

    useEffect(() => {
        if (localidades.length === 0) dispatch(fetchLocalidades());
    }, [dispatch, localidades.length]);

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