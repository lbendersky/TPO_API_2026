import './Filtros.css';

import { useEffect, useState } from 'react';
import { FORMATOS } from '../../utils/opcionesCancha';

const PRECIO_MIN_LIMITE = 0;
const PRECIO_MAX_LIMITE = 10000;
const PRECIO_PASO = 500;

// Recibe por props una lista de localidades disponibles
const Filtros = ({ localidades = [], onFiltrar }) => {
    const [localidadesSel, setLocalidadesSel] = useState([]);
    const [tiposSel, setTiposSel] = useState([]);
    const [precioMin, setPrecioMin] = useState(PRECIO_MIN_LIMITE);
    const [precioMax, setPrecioMax] = useState(PRECIO_MAX_LIMITE);

    // Cada vez que cambia algún filtro, se avisa al padre automáticamente (sin botón)
    useEffect(() => {
        onFiltrar({
            localidades: localidadesSel.length ? localidadesSel : null,
            tiposFutbol: tiposSel.length ? tiposSel : null,
            precioMin: precioMin > PRECIO_MIN_LIMITE ? precioMin : null,
            precioMax: precioMax < PRECIO_MAX_LIMITE ? precioMax : null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localidadesSel, tiposSel, precioMin, precioMax]);

    const toggleLocalidad = (loc) => {
        setLocalidadesSel((prev) =>
            prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
        );
    };

    const toggleTipo = (valor) => {
        setTiposSel((prev) =>
            prev.includes(valor) ? prev.filter((t) => t !== valor) : [...prev, valor]
        );
    };

    // Slider: arrastrar el pulgar
    const handleMinChange = (e) => setPrecioMin(Math.min(Number(e.target.value), precioMax));
    const handleMaxChange = (e) => setPrecioMax(Math.max(Number(e.target.value), precioMin));

    // Inputs numéricos Mínimo / Máximo
    const handleMinInput = (e) => {
        const val = e.target.value === '' ? PRECIO_MIN_LIMITE : Number(e.target.value);
        if (val >= PRECIO_MIN_LIMITE && val <= precioMax) setPrecioMin(val);
    };

    const handleMaxInput = (e) => {
        const val = e.target.value === '' ? PRECIO_MAX_LIMITE : Number(e.target.value);
        if (val <= PRECIO_MAX_LIMITE && val >= precioMin) setPrecioMax(val);
    };

    const pctMin = ((precioMin - PRECIO_MIN_LIMITE) / (PRECIO_MAX_LIMITE - PRECIO_MIN_LIMITE)) * 100;
    const pctMax = ((precioMax - PRECIO_MIN_LIMITE) / (PRECIO_MAX_LIMITE - PRECIO_MIN_LIMITE)) * 100;

    return (
        <aside className="filtros-panel">
            <div className="filtros-panel__seccion">
                <h3 className="filtros-panel__titulo">Barrio</h3>
                <ul className="filtros-panel__lista">
                    {localidades.map((loc) => (
                        <li key={loc} className="filtros-panel__item">
                            <label className="filtros-panel__opcion">
                                <input
                                    type="checkbox"
                                    checked={localidadesSel.includes(loc)}
                                    onChange={() => toggleLocalidad(loc)}
                                />
                                <span>{loc}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filtros-panel__seccion">
                <h3 className="filtros-panel__titulo">Tipo</h3>
                <ul className="filtros-panel__lista">
                    {FORMATOS.map((f) => (
                        <li key={f.valor} className="filtros-panel__item">
                            <label className="filtros-panel__opcion">
                                <input
                                    type="checkbox"
                                    checked={tiposSel.includes(f.valor)}
                                    onChange={() => toggleTipo(f.valor)}
                                />
                                <span>{f.texto}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filtros-panel__seccion">
                <h3 className="filtros-panel__titulo">Rango de precio</h3>

                <div className="filtros-panel__precios">
                    <input
                        type="number"
                        className="filtros-panel__precio-input"
                        placeholder="Mínimo"
                        min={PRECIO_MIN_LIMITE}
                        max={precioMax}
                        step={PRECIO_PASO}
                        value={precioMin}
                        onChange={handleMinInput}
                    />
                    <span className="filtros-panel__precio-guion">-</span>
                    <input
                        type="number"
                        className="filtros-panel__precio-input"
                        placeholder="Máximo"
                        min={precioMin}
                        max={PRECIO_MAX_LIMITE}
                        step={PRECIO_PASO}
                        value={precioMax}
                        onChange={handleMaxInput}
                    />
                </div>

                <div className="filtros-slider">
                    <div className="filtros-slider__track">
                        <div
                            className="filtros-slider__activo"
                            style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
                        ></div>
                    </div>
                    <input
                        type="range"
                        className="filtros-slider__input filtros-slider__input--min"
                        min={PRECIO_MIN_LIMITE}
                        max={PRECIO_MAX_LIMITE}
                        step={PRECIO_PASO}
                        value={precioMin}
                        onChange={handleMinChange}
                    />
                    <input
                        type="range"
                        className="filtros-slider__input filtros-slider__input--max"
                        min={PRECIO_MIN_LIMITE}
                        max={PRECIO_MAX_LIMITE}
                        step={PRECIO_PASO}
                        value={precioMax}
                        onChange={handleMaxChange}
                    />
                </div>
            </div>
        </aside>
    );
};

export default Filtros;