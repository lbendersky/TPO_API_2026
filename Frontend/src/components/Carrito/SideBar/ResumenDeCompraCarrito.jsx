import React from 'react'
import { CantidadCanchasSeleccionadas } from '../CantidadCanchasSeleccionadas'
import { SubtotalCarrito } from './SubtotalCarrito'
import { SideBarPrecioCarrito } from './SideBarPrecioCarrito'
import './SideBar.css';

export const ResumenDeCompraCarrito = ({ total, items = [] }) => {
  return (
    <>
      <div className="resumen-compra__encabezado">
        <h3 className="resumen-compra__titulo">Resumen de compra</h3>
        <CantidadCanchasSeleccionadas
          className="cantidad-canchas--verde"
          cantidad={items.length}
        >
          Turnos
        </CantidadCanchasSeleccionadas>
      </div>

      <div className="resumen-compra__lineas">
        {items.map((item) => (
          <SubtotalCarrito
            key={item.idItem}
            etiqueta={`${item.nombreCancha} x${item.cantidad}`}
            subtotal={item.subtotal}
          />
        ))}
      </div>

      <SideBarPrecioCarrito total={total} />
    </>
  )
}
