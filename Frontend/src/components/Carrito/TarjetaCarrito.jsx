import React from 'react'
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { ImagenTarjetaCarrito } from './ImagenTarjetaCarrito'
import { NombreDeLaCanchaTarjeta } from './NombreDeLaCanchaTarjeta'

export const TarjetaCarrito = ({ item }) => {

  useEffect(() => {
    fetch('${API_URL}/canchas/${item.idCancha}')
  }, [])
  
  return (
    <>
      <ImagenTarjetaCarrito imagen={item.imagen} tipoCancha={item.tipoFutbol}/>
      <NombreDeLaCanchaTarjeta nombre={item.nombreCancha}/>
      <LocalizacionDeLaCanchaTarjeta localizacion={item.localidad}/>
      <FechaHoraTipoDeCanchaTarjeta fechaHora={item.fechaHora} tipoCancha={item.tipoFutbol}/>
    </>
  )
}
