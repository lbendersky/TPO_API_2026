import React from 'react'
import { ImagenTarjeta } from './ImagenTarjeta'
import { TipoFutbolTarjeta } from './TipoFutbolTarjeta'

export const ImagenTarjetaCarrito = ({ imagen, tipoCancha }) => {
  return (
    <div className="tarjeta-carrito__imagen">
      <ImagenTarjeta imagen={imagen} />
      <TipoFutbolTarjeta tipoCancha={tipoCancha} />
    </div>
  )
}