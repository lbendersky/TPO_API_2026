import './SelectorModeracion.css';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, CornerDownLeft } from 'lucide-react';
import { confirmarEliminar } from '../../utils/alerta';
import { Boton } from '../Boton/Boton';

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
    etiquetaOcultos,
    esOculto,
}) => {
    const [seccionAbierta, setSeccionAbierta] = useState(false);
    const [mostrarOcultos, setMostrarOcultos] = useState(false);
    const [items, setItems] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [terminoBuscado, setTerminoBuscado] = useState('');
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
        const confirm = await confirmarEliminar(nombre);
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

    const buscar = () => {
        setTerminoBuscado(filtro);
        setAbierto(true);
    };

    const onKeyDownFiltro = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscar();
        }
    };

    const onChangeFiltro = (e) => {
        const valor = e.target.value;
        setFiltro(valor);
        if (!valor.trim()) {
            setTerminoBuscado('');
        }
    };

    const itemsVisibles = (etiquetaOcultos && esOculto && !mostrarOcultos)
        ? items.filter((it) => !esOculto(it))
        : items;

    const itemsFiltrados = terminoBuscado.trim()
        ? itemsVisibles.filter((it) => renderOpcion(it).toLowerCase().includes(terminoBuscado.trim().toLowerCase()))
        : itemsVisibles;

    const bloqueado = seleccionado && puedeEliminar && !puedeEliminar(seleccionado);

    return (
        <section className="selector-moderacion">
                <div className="selector-moderacion__encabezado">
                <button
                    type="button"
                    className="selector-moderacion__titulo-boton"
                    onClick={() => setSeccionAbierta((v) => !v)}
                >
                    <h2 className="selector-moderacion__titulo">{titulo}</h2>
                </button>

                {etiquetaOcultos && esOculto && (
                    <button
                        type="button"
                        className={`selector-moderacion__toggle-ocultos ${mostrarOcultos ? 'selector-moderacion__toggle-ocultos--activo' : ''}`}
                        onClick={() => setMostrarOcultos((v) => !v)}
                    >
                        {etiquetaOcultos}
                    </button>
                )}

                <button
                    type="button"
                    className="selector-moderacion__chevron-boton"
                    onClick={() => setSeccionAbierta((v) => !v)}
                >
                    <ChevronDown
                        size={20}
                        className={`selector-moderacion__chevron-seccion ${seccionAbierta ? 'selector-moderacion__chevron-seccion--abierto' : ''}`}
                    />
                </button>
            </div>

            {seccionAbierta && (
                <>
                    <div className="selector-moderacion__fila-filtro">
                        <input
                            type="text"
                            className="selector-moderacion__filtro"
                            placeholder={`Buscar en ${titulo.toLowerCase()}...`}
                            value={filtro}
                            onChange={onChangeFiltro}
                            onKeyDown={onKeyDownFiltro}
                        />
                        <button
                            type="button"
                            className="selector-moderacion__boton-buscar"
                            onClick={buscar}
                            title="Buscar"
                        >
                            <CornerDownLeft size={18} />
                        </button>
                    </div>

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
                                    {itemsFiltrados.length === 0 && (
                                        <li className="selector-moderacion__vacio">Sin resultados</li>
                                    )}
                                    {itemsFiltrados.map((it) => (
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
                                <Boton
                                    variante="peligro"
                                    onClick={eliminar}
                                    disabled={bloqueado}
                                    title={bloqueado ? 'No podés eliminar este registro' : ''}
                                >
                                    Eliminar
                                </Boton>
                                {renderExtra && renderExtra(seleccionado)}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default SelectorModeracion;