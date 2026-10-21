import React from 'react'

export const FechaHoraTipoDeCanchaTarjeta = ({ fechaHora, tipoSuperficie}) => {
  return (
    <>
        <FechaTarjetaCarrito fecha={fechaHora}/>
        <TipoDeCanchaTarjetaCarrito tipoCancha={tipoSuperficie}/>
    </>
  )
}
