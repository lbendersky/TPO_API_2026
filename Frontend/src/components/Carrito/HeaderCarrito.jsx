import './HeaderCarrito.css';
import { Fragment } from 'react';

const ETAPAS = ['Carrito', 'Confirmación'];

export const HeaderCarrito = ({ etapaActual = 1 }) => {
    return (
        <header className="header-carrito">
            <div>
                <span className="header-carrito__etiqueta">Checkout de turnos</span>
                <h2 className="header-carrito__titulo">Carrito de compras</h2>
                <p className="header-carrito__subtitulo">
                    Asegurá tu horario antes de que venza la prioridad de match
                </p>
            </div>

            <nav className="etapas-checkout" aria-label="Pasos del checkout">
                {ETAPAS.map((nombre, i) => (
                    <Fragment key={nombre}>
                        <div className={`etapa ${i + 1 === etapaActual ? 'etapa--activa' : ''}`}>
                            <span className="etapa__numero">{i + 1}</span>
                            <span>{nombre}</span>
                        </div>
                        {i < ETAPAS.length - 1 && <span className="etapa__separador">›</span>}
                    </Fragment>
                ))}
            </nav>
        </header>
    );
};