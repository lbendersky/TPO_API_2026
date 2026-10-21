import React from 'react'

export const FechaHoraTipoDeCanchaTarjeta = ({ fechaHora, tipoSuperficie }) => {
  return (
    <div className="tarjeta-carrito__chips">
      <FechaTarjetaCarrito fecha={fechaHora} />
      <TipoDeCanchaTarjetaCarrito tipoCancha={tipoSuperficie} />
    </div>
  )
}
