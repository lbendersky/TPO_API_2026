import React from 'react'
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { ImagenTarjetaCarrito } from './ImagenTarjetaCarrito'
import { NombreDeLaCanchaTarjeta } from './NombreDeLaCanchaTarjeta'

export const TarjetaCarrito = ({ item }) => {
  const [turno, setTurno] = useState([]);
  const [cancha, setCancha] = useState([])
  const [imgcancha, setImgcancha] = useState(null)

  useEffect(() => {
    fetch('${API_URL}/turnos/${item.idTurno}')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setTurno(data);
    })
    .catch((error) => {
        console.error("Error al cargar el carrito:", error);
    })
  }, [])

  useEffect(() => {
    fetch('${API_URL}/canchas/${turno.idCancha}')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setCancha(data);
    })
    .catch((error) => {
        console.error("Error al cargar el carrito:", error);
    })
  }, [])

  useEffect(() => {
    fetch('${API_URL}/imagenes/cancha/${turno.idCancha}')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setimgcancha(data);
    })
    .catch((error) => {
        console.error("Error al cargar el carrito:", error);
    })
  }, [])
  
  return (
    <>
      <ImagenTarjetaCarrito imagen={`data:image/png;base64,${imgcancha.file}`} tipoCancha={turno.tipoFutbol}/>
      <NombreDeLaCanchaTarjeta nombre={item.nombreCancha}/>
      <LocalizacionDeLaCanchaTarjeta localizacion={cancha.localidad}/>
      <FechaHoraTipoDeCanchaTarjeta fechaHora={item.fechaHora} tipoCancha={item.tipoFutbol}/>
    </>
  )
}
