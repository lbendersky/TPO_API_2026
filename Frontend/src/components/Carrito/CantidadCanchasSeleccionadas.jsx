import React from 'react'

export const CantidadCanchasSeleccionadas = ({ cantidad, className = '', children }) => {
  return (
    <p className={className}>
      {cantidad}{children ? ` ${children}` : ''}
    </p>
  )
}