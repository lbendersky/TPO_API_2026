import React from 'react'
import { FechaTarjetaCarrito } from './FechaTarjetaCarrito'
import { TipoDeCanchaTarjetaCarrito } from './TipoDeCanchaTarjetaCarrito'

export const FechaHoraTipoDeCanchaTarjeta = ({ fechaHora, tipoSuperficie }) => {
  return (
    <div className="tarjeta-carrito__chips">
      <FechaTarjetaCarrito fecha={fechaHora} />
      <TipoDeCanchaTarjetaCarrito tipoCancha={tipoSuperficie} />
    </div>
  )
}