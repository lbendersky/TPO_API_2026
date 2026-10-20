import React from 'react'

export const ResumenDeCompraCarrito = ({ cantidad }) => {
  return (
    <>
        <h2>Resumen de compra</h2>
        <CantidadCanchasSeleccionadas cantidad={cantidad}>Turnos</CantidadCanchasSeleccionadas>
        <SubtotalCarrito/>
    </>
  )
}
