import React from 'react'
import { CantidadCanchasSeleccionadas } from '../CantidadCanchasSeleccionadas'
import { SubtotalCarrito } from './SubtotalCarrito'

export const ResumenDeCompraCarrito = ({ total, items }) => {
  return (
    <>
        <h3>Resumen de compra</h3>
        <CantidadCanchasSeleccionadas cantidad={items.length}>Turnos</CantidadCanchasSeleccionadas>
        {items.map((item) => (
          <SubtotalCarrito key={item.idItem} subtotal={item.subtotal} />
        ))}
        <h4>Total a pagar {total}</h4>
    </>
  )
}
