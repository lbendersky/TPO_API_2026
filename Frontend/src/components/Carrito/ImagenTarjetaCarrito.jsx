import React from 'react'
import { ImagenTarjeta } from './ImagenTarjeta'
import { TipoCanchaTarjeta } from './TipoFutbolTarjeta'

export const ImagenTarjetaCarrito = ({ imagen, tipoCancha }) => {
  return (
    <>
        <TipoFutbolTarjeta tipoCancha={tipoCancha}/>
        <ImagenTarjeta imagen={imagen}/>        
    </>
  )
}
