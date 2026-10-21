import './BuscadorModeracion.css';

import { useState } from 'react';

const BuscadorModeracion = ({ titulo, placeholder, onBuscar, onEliminar, renderResultado, puedeEliminar, renderExtra }) => {
    const [query, setQuery] = useState('');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const limpiar = () => {
        setResultado(null);
        setError('');
        setMensaje('');
    };

    const buscar = async () => {
        if (!query.trim()) return;
        limpiar();
        setCargando(true);
        try {
            const data = await onBuscar(query.trim());
            setResultado(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const eliminar = async () => {
        if (!resultado) return;
        if (!window.confirm(`¿Eliminar este ${titulo.toLowerCase().slice(0, -1)}? Esta acción no se puede deshacer.`)) return;
        setError('');
        try {
            await onEliminar(resultado);
            setMensaje('Eliminado correctamente.');
            setResultado(null);
            setQuery('');
        } catch (err) {
            setError(err.message);
        }
    };

    const bloqueado = resultado && puedeEliminar && !puedeEliminar(resultado);

    return (
        <section className="buscador-moderacion">
            <h2 className="buscador-moderacion__titulo">{titulo}</h2>
            <div className="buscador-moderacion__fila">
                <input
                    className="buscador-moderacion__input"
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (resultado) limpiar();
                    }}
                />
                <button className="buscador-moderacion__buscar" onClick={buscar} disabled={cargando || !query.trim()}>
                    Buscar
                </button>
            </div>

            {cargando && <p className="buscador-moderacion__aviso">Buscando...</p>}
            {error && <p className="buscador-moderacion__error">{error}</p>}
            {mensaje && <p className="buscador-moderacion__ok">{mensaje}</p>}

            {resultado && (
                <div className="buscador-moderacion__resultado">
                    {renderResultado(resultado)}
                    <div className="buscador-moderacion__acciones">
                        <button
                            className="buscador-moderacion__eliminar"
                            onClick={eliminar}
                            disabled={bloqueado}
                            title={bloqueado ? 'No podés eliminar este registro' : ''}
                        >
                            Eliminar
                        </button>
                        {renderExtra && renderExtra(resultado)}
                    </div>
                </div>
            )}
        </section>
    );
};

export default BuscadorModeracion;
