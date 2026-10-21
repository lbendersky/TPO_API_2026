import React from 'react'

const formatear = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

export const SubtotalCarrito = ({ etiqueta = 'Subtotal', subtotal = 0, descuento = false }) => {
  return (
    <div className={`resumen-linea ${descuento ? 'resumen-linea--descuento' : ''}`}>
      <span>{etiqueta}</span>
      <span className="resumen-linea__monto">
        {descuento ? '-' : ''}{formatear(subtotal)}
      </span>
    </div>
  )
}