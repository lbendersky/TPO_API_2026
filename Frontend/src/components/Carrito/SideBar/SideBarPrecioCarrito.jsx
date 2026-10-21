import React from 'react'

const formatear = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)

export const SideBarPrecioCarrito = ({ total = 0 }) => {
  return (
    <div className="sidebar-precio">
      <div className="sidebar-precio__fila">
        <span className="sidebar-precio__etiqueta">Total a pagar</span>
        <div>
          <p className="sidebar-precio__monto">{formatear(total)}</p>
          <span className="sidebar-precio__moneda">Moneda nacional ARS</span>
        </div>
      </div>
    </div>
  )
}