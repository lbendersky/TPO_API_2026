import './ResumenDeCompraCarrito.css';
import { Boton } from '../Boton/Boton';
import { formatearMoneda } from '../../utils/moneda';

export const ResumenDeCompraCarrito = ({ total, items = [], onConfirmarReserva, disabled = false }) => {
    return (
        <>
            <div className="resumen-compra__encabezado">
                <h3 className="resumen-compra__titulo">Resumen de compra</h3>
                <p className="cantidad-canchas--verde">{items.length} Turnos</p>
            </div>

            <div className="resumen-compra__lineas">
                {items.map((item) => (
                    <div key={item.idItem} className="resumen-linea">
                        <span>{item.nombreCancha} x{item.cantidad}</span>
                        <span className="resumen-linea__monto">{formatearMoneda(item.subtotal)}</span>
                    </div>
                ))}
            </div>

            <div className="sidebar-precio">
                <div className="sidebar-precio__fila">
                    <span className="sidebar-precio__etiqueta">Total a pagar</span>
                    <div>
                        <p className="sidebar-precio__monto">{formatearMoneda(total)}</p>
                        <span className="sidebar-precio__moneda">Moneda nacional ARS</span>
                    </div>
                </div>
            </div>

            <Boton type="button" variante="primario" ancho="completo" onClick={onConfirmarReserva} disabled={disabled}>
                Confirmar Reserva
            </Boton>
        </>
    );
};