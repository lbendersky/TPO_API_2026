import React from 'react'

const formatear = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

export const PrecioDelTurno = ({ precioConDescuento = 0 }) => {
  return (
    <div className="precio-turno">
      <span className="precio-turno__final">{formatear(precioConDescuento)}</span>
    </div>
  )
}
