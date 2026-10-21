import React from 'react'

export const ImagenTarjeta = ({ imagen, alt = 'Imagen de la cancha' }) => {
  return (
    <img className="tarjeta-carrito__img" src={imagen} alt={alt} />
  )
}