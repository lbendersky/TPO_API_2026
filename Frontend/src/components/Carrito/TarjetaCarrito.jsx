import React from 'react'
import { ImagenTarjetaCarrito } from './ImagenTarjetaCarrito'

export const TarjetaCarrito = ({ item }) => {
  return (
    <>
        <ImagenTarjetaCarrito imagen={item.imagen} tipoCancha={item.tipoFutbol}/>
    </>
  )
}
