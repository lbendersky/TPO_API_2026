import './FormularioCancha.css';

import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { SUPERFICIES, FORMATOS } from '../../utils/opcionesCancha';

const FORM_VACIO = {
    nombre: '', direccion: '', idLocalidad: '', tipoSuperficie: '',
    tipoFutbol: '', precioUnitario: '', descripcion: '',
};

const FormularioCancha = ({ onPublicar }) => {
    const [form, setForm] = useState(FORM_VACIO);
    const [localidades, setLocalidades] = useState([]);
    const [fotosElegidas, setFotosElegidas] = useState([]);
    const [precargadas, setPrecargadas] = useState([]);

    const toggleFoto = (id) => {
        setFotosElegidas((actual) =>
            actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]
        );
    };

    useEffect(() => {
        fetch(`${API_URL}/imagenes/precargadas`)
            .then((r) => r.json())
            .then(setPrecargadas)
            .catch((e) => console.error('Error al cargar las fotos precargadas', e));
    }, []);

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
                <input type="number" min="1" name="precioUnitario" value={form.precioUnitario} onChange={handleChange} required />
            </label>
            <label className="form-cancha__completo">Descripción
                <textarea name="descripcion" rows="3" value={form.descripcion} onChange={handleChange} />
            </label>
            <div className="form-cancha__completo">
                <p>Foto de la cancha</p>
                <div className="form-cancha__fotos">
                    {precargadas.map((img) => (
                        <img
                            key={img.id}
                            src={`data:image/png;base64,${img.file}`}
                            alt={img.nombre}
                            title={img.nombre}
                            onClick={() => toggleFoto(img.id)}
                            className={`form-cancha__foto ${fotosElegidas.includes(img.id) ? 'form-cancha__foto--elegida' : ''}`}
                        />
                    ))}
                </div>
            </div>
            <button type="submit" className="form-cancha__boton">Publicar cancha</button>
        </form>
    );
};

export default FormularioCancha;