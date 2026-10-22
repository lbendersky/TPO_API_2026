import './SelectorModeracion.css';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Alerta } from '../../utils/alerta';

const SelectorModeracion = ({
    titulo,
    tituloSingular,
    placeholder,
    onListar,
    onEliminar,
    renderOpcion,
    renderResultado,
    renderExtra,
    puedeEliminar,
    getKey,
}) => {
    const [items, setItems] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const [seleccionado, setSeleccionado] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const contenedorRef = useRef(null);

    const cargar = async () => {
        setCargando(true);
        setError('');
        try {
            const data = await onListar();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    useEffect(() => {
        const onClickFuera = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', onClickFuera);
        return () => document.removeEventListener('mousedown', onClickFuera);
    }, []);

    const limpiarMensajes = () => {
        setError('');
        setMensaje('');
    };

    const elegir = (item) => {
        limpiarMensajes();
        setSeleccionado(item);
        setAbierto(false);
    };

    const eliminar = async () => {
        if (!seleccionado) return;
        const nombre = tituloSingular ?? `este ${titulo.toLowerCase().slice(0, -1)}`;
        const confirm = await Alerta.fire({
            title: `¿Eliminar ${nombre}?`,
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#c0392b',
        });
        if (!confirm.isConfirmed) return;
        try {
            await onEliminar(seleccionado);
            setMensaje('Eliminado correctamente.');
            setSeleccionado(null);
            await cargar();
        } catch (err) {
            setError(err.message);
        }
    };

    const bloqueado = seleccionado && puedeEliminar && !puedeEliminar(seleccionado);

    return (
        <section className="selector-moderacion">
            <h2 className="selector-moderacion__titulo">{titulo}</h2>

            <div className="selector-moderacion__dropdown" ref={contenedorRef}>
                <button
                    type="button"
                    className="selector-moderacion__trigger"
                    onClick={() => setAbierto((v) => !v)}
                    disabled={cargando}
                >
                    <span className="selector-moderacion__trigger-texto">
                        {seleccionado
                            ? renderOpcion(seleccionado)
                            : (cargando ? 'Cargando...' : (placeholder ?? 'Seleccionar'))}
                    </span>
                    <ChevronDown size={18} />
                </button>

                {abierto && (
                    <div className="selector-moderacion__panel" role="listbox">
                        <ul className="selector-moderacion__opciones">
                            {items.length === 0 && (
                                <li className="selector-moderacion__vacio">Sin resultados</li>
                            )}
                            {items.map((it) => (
                                <li
                                    key={getKey(it)}
                                    role="option"
                                    className="selector-moderacion__opcion"
                                    onClick={() => elegir(it)}
                                >
                                    {renderOpcion(it)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {error && <p className="selector-moderacion__error">{error}</p>}
            {mensaje && <p className="selector-moderacion__ok">{mensaje}</p>}

            {seleccionado && (
                <div className="selector-moderacion__resultado">
                    {renderResultado(seleccionado)}
                    <div className="selector-moderacion__acciones">
                        <button
                            className="selector-moderacion__eliminar"
                            onClick={eliminar}
                            disabled={bloqueado}
                            title={bloqueado ? 'No podés eliminar este registro' : ''}
                        >
                            Eliminar
                        </button>
                        {renderExtra && renderExtra(seleccionado)}
                    </div>
                </div>
            )}
        </section>
    );
};

export default SelectorModeracion;
