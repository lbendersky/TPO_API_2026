import React from 'react'
import { ImagenTarjeta } from './ImagenTarjeta'
import { TipoCanchaTarjeta } from './TipoCanchaTarjeta'

export const ImagenTarjetaCarrito = ({ imagen, tipoCancha }) => {
  return (
    <>
        <TipoCanchaTarjeta tipoCancha={tipoCancha}/>
        <ImagenTarjeta imagen={imagen}/>        
    </>
  )
}
