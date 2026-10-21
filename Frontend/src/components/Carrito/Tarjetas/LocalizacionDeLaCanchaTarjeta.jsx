import React from 'react'

export const LocalizacionDeLaCanchaTarjeta = ({ localizacion, direccion  }) => {
  return (
      <p className="tarjeta-carrito__ubicacion">{localizacion} - {direccion}</p>
  )
}
