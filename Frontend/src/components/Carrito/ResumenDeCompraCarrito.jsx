import './ResumenDeCompraCarrito.css';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Boton } from '../Boton/Boton';
import { formatearMoneda } from '../../utils/moneda';

export const ResumenDeCompraCarrito = ({ onConfirmarReserva }) => {
    const { items = [], loading } = useSelector((state) => state.carrito);

    const total = useMemo(() => {
        if (!Array.isArray(items)) return 0;
        return items.reduce((acc, item) => {
            const precio = Number(
                item.precioUnitario ||
                item.precio_unitario ||
                item.turno?.precioPorJugador ||
                item.turno?.precio_por_jugador ||
                item.precio ||
                0
            );
            const cantidad = Number(item.cantidad || 1);
            const subtotal = item.subtotal ?? item.subTotal ?? (precio * cantidad);
            return acc + Number(subtotal);
        }, 0);
    }, [items]);

    return (
        <>
            <div className="resumen-compra__encabezado">
                <h3 className="resumen-compra__titulo">Resumen de compra</h3>
                <p className="cantidad-canchas--verde">{items.length} Turnos</p>
            </div>

            <div className="resumen-compra__lineas">
                {items.map((item) => {
                    const id = item.idItem ?? item.id_item ?? item.id;
                    const precio = Number(
                        item.precioUnitario ||
                        item.precio_unitario ||
                        item.turno?.precioPorJugador ||
                        item.precio ||
                        0
                    );
                    const cantidad = Number(item.cantidad || 1);
                    const subtotal = item.subtotal ?? item.subTotal ?? (precio * cantidad);

                    return (
                        <div key={id} className="resumen-linea">
                            <span>{item.nombreCancha ?? item.cancha?.nombre} x{cantidad}</span>
                            <span className="resumen-linea__monto">
                                {formatearMoneda(subtotal)}
                            </span>
                        </div>
                    );
                })}
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

            <Boton
                type="button"
                variante="primario"
                ancho="completo"
                onClick={onConfirmarReserva}
                disabled={items.length === 0 || loading}
            >
                Confirmar Reserva
            </Boton>
        </>
    );
};